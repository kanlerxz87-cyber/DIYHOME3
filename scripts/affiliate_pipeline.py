#!/usr/bin/env python3
"""Policy-gated affiliate marketing automation & repository consistency CLI.

Automates deterministic intake, deduplication, official commission-rate lookup,
Special Link construction behind hard evidence gates, compliance auditing, and
first-party campaign ledger validation without external dependencies.

Rules enforced:
1. Intended product fields (`intended_asin`, `official_listing_url`,
   `confirmed_on`, `confirmation_source`) are never populated from
   `observed_redirect_target`.
2. Owner-supplied `link.amazon/*` short links are never declared invalid; their
   exact Associates attribution status is recorded as unresolved in public docs.
3. Special Links (`?tag=shopnow047c-20`) fail closed unless intent confirmation
   AND enrolled Associates workflow destination + report checks are present and
   the target host is an eligible non-Pages HTTPS origin.
4. Static prices, availability, customer star ratings, conversion scores, and
   revenue forecasts are rejected without authorized Creators API / first-party
   report provenance; Amazon Program Content is gated against unapproved AI use.
"""
from __future__ import annotations

import argparse
import csv
from datetime import date, datetime
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRACKING_ID = "shopnow047c-20"
ASSOCIATES_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases."
ASIN_RE = re.compile(r"^[A-Z0-9]{10}$")
AMAZON_DP_RE = re.compile(r"^/dp/([A-Z0-9]{10})/?$")
SLUG_RE = re.compile(r"^[a-z0-9-]{1,72}$")

EXPECTED_EVENTS = {"page_view", "guide_view", "outbound_click", "feed_click", "reported_order"}
LEDGER_COLUMNS = [
    "timestamp_utc",
    "source_url",
    "report_reference",
    "channel",
    "eligible_sessions",
    "clicks",
    "reported_orders",
]
FORBIDDEN_LEDGER_COLUMNS = {"conversion_score", "revenue_forecast", "estimated_earnings", "predicted_cvr"}
RETIRED_DOC_REFS = (
    "docs/analytics.html",
    "docs/assets/app.js",
    "scripts/check_site.py",
    "data/campaign-ledger.csv",
)

# Official Amazon Associates Standard Commission Income Statement (fixed rates).
# Source: https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ
OFFICIAL_COMMISSION_RATES = {
    "kitchen": {
        "category": "Kitchen",
        "standard_commission_rate_pct": "4.50%",
        "source_url": "https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ",
    },
    "tools": {
        "category": "Tools",
        "standard_commission_rate_pct": "3.00%",
        "source_url": "https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ",
    },
    "home": {
        "category": "Home",
        "standard_commission_rate_pct": "3.00%",
        "source_url": "https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ",
    },
    "home improvement": {
        "category": "Home Improvement",
        "standard_commission_rate_pct": "3.00%",
        "source_url": "https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ",
    },
}


def ingest_submissions(urls: list[str], observations: dict[str, dict] | None = None) -> list[dict]:
    """Build a 4-field-separated submission register preserving duplicate rows."""
    observations = observations or {}
    seen_first_row: dict[str, int] = {}
    records: list[dict] = []
    for index, raw in enumerate(urls, start=1):
        url = raw.strip()
        if not url:
            raise ValueError(f"Row {index}: empty URL")
        parts = urlsplit(url)
        if parts.scheme != "https" or not parts.netloc:
            raise ValueError(f"Row {index}: expected an HTTPS URL, got {url!r}")
        token = parts.path.strip("/").split("/")[-1] if parts.path.strip("/") else ""
        duplicate_of = seen_first_row.get(url)
        if duplicate_of is None:
            seen_first_row[url] = index
        obs = observations.get(url, {})
        observed_target = obs.get("observed_redirect_target")
        observed_asin = obs.get("observed_asin")
        if observed_asin and not ASIN_RE.fullmatch(observed_asin):
            raise ValueError(f"Row {index}: observed_asin {observed_asin!r} is not a 10-character ASIN")
        is_short_link = parts.hostname in {"link.amazon", "amzn.to", "a.co"}
        records.append(
            {
                "row": index,
                "submitted_url": url,
                "submitted_token": token,
                "token_is_10_char_asin": bool(ASIN_RE.fullmatch(token)),
                "duplicate_of": duplicate_of,
                "short_link_compliance_status": (
                    "unresolved_in_public_associates_docs" if is_short_link else "not_short_link"
                ),
                "intended_asin": None,
                "official_listing_url": None,
                "confirmed_on": None,
                "confirmation_source": None,
                "observed_asin": observed_asin,
                "observed_redirect_target": observed_target,
                "observed_on": obs.get("observed_on"),
            }
        )
    return records


