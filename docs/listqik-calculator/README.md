# ListQik Investment Calculators

## For your employee — how to use the website

### Option 1: Run locally (recommended)

1. Unzip this folder anywhere on the computer.
2. **Double-click `START-HERE.bat`**
3. Your browser opens to **http://localhost:8080** — use the calculators like a normal website.
4. **Leave the black command window open** while working. Close it when finished.

> Requires **Python** (free) for the local website. If the batch file opens the HTML directly instead, install Python from [python.org](https://www.python.org/downloads/) — check **“Add Python to PATH”** during install — then run `START-HERE.bat` again.

### Option 2: Open the file directly

Double-click **`investment-calculators.html`**. Works in Chrome or Edge; an internet connection is needed the first time (fonts and charts load from the web).

### Option 3: Put it on the web (whole team, any device)

Upload this folder to your web host, or drag the folder onto [Netlify Drop](https://app.netlify.com/drop) for a free public URL. Share that link with your team.

---

## Calculators included

| Tab | Purpose |
|-----|---------|
| Mortgage | Forward purchase P&I, balloon notes |
| Reverse Invest | Private reverse mortgage underwriting |
| Note Buyer | Seasoned note pricing & profit analysis |
| Present Value | Cash flow discounting |
| Rent Home | Single-family cap rate valuation |
| Multi-Family | Multifamily cap rate with in-op units |

## Files

| File | Description |
|------|-------------|
| `START-HERE.bat` | **Click this first** — starts the local website |
| `investment-calculators.html` | Main calculator app |
| `index.html` | Home page when using a local or hosted server |

## Requirements

- Modern browser (Chrome, Edge, Firefox, Safari)
- Internet on first load (Tailwind, fonts, Chart.js from CDN)

## Notes

- Estimates are for educational purposes only — see disclaimers on each tab.
- No install or build step beyond Python for Option 1.
