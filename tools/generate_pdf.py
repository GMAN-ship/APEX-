#!/usr/bin/env python3
"""
Generate PDF from the blueprint HTML using WeasyPrint.

Run locally:
  pip install weasyprint
  python3 tools/generate_pdf.py

On CI the GitHub Action included will produce the PDF artifact.
"""
from pathlib import Path
import sys

HTML_PATH = Path('docs/Ghost_Master_APK_Production_Blueprint.html')
OUT_PATH = Path('docs/Ghost_Master_APK_Production_Blueprint.pdf')

def main():
    if not HTML_PATH.exists():
        print('HTML file not found:', HTML_PATH)
        sys.exit(2)

    try:
        from weasyprint import HTML
    except Exception as e:
        print('WeasyPrint is not installed or failed to import:', e)
        print('Install with: pip install weasyprint')
        sys.exit(3)

    HTML(filename=str(HTML_PATH)).write_pdf(str(OUT_PATH))
    print(f'PDF generated: {OUT_PATH}')

if __name__ == '__main__':
    main()
