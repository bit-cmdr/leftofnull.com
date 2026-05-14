# leftofnull

Source for [leftofnull.com](https://leftofnull.com), a Jekyll blog deployed via GitHub Pages from the `gh-pages` branch.

## Prerequisites

- Ruby (any version supported by the current [github-pages gem](https://pages.github.com/versions/) — currently 3.x)
- Bundler

GitHub Pages builds the site with its own pinned gem set, so the `Gemfile` here is only used for local development. The published site is rebuilt automatically when you push to `gh-pages`.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

The site will be served at <http://localhost:4000>. Drafts in `_drafts/` can be previewed with `--drafts`.

## Adding a post

Drop a file into `_posts/` named `YYYY-MM-DD-some-slug.md` with frontmatter that matches the existing posts (see `_posts/2025-09-10-aws-with-mfa-and-one-password.md` for a recent example).
