"""Compatibility entry point for the current first-party aggregate collector."""
from pathlib import Path
from runpy import run_path

if __name__ == '__main__':
    run_path(str(Path(__file__).resolve().parents[1] / 'analytics/server.py'), run_name='__main__')
