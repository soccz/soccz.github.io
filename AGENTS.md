# Repository Guidance

- This is a build-free static GitHub Pages site. A push to `main` deploys the repository root through `.github/workflows/static.yml`.
- Keep standalone case studies under `projects/<slug>/index.html`; use root-relative links so they also work on GitHub Pages.
- To surface a case study on the home/blog UI, update the relevant category match, `DESCS`, `STATIC_PROJECTS` when needed, and `PROJECT_PAGES` in `index.html`.
- Several project pages are refreshed by automation. Avoid unrelated edits, especially under `projects/xsec-alpha/`, `projects/prelude/`, and `projects/k-e-r/`.
- Do not publish credentials, private endpoints, exploit details, participant data, or claims that are only proposed. Label prototype observations, internal audits, and unrun research separately.
- Before publishing, parse changed HTML, serve it locally, check internal links and assets, inspect desktop/mobile screenshots, and confirm `git status` contains only intended files.
