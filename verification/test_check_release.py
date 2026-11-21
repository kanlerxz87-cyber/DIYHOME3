import tempfile
from pathlib import Path
import unittest

from check_release import audit, DEFAULT_URL, DISCLOSURE


class ReleaseTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.write('index.html', self.html('', '<a href="guide/#buy">Guide</a>',
                                          '<link rel="alternate" type="application/rss+xml" href="feed.xml">'))
        self.write('guide/index.html', self.html('guide/', '<h1 id="buy">Guide</h1>'))
        self.write('review/index.html', self.html('review/', '<h1>Review</h1>'))
        self.write('sitemap.xml', f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                   f'<url><loc>{DEFAULT_URL}</loc></url><url><loc>{DEFAULT_URL}guide/</loc></url></urlset>')
        self.write('feed.xml', f'<rss version="2.0"><channel><item><link>{DEFAULT_URL}guide/</link></item></channel></rss>')

    def write(self, name, content):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding='utf-8')

    def html(self, route, body, head='', footer=None):
        footer = (f'{DISCLOSURE}<nav aria-label="All sections">'
                  f'<a href="{DEFAULT_URL}review/">Flagged for Review</a></nav>'
                  if footer is None else footer)
        return (f'<html><head><link rel="canonical" href="{DEFAULT_URL}{route}">{head}</head><body>'
                f'<header>Home</header><aside>{DISCLOSURE}</aside><main>{body}</main>'
                f'<footer>{footer}</footer></body></html>')

    def check(self):
        return audit(self.root, DEFAULT_URL, dashboard=['review/'], guides=['guide/'])

    def test_artifact_with_project_prefix_and_relative_links_passes(self):
        self.assertEqual(([], 3), self.check())

    def test_detects_broken_fragment_unsponsored_link_and_missing_footer(self):
        self.write('guide/index.html', self.html('guide/',
                   '<a href="https://www.amazon.com/dp/B08FKW9JRM">Evidence</a>', footer=''))
        errors, _ = self.check()
        self.assertEqual(5, len(errors), errors)
        for phrase in ('missing fragment ID', 'missing rel=sponsored',
                       'statement missing from footer', 'no footer navigation group',
                       'footer has no internal links'):
            self.assertTrue(any(phrase in error for error in errors), errors)

    def test_rejects_cross_project_assets(self):
        page = self.root / 'guide/index.html'
        page.write_text(page.read_text().replace('<main>', '<main><img src="/assets/example.png">'))
        errors, _ = self.check()
        self.assertTrue(any('escapes the Pages project prefix' in error for error in errors))

    def test_flags_noncanonical_feed_entries(self):
        self.write('feed.xml', f'<rss><channel><item><link>{DEFAULT_URL}guide/index.html</link></item></channel></rss>')
        errors, _ = self.check()
        self.assertTrue(any('not the page’s declared canonical URL' in error for error in errors))
        self.assertTrue(any('missing from sitemap' in error for error in errors))

    def test_href_less_footer_still_fails_dashboard_check(self):
        self.write('guide/index.html', self.html('guide/', '<h1 id="buy">Guide</h1>', footer=DISCLOSURE))
        errors, _ = self.check()
        self.assertEqual(['guide/index.html: no footer navigation group',
                          'guide/index.html: footer has no internal links'], errors)

    def test_partial_footer_navigation_removal_is_caught(self):
        """Positive control for the rule this session strengthened. Before it, deleting one
        link from the footer group still passed, because the footer was merely non-empty."""
        self.write('guide/index.html', self.html('guide/', '<h1 id="buy">Guide</h1>',
                   footer=f'{DISCLOSURE}<nav aria-label="All sections">'
                          f'<a href="{DEFAULT_URL}">Home</a></nav>'))
        errors, _ = self.check()
        self.assertEqual(['guide/index.html: footer navigation missing review/'], errors)

    def test_footer_navigation_inside_a_different_nav_does_not_count(self):
        self.write('guide/index.html', self.html('guide/', '<h1 id="buy">Guide</h1>',
                   footer=f'{DISCLOSURE}<nav aria-label="Elsewhere">'
                          f'<a href="{DEFAULT_URL}review/">Flagged for Review</a></nav>'))
        errors, _ = self.check()
        self.assertEqual(['guide/index.html: no footer navigation group'], errors)


if __name__ == '__main__':
    unittest.main()
