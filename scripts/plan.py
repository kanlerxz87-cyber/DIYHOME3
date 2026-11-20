#!/usr/bin/env python3
"""Build a non-publishing editorial queue from an authorized Search Console query export."""
import argparse
import csv
import json
from datetime import date
from pathlib import Path

FIRST_REVIEW = date(2026, 12, 3)


def plan(path, start, end):
    if start > end or end > date.today():
        raise ValueError('Provide a completed or current authorized report window.')
    with path.open(encoding='utf-8-sig', newline='') as file:
        rows = csv.DictReader(file)
        if not rows.fieldnames or not {'Top queries','Clicks','Impressions'} <= set(rows.fieldnames):
            raise ValueError('Expected Search Console columns: Top queries, Clicks, Impressions.')
        candidates = []
        for row in rows:
            query = row['Top queries'].strip()
            clicks, impressions = (int(row[k].replace(',','')) for k in ('Clicks','Impressions'))
            if not query or not 0 <= clicks <= impressions:
                raise ValueError('Invalid query or count in report.')
            if impressions:
                candidates.append({'query':query, 'clicks':clicks, 'impressions':impressions})
    return sorted(candidates, key=lambda x: (-x['impressions'], -x['clicks'], x['query']))[:10]


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report',type=Path)
    parser.add_argument('--start',type=date.fromisoformat)
    parser.add_argument('--end',type=date.fromisoformat)
    options = parser.parse_args()
    if options.report and not (options.start and options.end):
        parser.error('--report requires --start and --end')
    period = [str(options.start),str(options.end)] if options.report else None
    candidates = plan(options.report,options.start,options.end) if options.report else []
    days = (date.today() - FIRST_REVIEW).days
    print(json.dumps({'review_due_utc': days >= 0 and days % 14 == 0, 'period':period,
                      'status':'editorial review only' if options.report else 'no authorized query report loaded',
                      'candidates':candidates, 'source':'https://developers.google.com/search/docs/monitor-debug/search-console-start'},ensure_ascii=False,indent=2))
