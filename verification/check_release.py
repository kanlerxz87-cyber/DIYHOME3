#!/usr/bin/env python3
"""Offline release smoke checks for the generated GitHub Pages artifact."""
import argparse
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

DEFAULT_URL = 'https://kanlerxz87-cyber.github.io/DIYHOME3/'
DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.'
PRODUCT = re.compile(r'/(?:dp|gp/product)/[A-Za-z0-9]{10}(?:/|$)')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.canonicals = []
        self.feeds = []
        self.text = defaultdict(list)
        self.region = 'masthead area'
        self.skip_text = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'a' and a.get('name'):
            self.ids.add(a['name'])
        if tag in {'script', 'style'}:
            self.skip_text = True
        if tag == 'main':
            self.region = 'main'
        if tag == 'footer':
            self.region = 'footer'
        if tag == 'a' and a.get('href'):
            self.links.append((a['href'], set((a.get('rel') or '').lower().split()), self.region))
        if tag == 'link' and a.get('href'):
            rel = (a.get('rel') or '').lower().split()
            if 'canonical' in rel:
                self.canonicals.append(a['href'])
                return
            if 'alternate' in rel and a.get('type') in {'application/rss+xml', 'application/atom+xml'}:
                self.feeds.append(a['href'])
        key = 'href' if tag == 'link' else 'src' if tag in {'img', 'script', 'source', 'video', 'audio'} else None
        if key and a.get(key):
            self.links.append((a[key], set(), self.region))

    def handle_endtag(self, tag):
        if tag in {'script', 'style'}:
            self.skip_text = False
        if tag == 'footer':
            self.region = 'after footer'

    def handle_data(self, text):
        if not self.skip_text:
            self.text[self.region].append(text)


def local_file(root, base, url):
    """Return an artifact file for a same-origin URL, or None for an external URL."""
    parsed = urlsplit(url)
    origin = urlsplit(base)
    if (parsed.scheme, parsed.netloc) != (origin.scheme, origin.netloc):
        return None
    path = unquote(parsed.path)
    prefix = unquote(origin.path)
    if not path.startswith(prefix):
        raise ValueError('same-origin URL escapes the Pages project prefix')
    target = (root / path[len(prefix):]).resolve()
    if not target.is_relative_to(root):
        raise ValueError('URL escapes the artifact directory')
    if target.is_dir() or path.endswith('/'):
        target /= 'index.html'
    if not target.is_file():
        raise ValueError('artifact file does not exist')
    return target


def is_product(url):
    parsed = urlsplit(url)
    host = parsed.hostname or ''
    if host in {'link.amazon', 'amzn.to', 'a.co'}:
        return True
    return bool((host == 'amazon.com' or host.endswith('.amazon.com')) and PRODUCT.search(parsed.path))


