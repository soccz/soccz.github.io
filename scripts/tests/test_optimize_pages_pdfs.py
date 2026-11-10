import importlib.util
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import pymupdf


SCRIPT = Path(__file__).resolve().parents[1] / "optimize-pages-pdfs.py"
SPEC = importlib.util.spec_from_file_location("pdf_optimizer", SCRIPT)
optimizer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(optimizer)


class ReportOptimizationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(
            dir=os.environ.get("TMPDIR", SCRIPT.parent)
        )
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.reports = self.root / "reports"
        self.cache = self.root / "cache"
        self.reports.mkdir()
        self.cache.mkdir()
        self.source = self.reports / "report.pdf"
        with pymupdf.open() as document:
            page = document.new_page()
            page.insert_font(fontname="report", fontbuffer=pymupdf.Font("cjk").buffer)
            page.insert_text((40, 60), "Report 123 / 기업 분석", fontname="report")
            page.insert_link(
                {
                    "kind": pymupdf.LINK_URI,
                    "from": pymupdf.Rect(40, 80, 150, 100),
                    "uri": "https://example.com/source",
                }
            )
            document.set_toc([[1, "Report", 1]])
            document.set_metadata({"producer": "WeasyPrint test", "title": "Report"})
            document.save(self.source)
        self.original = self.source.read_bytes()

    def test_compresses_report_and_reuses_verified_cache(self):
        original_mode = self.source.stat().st_mode
        result = optimizer.optimize((self.source, self.cache))
        self.assertLess(result[1], result[0] / 2)
        self.assertFalse(result[4], result[4])
        self.assertEqual(self.source.stat().st_mode, original_mode)
        baseline = self.root / "original.pdf"
        baseline.write_bytes(self.original)
        optimizer.check_equivalent(baseline, self.source)
        optimized = self.source.read_bytes()
        self.source.write_bytes(self.original)
        with patch.object(
            optimizer.subprocess,
            "run",
            side_effect=AssertionError("cache should avoid conversion"),
        ):
            result = optimizer.optimize((self.source, self.cache))
        self.assertTrue(result[3])
        self.assertEqual(self.source.read_bytes(), optimized)

    def test_converter_failure_keeps_complete_original(self):
        with patch.object(
            optimizer.subprocess,
            "run",
            side_effect=subprocess.CalledProcessError(1, "gs"),
        ):
            result = optimizer.optimize((self.source, self.cache))
        self.assertEqual(self.source.read_bytes(), self.original)
        self.assertIn("CalledProcessError", result[4])
        self.assertEqual(list(self.cache.glob("*.pdf")), [])

    def test_changed_text_is_not_published(self):
        def altered_converter(command, **_):
            output = next(
                argument.removeprefix("-sOutputFile=")
                for argument in command
                if argument.startswith("-sOutputFile=")
            )
            with pymupdf.open() as document:
                page = document.new_page()
                page.insert_text((40, 60), "Different report")
                document.set_toc([[1, "Report", 1]])
                document.set_metadata({"producer": "test", "title": "Report"})
                document.save(output)

        with patch.object(optimizer.subprocess, "run", side_effect=altered_converter):
            result = optimizer.optimize((self.source, self.cache))
        self.assertEqual(self.source.read_bytes(), self.original)
        self.assertIn("text changed", result[4])

    def test_changed_link_is_rejected(self):
        candidate = self.root / "changed-link.pdf"
        with pymupdf.open(self.source) as document:
            page = document[0]
            link = page.get_links()[0]
            link["uri"] = "https://example.com/wrong"
            page.update_link(link)
            document.save(candidate)
        with self.assertRaisesRegex(ValueError, "link destinations changed"):
            optimizer.check_equivalent(self.source, candidate)

    def test_visible_change_with_same_text_is_rejected(self):
        candidate = self.root / "changed-image.pdf"
        with pymupdf.open(self.source) as document:
            document[0].draw_rect(
                pymupdf.Rect(40, 200, 500, 600), color=(1, 0, 0), fill=(1, 0, 0)
            )
            document.save(candidate)
        with self.assertRaisesRegex(ValueError, "rendered page changed"):
            optimizer.check_equivalent(self.source, candidate)

    def test_named_and_explicit_links_resolve_to_the_same_target(self):
        named = self.root / "named-link.pdf"
        explicit = self.root / "explicit-link.pdf"
        wrong = self.root / "wrong-target.pdf"
        with pymupdf.open(self.source) as document:
            page = document[0]
            page.insert_link(
                {
                    "kind": pymupdf.LINK_GOTO,
                    "from": pymupdf.Rect(40, 130, 150, 150),
                    "page": 0,
                    "to": pymupdf.Point(40, 100),
                }
            )
            page = document.reload_page(page)
            link = next(
                link for link in page.get_links() if link["kind"] == pymupdf.LINK_GOTO
            )
            document.xref_set_key(link["xref"], "A", "null")
            document.xref_set_key(link["xref"], "Dest", "(target)")
            document.xref_set_key(
                document.pdf_catalog(),
                "Names",
                f"<< /Dests << /Names [(target) [{page.xref} 0 R /XYZ 40 700 null]] >> >>",
            )
            document.save(named)
        with pymupdf.open(named) as document:
            page = document[0]
            link = next(
                link for link in page.get_links() if link["kind"] == pymupdf.LINK_NAMED
            )
            document.xref_set_key(link["xref"], "Dest", "null")
            document.xref_set_key(
                link["xref"],
                "A",
                f"<< /S /GoTo /D [{page.xref} 0 R /XYZ 40 700 null] >>",
            )
            document.save(explicit)
            document.xref_set_key(
                link["xref"],
                "A",
                f"<< /S /GoTo /D [{page.xref} 0 R /XYZ 40 600 null] >>",
            )
            document.save(wrong)
        optimizer.check_equivalent(named, explicit)
        with self.assertRaisesRegex(ValueError, "link destinations changed"):
            optimizer.check_equivalent(named, wrong)

    def test_small_missing_image_is_rejected(self):
        original = self.root / "with-image.pdf"
        changed = self.root / "changed-small-image.pdf"
        image = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, 10, 10), False)
        image.clear_with(0)
        with pymupdf.open(self.source) as document:
            xref = document[0].insert_image(
                pymupdf.Rect(40, 200, 60, 220), pixmap=image
            )
            document.save(original)
        image.clear_with(255)
        with pymupdf.open(original) as document:
            document[0].replace_image(xref, pixmap=image)
            document.save(changed)
        with self.assertRaisesRegex(ValueError, "rendered page changed"):
            optimizer.check_equivalent(original, changed)

    def test_corrupt_cache_is_not_published(self):
        result = optimizer.optimize((self.source, self.cache))
        (self.cache / result[2]).write_bytes(b"corrupt cached data")
        self.source.write_bytes(self.original)
        result = optimizer.optimize((self.source, self.cache))
        self.assertFalse(result[3])
        self.assertFalse(result[4], result[4])
        self.assertTrue(self.source.read_bytes().startswith(b"%PDF"))

    def test_annotated_report_is_preserved(self):
        annotated = self.root / "annotated.pdf"
        with pymupdf.open(self.source) as document:
            document[0].add_text_annot((40, 120), "Keep this review note")
            document.save(annotated)
        self.source.write_bytes(annotated.read_bytes())
        before = self.source.read_bytes()
        result = optimizer.optimize((self.source, self.cache))
        self.assertEqual(self.source.read_bytes(), before)
        self.assertIn("annotated", result[4])


if __name__ == "__main__":
    unittest.main()