def lookup_commission_rate(category_key: str) -> dict:
    """Return official fixed category rate metadata with zero revenue forecasting."""
    norm = " ".join(category_key.strip().lower().split())
    if norm not in OFFICIAL_COMMISSION_RATES:
        raise KeyError(f"Unmapped category {category_key!r}; verify directly on GRXPHT8U84RAYDXZ")
    entry = dict(OFFICIAL_COMMISSION_RATES[norm])
    entry.update(
        {
            "settlement_rule": "Reconcile actual earned commissions only from authorized Associates Central reports.",
            "conversion_score": None,
            "revenue_forecast": None,
        }
    )
    return entry


def build_special_link(
    *,
    intended_asin: str | None,
    official_listing_url: str | None,
    confirmed_on: str | None,
    confirmation_source: str | None,
    destination_checked_on: str | None,
    report_checked_on: str | None,
    report_reference: str | None,
    policy_reviewed_on: str | None,
    reviewer: str | None,
    deployment_origin: str,
    tracking_id: str = DEFAULT_TRACKING_ID,
    today: date | None = None,
) -> dict:
    """Construct a Special Link only when intent, workflow, and host gates pass."""
    ref_today = today or date.today()
    host_parts = urlsplit(deployment_origin)
    if host_parts.scheme != "https" or not host_parts.hostname:
        raise ValueError("deployment_origin must be an HTTPS origin")
    if host_parts.hostname == "github.io" or host_parts.hostname.endswith(".github.io"):
        raise ValueError("Commercial Special Links are blocked on GitHub Pages hosts (see GitHub Pages limits)")

    if not intended_asin or not ASIN_RE.fullmatch(intended_asin):
        raise ValueError("Confirmed 10-character intended_asin is required before building a Special Link")
    expected_listing = f"https://www.amazon.com/dp/{intended_asin}"
    if official_listing_url != expected_listing:
        raise ValueError(f"official_listing_url must equal {expected_listing!r}")
    if not confirmation_source or not confirmation_source.strip():
        raise ValueError("confirmation_source is required")
    if not report_reference or not SLUG_RE.fullmatch(report_reference):
        raise ValueError("Valid report_reference slug from enrolled Associates report test is required")
    if not reviewer or not reviewer.strip():
        raise ValueError("reviewer sign-off is required")

    for field_name, iso_val in (
        ("confirmed_on", confirmed_on),
        ("destination_checked_on", destination_checked_on),
        ("report_checked_on", report_checked_on),
        ("policy_reviewed_on", policy_reviewed_on),
    ):
        if not iso_val:
            raise ValueError(f"{field_name} date is required")
        parsed_day = date.fromisoformat(iso_val)
        if parsed_day > ref_today:
            raise ValueError(f"{field_name} ({iso_val}) cannot be in the future")

    if not re.fullmatch(r"[a-z0-9-]+-20", tracking_id):
        raise ValueError(f"Invalid US Associates tracking_id format: {tracking_id!r}")

    url = f"https://www.amazon.com/dp/{intended_asin}?tag={tracking_id}"
    parsed = urlsplit(url)
    assert parse_qs(parsed.query).get("tag") == [tracking_id]
    html_snippet = (
        f'<a href="{escape(url, quote=True)}" rel="sponsored noopener noreferrer">'
        f"See on Amazon (paid link)</a>"
    )
    return {
        "asin": intended_asin,
        "tracking_id": tracking_id,
        "special_link_url": url,
        "rel": "sponsored noopener noreferrer",
        "html": html_snippet,
        "required_site_disclosure": ASSOCIATES_DISCLOSURE,
    }


