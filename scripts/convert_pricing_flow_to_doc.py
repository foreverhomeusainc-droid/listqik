from pathlib import Path

import markdown


def main() -> None:
    src = Path("docs/pricing-ghl-flow.md")
    dst = Path("docs/pricing-ghl-flow.doc")

    md_text = src.read_text(encoding="utf-8")
    html = markdown.markdown(md_text, extensions=["tables", "fenced_code"])

    doc_html = (
        "<html><head><meta charset=\"utf-8\">"
        "<title>pricing-ghl-flow</title>"
        "<style>"
        "body{font-family:Calibri,Arial,sans-serif;line-height:1.5;margin:24px;}"
        "pre{background:#f5f5f5;padding:10px;border-radius:4px;}"
        "code{font-family:Consolas,monospace;}"
        "table{border-collapse:collapse;}"
        "th,td{border:1px solid #999;padding:6px 8px;}"
        "</style></head><body>"
        f"{html}"
        "</body></html>"
    )

    dst.write_text(doc_html, encoding="utf-8")
    print(f"Wrote {dst}")


if __name__ == "__main__":
    main()
