#!/usr/bin/env python3
"""Unit tests for scripts/affiliate_pipeline.py."""
from datetime import date
from pathlib import Path
import tempfile
import unittest

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import affiliate_pipeline as ap  # noqa: E402


class AffiliatePipelineTests(unittest.TestCase):
    def test_ingest_preserves_duplicates_and_blank_intent(self):
        urls = [
            "https://link.amazon/B0hmGG4m2",
            "https://link.amazon/B03QDuGdo",
            "https://link.amazon/B03QDuGdo",
            "https://link.amazon/B0hpD2JGQ",
        ]
        obs = {
            "https://link.amazon/B0hmGG4m2": {
                "observed_asin": "B08FKW9JRM",
                "observed_redirect_target": "https://www.amazon.com/dp/B08FKW9JRM",
                "observed_on": "2026-11-20",
            }
        }
        rows = ap.ingest_submissions(urls, obs)
        self.assertEqual(len(rows), 4)
        self.assertIsNone(rows[1]["duplicate_of"])
        self.assertEqual(rows[2]["duplicate_of"], 2)
        for row in rows:
            self.assertFalse(row["token_is_10_char_asin"])
            self.assertEqual(row["short_link_compliance_status"], "unresolved_in_public_associates_docs")
            self.assertIsNone(row["intended_asin"])
            self.assertIsNone(row["official_listing_url"])
            self.assertIsNone(row["confirmed_on"])
            self.assertIsNone(row["confirmation_source"])
        self.assertEqual(rows[0]["observed_asin"], "B08FKW9JRM")

    def test_commission_schedule_has_no_forecast_or_score(self):
        kitchen = ap.lookup_commission_rate("Kitchen")
        tools = ap.lookup_commission_rate("Tools")
        self.assertEqual(kitchen["standard_commission_rate_pct"], "4.50%")
        self.assertEqual(tools["standard_commission_rate_pct"], "3.00%")
        self.assertIsNone(kitchen["conversion_score"])
        self.assertIsNone(kitchen["revenue_forecast"])

    def test_special_link_gate_blocks_pages_host_and_unconfirmed_intent(self):
        common = dict(
            intended_asin="B08FKW9JRM",
            official_listing_url="https://www.amazon.com/dp/B08FKW9JRM",
            confirmed_on="2026-11-20",
            confirmation_source="S12",
            destination_checked_on="2026-11-20",
            report_checked_on="2026-11-20",
            report_reference="assoc-check-01",
            policy_reviewed_on="2026-11-20",
            reviewer="editorial-desk",
            today=date(2026, 11, 20),
        )
        with self.assertRaisesRegex(ValueError, "GitHub Pages"):
            ap.build_special_link(**common, deployment_origin="https://kanlerxz87-cyber.github.io/DIYHOME3/")

        unconfirmed = dict(common, intended_asin=None, deployment_origin="https://diyhome.example/")
        with self.assertRaisesRegex(ValueError, "intended_asin"):
            ap.build_special_link(**unconfirmed)

        approved = ap.build_special_link(**common, deployment_origin="https://diyhome.example/")
        self.assertEqual(approved["special_link_url"], "https://www.amazon.com/dp/B08FKW9JRM?tag=shopnow047c-20")
        self.assertIn('rel="sponsored noopener noreferrer"', approved["html"])

    def test_compliance_gate_catches_prices_ratings_missing_sponsored_and_ai_use(self):
        bad_html = """<!doctype html><html><body>
        <header>As an Amazon Associate I earn from qualifying purchases.</header>
        <main><p>Deal $5.08 and 4.6★ with 26,432 ratings</p>
        <a href="https://www.amazon.com/dp/B08FKW9JRM">Amazon</a></main>
        <footer>No statement here</footer></body></html>"""
        findings = ap.check_html_compliance(bad_html, uses_program_content_in_ai=True)
        self.assertEqual(len(findings), 5)

        clean_html = """<!doctype html><html><body>
        <aside>As an Amazon Associate I earn from qualifying purchases.</aside>
        <main><a href="https://www.amazon.com/dp/B08FKW9JRM" rel="sponsored noopener noreferrer">Listing</a></main>
        <footer>As an Amazon Associate I earn from qualifying purchases.</footer></body></html>"""
        self.assertEqual(ap.check_html_compliance(clean_html), [])

    def test_ledger_validation_accepts_authorized_first_party_and_rejects_forecasts(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "ledger.csv"
            p.write_text(
                "timestamp_utc,source_url,report_reference,channel,eligible_sessions,clicks,reported_orders\n"
                "2026-12-03T09:15:00Z,https://affiliate-program.amazon.com/home/reports,assoc-dec03,organic_search,,12,1\n",
                encoding="utf-8",
            )
            self.assertEqual(ap.validate_ledger_csv(p, require_empty=False), [])
            self.assertEqual(len(ap.validate_ledger_csv(p, require_empty=True)), 1)

            bad = Path(tmp) / "bad.csv"
            bad.write_text("timestamp_utc,conversion_score,revenue_forecast\n", encoding="utf-8")
            errs = ap.validate_ledger_csv(bad)
            self.assertTrue(any("forbidden forecast/score" in e for e in errs))

    def test_live_repo_audit_passes(self):
        self.assertEqual(ap.audit_repo(ROOT), [])


if __name__ == "__main__":
    unittest.main()
