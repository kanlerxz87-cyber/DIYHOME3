# Release verification

Run the offline check against the **deployed artifact**, not a source/template folder:

```sh
python3 verification/check_release.py /path/to/artifact \
  --dashboard flagged/ --guide guides/example/
```

Replace the example route values with the actual artifact routes, and repeat the flags for the full dashboard and guide set. Use `--base` only if the official production URL differs from the repository's Pages URL. The checker uses Python 3.9+ with no external dependencies. Run its tests with `python3 -m unittest discover -s verification -v`.

The checker verifies local anchor and asset targets, origin and project-path boundaries, canonical URLs, sitemap/feed consistency, the Associates statement before main content and in the footer, and `rel=sponsored` on recognizable Amazon product anchors. `--dashboard` also checks that the designated routes are linked from every footer; `--guide` checks complete feed coverage for the supplied guide set. It cannot prove rendered above-the-fold placement or link-local disclosures, commercial intent, indexing, or remote availability. External source evidence and release gates are documented in [evidence.md](evidence.md).

Before declaring the release live, use the GitHub Pages deployment record to verify that the deployed commit is the merged commit, then fetch the live home, an editorial route, the flagged page, the sitemap, feed, and shared assets. A previously successful Pages build is not evidence for a newer release. Analytics hosting, authorization, and attributed conversions each require their own positive evidence.
