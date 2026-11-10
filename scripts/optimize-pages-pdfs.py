#!/usr/bin/env python3
"""Shrink deployment copies of generated reports; preserve originals on any mismatch."""

import argparse
from concurrent.futures import ProcessPoolExecutor
import hashlib
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replace_copy(source, destination):
    # A cancelled job must leave a complete original or a complete replacement.
    with tempfile.NamedTemporaryFile(
        dir=destination.parent, prefix=".pdf-", delete=False
    ) as output:
        temporary = Path(output.name)
    try:
        shutil.copyfile(source, temporary)
        shutil.copymode(destination if destination.exists() else source, temporary)
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)


def link_destinations(page):
    import pymupdf

    destinations = []
    for link in page.get_links():
        kind = link["kind"]
        if kind == pymupdf.LINK_NAMED and link.get("nameddest"):
            target, x, y = page.parent.resolve_link(f"#{link['nameddest']}")
            if target >= 0:
                destinations.append(
                    ("internal", str(target), str(round(x, 1)), str(round(y, 1)))
                )
                continue
        if kind == pymupdf.LINK_GOTO and link.get("page", -1) >= 0:
            point = link["to"]
            destinations.append(
                (
                    "internal",
                    str(link["page"]),
                    str(round(point.x, 1)),
                    str(round(point.y, 1)),
                )
            )
        else:
            destinations.append(
                (
                    "other",
                    str(kind),
                    link.get("uri", ""),
                    link.get("file", ""),
                    link.get("nameddest", ""),
                )
            )
    return sorted(destinations)


def check_render(left, right, clip=None):
    # Allow tiny rasterizer/font-hinting differences; reject visible changes.
    a = left.get_pixmap(alpha=False, clip=clip)
    b = right.get_pixmap(alpha=False, clip=clip)
    if (a.width, a.height, a.n) != (b.width, b.height, b.n):
        raise ValueError("rendered page dimensions changed")
    mean_error = sum(abs(x - y) for x, y in zip(a.samples, b.samples)) / len(a.samples)
    if mean_error > 1.0:
        raise ValueError("rendered page changed")


def check_equivalent(original, candidate):
    import pymupdf

    with pymupdf.open(original) as before, pymupdf.open(candidate) as after:
        if len(before) != len(after) or before.get_toc() != after.get_toc():
            raise ValueError("page count or bookmarks changed")
        for field in ("title", "author", "subject", "keywords"):
            if before.metadata.get(field) != after.metadata.get(field):
                raise ValueError(f"document {field} changed")
        for left, right in zip(before, after):
            if any(abs(a - b) > 0.01 for a, b in zip(left.rect, right.rect)):
                raise ValueError("page dimensions changed")
            if left.get_text() != right.get_text():
                raise ValueError("extracted text changed")

            if link_destinations(left) != link_destinations(right):
                raise ValueError("link destinations changed")
            check_render(left, right)
            for image in left.get_image_info():
                clip = pymupdf.Rect(image["bbox"]) & left.rect
                if not clip.is_empty:
                    check_render(left, right, clip)


def optimize(job):
    source, cache = map(Path, job)
    before_size = source.stat().st_size
    source_hash = digest(source)
    for cached in cache.glob(f"{source_hash}.*.pdf"):
        if cached.name == f"{source_hash}.{digest(cached)}.pdf":
            replace_copy(cached, source)
            return before_size, source.stat().st_size, cached.name, True, ""
    try:
        import pymupdf

        with pymupdf.open(source) as document:
            if not document.metadata.get("producer", "").startswith("WeasyPrint"):
                return (
                    before_size,
                    before_size,
                    "",
                    False,
                    "not a generated WeasyPrint report",
                )
            if (
                document.is_form_pdf
                or document.embfile_count()
                or document.markinfo.get("Marked")
                or document.get_ocgs()
            ):
                return (
                    before_size,
                    before_size,
                    "",
                    False,
                    "interactive or tagged document preserved",
                )
            if any(page.first_annot is not None for page in document):
                return (
                    before_size,
                    before_size,
                    "",
                    False,
                    "annotated document preserved",
                )
        with tempfile.TemporaryDirectory(dir=cache, prefix="work-") as directory:
            candidate = Path(directory) / "optimized.pdf"
            subprocess.run(
                [
                    "gs",
                    "-q",
                    "-dSAFER",
                    "-dBATCH",
                    "-dNOPAUSE",
                    "-dPDFSTOPONERROR",
                    "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.7",
                    "-dDetectDuplicateImages=true",
                    "-dCompressFonts=true",
                    "-dSubsetFonts=true",
                    "-dDownsampleColorImages=false",
                    "-dDownsampleGrayImages=false",
                    "-dDownsampleMonoImages=false",
                    "-dPassThroughJPEGImages=true",
                    "-dPassThroughJPXImages=true",
                    "-dAutoFilterColorImages=false",
                    "-dColorImageFilter=/FlateEncode",
                    "-dAutoFilterGrayImages=false",
                    "-dGrayImageFilter=/FlateEncode",
                    "-sColorConversionStrategy=LeaveColorUnchanged",
                    f"-sOutputFile={candidate}",
                    str(source),
                ],
                check=True,
                capture_output=True,
                timeout=90,
            )
            if candidate.stat().st_size >= before_size:
                return (
                    before_size,
                    before_size,
                    "",
                    False,
                    "original is already smaller",
                )
            check_equivalent(source, candidate)
            cached = cache / f"{source_hash}.{digest(candidate)}.pdf"
            replace_copy(candidate, cached)
            replace_copy(cached, source)
            return before_size, source.stat().st_size, cached.name, False, ""
    except Exception as error:
        # Never replace a report that failed conversion or verification.
        return (
            before_size,
            before_size,
            "",
            False,
            f"{source}: {type(error).__name__}: {error}",
        )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=min(4, os.cpu_count() or 1))
    arguments = parser.parse_args()
    root, cache = arguments.root.resolve(), arguments.cache.resolve()
    if root == cache or root in cache.parents or cache in root.parents:
        parser.error("report and cache directories must not contain each other")
    if not root.is_dir() or arguments.workers < 1:
        parser.error("report directory must exist and workers must be positive")
    cache.mkdir(parents=True, exist_ok=True)
    sources = sorted(root.rglob("*.pdf"))
    jobs = [(str(source), str(cache)) for source in sources]
    results = []
    with ProcessPoolExecutor(max_workers=arguments.workers) as pool:
        for index, result in enumerate(pool.map(optimize, jobs), 1):
            results.append(result)
            if index % 100 == 0:
                print(f"Checked {index}/{len(sources)} PDFs", flush=True)
    active = {result[2] for result in results if result[2]}
    for entry in cache.glob("*.pdf"):
        if (
            re.fullmatch(r"[0-9a-f]{64}\.[0-9a-f]{64}\.pdf", entry.name)
            and entry.name not in active
        ):
            entry.unlink()
    before = sum(result[0] for result in results)
    after = sum(result[1] for result in results)
    kept = [result[4] for result in results if result[4]]
    cached = sum(result[3] for result in results)
    summary = f"{len(sources)} PDFs: {before:,} -> {after:,} bytes; {cached} reused from cache; {len(kept)} originals retained."
    print(summary, flush=True)
    for reason in kept[:10]:
        print(f"Original retained: {reason}")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as output:
            output.write(
                f"### Report PDF optimization\n\n{summary}\n\nOriginal repository files and public URLs are retained; optimization affects deployment copies only.\n"
            )


if __name__ == "__main__":
    main()