class _ComplianceHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.region = "masthead"
        self.skip = False
        self.text_by_region = {"masthead": [], "main": [], "footer": []}
        self.anchors: list[tuple[str, set[str]]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        ad = dict(attrs)
        if tag in {"script", "style"}:
            self.skip = True
        elif tag == "main":
            self.region = "main"
        elif tag == "footer":
            self.region = "footer"
        if tag == "a" and ad.get("href"):
            rel_tokens = set((ad.get("rel") or "").lower().split())
            self.anchors.append((ad["href"], rel_tokens))

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style"}:
            self.skip = False

    def handle_data(self, data: str) -> None:
        if not self.skip and self.region in self.text_by_region:
            self.text_by_region[self.region].append(data)


def check_html_compliance(
    html_text: str,
    *,
    creators_api_authorized: bool = False,
    ai_program_content_approved: bool = False,
    uses_program_content_in_ai: bool = False,
) -> list[str]:
    """Audit rendered HTML against Associates OA §5, Policies §2(b)/§6(t)/IP §(e), and rel=sponsored."""
    findings: list[str] = []
    if uses_program_content_in_ai and not ai_program_content_approved:
        findings.append("Amazon IP License §(e): Program Content cannot be sent to AI models without express written approval")

    parser = _ComplianceHTMLParser()
    parser.feed(html_text)
    parser.close()

    for reg in ("masthead", "footer"):
        joined = " ".join(" ".join(parser.text_by_region[reg]).split())
        if ASSOCIATES_DISCLOSURE not in joined:
            findings.append(f"Missing exact Associates disclosure in {reg}")

    full_visible = " ".join(
        " ".join(parser.text_by_region[r]) for r in ("masthead", "main", "footer")
    )
    if not creators_api_authorized:
        if re.search(r"\$\d+\.\d{2}", full_visible):
            findings.append("Participation Requirements §2(b): static dollar price displayed without Creators API authorization")
        if re.search(r"\b[1-5]\.\d\s*★|\b\d[\d,]*\s+ratings\b", full_visible, flags=re.IGNORECASE):
            findings.append("Participation Requirements §6(t): customer star rating/review count displayed without Creators API authorization")

    for href, rel_tokens in parser.anchors:
        parsed = urlsplit(href)
        host = (parsed.hostname or "").lower()
        if host == "link.amazon":
            findings.append(f"Unresolved short link published as live anchor: {href}")
        if (host == "amazon.com" or host.endswith(".amazon.com")) and AMAZON_DP_RE.match(parsed.path):
            if "sponsored" not in rel_tokens:
                findings.append(f"Missing rel=sponsored on Amazon product link: {href}")
    return findings


def validate_ledger_csv(path: Path, *, require_empty: bool = False) -> list[str]:
    """Validate campaign ledger CSV schema, provenance, and anti-hallucination rules."""
    errors: list[str] = []
    if not path.is_file():
        return [f"Missing ledger file: {path}"]
    with path.open(encoding="utf-8", newline="") as fh:
        reader = csv.reader(fh)
        try:
            header = next(reader)
        except StopIteration:
            return [f"{path}: empty file (missing CSV header)"]
        forbidden = FORBIDDEN_LEDGER_COLUMNS.intersection({c.strip().lower() for c in header})
        if forbidden:
            errors.append(f"{path}: forbidden forecast/score column(s): {sorted(forbidden)}")
        if header != LEDGER_COLUMNS:
            errors.append(f"{path}: expected header {LEDGER_COLUMNS}, got {header}")
            return errors
        rows = list(reader)
        if require_empty and rows:
            errors.append(f"{path}: public repository ledger must remain empty until authorized reports are loaded privately")
        for idx, row in enumerate(rows, start=2):
            if len(row) != len(LEDGER_COLUMNS):
                errors.append(f"{path}:{idx}: wrong column count ({len(row)})")
                continue
            rec = dict(zip(LEDGER_COLUMNS, [c.strip() for c in row]))
            try:
                datetime.fromisoformat(rec["timestamp_utc"].replace("Z", "+00:00"))
            except ValueError:
                errors.append(f"{path}:{idx}: invalid ISO timestamp_utc {rec['timestamp_utc']!r}")
            src_parts = urlsplit(rec["source_url"])
            if src_parts.scheme != "https" or not src_parts.hostname:
                errors.append(f"{path}:{idx}: source_url must be an HTTPS first-party report URL")
            if not rec["report_reference"]:
                errors.append(f"{path}:{idx}: missing dated report_reference")
            if not rec["channel"]:
                errors.append(f"{path}:{idx}: missing channel")
            for metric in ("eligible_sessions", "clicks", "reported_orders"):
                val = rec[metric]
                if val != "" and (not val.isdigit() or int(val) < 0):
                    errors.append(f"{path}:{idx}: {metric} must be blank (unreported) or a non-negative integer")
    return errors


def audit_repo(root: Path = ROOT) -> list[str]:
    """Cross-check repository registers, analytics schema, and retired-path hygiene."""
    errors: list[str] = []

    # 1. Check analytics/README.md, analytics/worker.js, and data/sources.csv for retired dead paths.
    for rel_path in ("analytics/README.md", "analytics/worker.js", "data/sources.csv"):
        fpath = root / rel_path
        if not fpath.is_file():
            errors.append(f"Missing required file: {rel_path}")
            continue
        content = fpath.read_text(encoding="utf-8")
        for dead in RETIRED_DOC_REFS:
            if dead in content:
                errors.append(f"{rel_path}: contains retired dead path reference {dead!r}")
        if rel_path == "data/sources.csv" and "published from the docs/ folder" in content:
            errors.append("data/sources.csv: contains stale 'published from the docs/ folder' claim")

    # 2. Check 5-event schema consistency across targets.json and worker.js.
    targets_path = root / "analytics/targets.json"
    if targets_path.is_file():
        targets = json.loads(targets_path.read_text(encoding="utf-8"))
        if set(targets.keys()) != EXPECTED_EVENTS:
            errors.append(f"analytics/targets.json keys {set(targets.keys())} != {EXPECTED_EVENTS}")
        if targets.get("outbound_click") != [] or targets.get("reported_order") != []:
            errors.append("analytics/targets.json: outbound_click and reported_order must stay empty while Special Links are gated")
    else:
        errors.append("Missing analytics/targets.json")

    worker_path = root / "analytics/worker.js"
    if worker_path.is_file():
        worker_text = worker_path.read_text(encoding="utf-8")
        for ev in EXPECTED_EVENTS:
            if ev not in worker_text:
                errors.append(f"analytics/worker.js: missing canonical event {ev!r}")
        for stale_ev in ("product_view", "search_submit"):
            if stale_ev in worker_text:
                errors.append(f"analytics/worker.js: contains retired event {stale_ev!r}")

    # 3. Validate public empty ledger.
    errors.extend(validate_ledger_csv(root / "analytics/ledger.csv", require_empty=True))

    # 4. Cross-check data/products.json vs data/products.csv consistency.
    pjson = json.loads((root / "data/products.json").read_text(encoding="utf-8"))
    if pjson.get("tracking_id_requested") != DEFAULT_TRACKING_ID:
        errors.append("data/products.json: tracking_id_requested mismatch")
    if pjson.get("special_links") != {}:
        errors.append("data/products.json: special_links must remain empty on GitHub Pages")
    subs = pjson.get("submissions", [])
    if len(subs) != 4:
        errors.append(f"data/products.json: expected 4 submission rows, got {len(subs)}")

    with (root / "data/products.csv").open(encoding="utf-8", newline="") as fh:
        csv_rows = list(csv.DictReader(fh))
    if len(csv_rows) != 3:
        errors.append(f"data/products.csv: expected 3 deduplicated records, got {len(csv_rows)}")
    total_count = sum(int(r["submission_count_in_brief"]) for r in csv_rows)
    if total_count != len(subs):
        errors.append(f"Submission count mismatch: products.csv sum={total_count} vs products.json len={len(subs)}")
    csv_asins = {r["observed_asin_in_redirect"] for r in csv_rows}
    json_asins = {r["observed_asin"] for r in subs}
    if csv_asins != json_asins:
        errors.append(f"Observed ASIN mismatch between products.csv ({csv_asins}) and products.json ({json_asins})")

    # 5. Validate HTTPS official URLs in data/sources.csv.
    with (root / "data/sources.csv").open(encoding="utf-8", newline="") as fh:
        for srow in csv.DictReader(fh):
            u = urlsplit(srow["url"].strip())
            if u.scheme != "https" or not u.hostname:
                errors.append(f"data/sources.csv {srow['source_id']}: non-HTTPS source URL {srow['url']!r}")

    # 6. Check all tracked HTML pages via check_html_compliance.
    for html_file in sorted(root.rglob("*.html")):
        rel_parts = html_file.relative_to(root).parts
        if any(p.startswith(".") or p in {"verification", "release_checks"} for p in rel_parts):
            continue
        html_findings = check_html_compliance(html_file.read_text(encoding="utf-8"))
        for finding in html_findings:
            errors.append(f"{html_file.relative_to(root)}: {finding}")

    return errors


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_audit = sub.add_parser("audit-repo", help="Verify cross-file consistency, compliance, and empty ledger")
    p_audit.add_argument("--root", type=Path, default=ROOT)

    p_comm = sub.add_parser("commission-schedule", help="Print official fixed commission rate metadata")
    p_comm.add_argument("--category", default="all", help="Category key (kitchen, tools, home, home improvement, or all)")

    p_ledger = sub.add_parser("validate-ledger", help="Validate a campaign ledger CSV file")
    p_ledger.add_argument("path", type=Path)
    p_ledger.add_argument("--require-empty", action="store_true")

    p_ingest = sub.add_parser("ingest-submissions", help="Ingest submitted URLs preserving separate blank intent fields")
    p_ingest.add_argument("urls", nargs="+")

    args = ap.parse_args(argv)
    if args.cmd == "audit-repo":
        errs = audit_repo(args.root.resolve())
        if errs:
            for err in errs:
                print(f"ERROR: {err}", file=sys.stderr)
            return 1
        print("OK: repository registers, 5-event analytics contract, empty ledger, and HTML compliance gates verified.")
        return 0
    if args.cmd == "commission-schedule":
        if args.category == "all":
            out = {k: lookup_commission_rate(k) for k in OFFICIAL_COMMISSION_RATES}
        else:
            out = lookup_commission_rate(args.category)
        print(json.dumps(out, indent=2))
        return 0
    if args.cmd == "validate-ledger":
        errs = validate_ledger_csv(args.path, require_empty=args.require_empty)
        if errs:
            for err in errs:
                print(f"ERROR: {err}", file=sys.stderr)
            return 1
        print(f"OK: ledger {args.path} validated.")
        return 0
    if args.cmd == "ingest-submissions":
        print(json.dumps(ingest_submissions(args.urls), indent=2))
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