def audit(root, base, dashboard=(), guides=()):
    root = root.resolve()
    if not base.endswith('/') or urlsplit(base).scheme != 'https' or urlsplit(base).query or urlsplit(base).fragment:
        raise ValueError('base URL must be an HTTPS project URL ending in /')
    errors = []
    home = root / 'index.html'
    files = sorted(p for p in root.rglob('*.html') if not any(
        part.startswith('.') or part in {'node_modules', 'verification'} for part in p.relative_to(root).parts
    ))
    if home not in files:
        return ['index.html: missing from the artifact'], 0
    pages = {}
    for path in files:
        parser = Page()
        parser.feed(path.read_text(encoding='utf-8'))
        parser.close()
        pages[path] = parser

    def target(where, url, *, required=True, fragment=False):
        try:
            f = local_file(root, base, url)
            if required and f is None:
                raise ValueError('expected the canonical Pages origin')
            anchor = unquote(urlsplit(url).fragment)
            if f in pages and fragment and anchor and not anchor.startswith(':~:text=') and anchor not in pages[f].ids:
                raise ValueError('missing fragment ID')
            return f
        except ValueError as exc:
            errors.append(f'{where}: {url}: {exc}')
            return None

    canonical = {}
    footer_targets = defaultdict(set)
    for path, page in pages.items():
        name = path.relative_to(root).as_posix()
        route = name.removesuffix('index.html')
        served = urljoin(base, route)
        for region in ('masthead area', 'footer'):
            text = ' '.join(' '.join(page.text[region]).split())
            if DISCLOSURE not in text:
                errors.append(f'{name}: Associates statement missing from {region}')
        if len(page.canonicals) != 1 and name != '404.html':
            errors.append(f'{name}: expected exactly one canonical URL')
        if len(page.canonicals) == 1:
            url = page.canonicals[0]
            if urlsplit(url).query or urlsplit(url).fragment or target(name, url) != path:
                errors.append(f'{name}: canonical must resolve to this page without a query or fragment')
            else:
                canonical[path] = url
        for href, rel, region in page.links:
            absolute = urljoin(served, href)
            if is_product(absolute) and 'sponsored' not in rel:
                errors.append(f'{name}: missing rel=sponsored on {href}')
            f = target(name, absolute, required=False, fragment=True)
            if region == 'footer' and f:
                footer_targets[path].add(f)

    def xml(path):
        try:
            return ET.parse(path).getroot()
        except (OSError, ET.ParseError) as exc:
            errors.append(f'{path.relative_to(root)}: {exc}')
            return None

    sitemap = xml(root / 'sitemap.xml')
    indexed = set()
    if sitemap is not None:
        for loc in sitemap.findall('./{*}url/{*}loc'):
            url = (loc.text or '').strip()
            f = target('sitemap.xml', url)
            if f and canonical.get(f) != url:
                errors.append(f'sitemap.xml: {url}: not the page’s declared canonical URL')
            if url in indexed:
                errors.append(f'sitemap.xml: duplicate URL {url}')
            indexed.add(url)
    if base not in indexed:
        errors.append('sitemap.xml: missing the canonical homepage')

    feeds = pages[home].feeds
    if len(feeds) != 1:
        errors.append('index.html: expected one discoverable RSS or Atom feed')
    feed_urls = set()
    for href in feeds:
        feed_path = target('index.html feed', urljoin(base, href))
        if not feed_path:
            continue
        feed = xml(feed_path)
        if feed is None:
            continue
        urls = [(x.text or '').strip() for x in feed.findall('./channel/item/link')]
        urls += [x.get('href', '') for x in feed.findall('./{*}entry/{*}link') if x.get('rel', 'alternate') == 'alternate']
        if not urls:
            errors.append(f'{href}: no published entries')
        for url in urls:
            f = target(href, url)
            if f and canonical.get(f) != url:
                errors.append(f'{href}: {url}: not the page’s declared canonical URL')
            if url not in indexed:
                errors.append(f'{href}: {url}: missing from sitemap')
            if url in feed_urls:
                errors.append(f'{href}: duplicate entry URL {url}')
            feed_urls.add(url)

    for route in dashboard:
        f = target('required dashboard route', urljoin(base, route))
        if f:
            for page in pages:
                if f not in footer_targets[page]:
                    errors.append(f'{page.relative_to(root)}: footer missing {route}')
    for route in guides:
        f = target('required guide', urljoin(base, route))
        if f and canonical.get(f) not in feed_urls:
            errors.append(f'{route}: missing from feed')
    return errors, len(pages)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('root', type=Path, help='directory containing generated index.html and sitemap.xml')
    cli.add_argument('--base', default=DEFAULT_URL, help='canonical production URL ending in /')
    cli.add_argument('--dashboard', action='append', default=[], help='relative route required in every footer; repeatable')
    cli.add_argument('--guide', action='append', default=[], help='relative route required in the feed; repeatable')
    args = cli.parse_args()
    try:
        errors, count = audit(args.root, args.base, args.dashboard, args.guide)
    except (ValueError, OSError) as exc:
        cli.exit(2, f'{exc}\n')
    for error in errors:
        print(error)
    print(f'{count} HTML page(s) checked; {len(errors)} finding(s).')
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
