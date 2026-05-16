# Ghost-Master APK Production Blueprint

This folder contains the HTML blueprint and a small helper script to generate a PDF from it.

- Lovable project: https://lovable.dev/projects/730efb52-6dca-444c-adc8-feb7e914a04e
- HTML: `docs/Ghost_Master_APK_Production_Blueprint.html`
- PDF generator: `tools/generate_pdf.py`

Local generation
```bash
python3 -m pip install --user weasyprint
python3 tools/generate_pdf.py
```

CI
- A GitHub Actions workflow is included to generate the PDF automatically on push and upload it as an artifact.
