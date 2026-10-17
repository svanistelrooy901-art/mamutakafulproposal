# Proposal Studio (Mamu)

Static webapp that generates AIA PUBLIC Takaful client proposals (2-page A4, BM | EN).
No backend. Client data is never stored or sent anywhere.

- `src/shell.html` · app layout + UI CSS
- `src/tplA.css` · Idaman + Health360-i template styles
- `src/tplC.css` · A-Enrich Rezeki template styles
- `src/app.js` · data (fact sheets, hospitals), Rezeki calculator, templates, form logic
- `build.py` · scopes template CSS and builds `dist/index.html`

Update: edit `src/`, run `python3 build.py`, commit `dist/`. Netlify serves `dist/`.

## Documents in the app
- **Analisis Keperluan** (`src/tools.js` → `renderFactFind`): profile, income, 3D (dreams/debt/dependants), cash flow, takaful budget (10/20/custom %), hibah (5/10/15/custom × income + debts + education), critical illness (3/5/custom × income), emergency fund (6 × expenses), medical cost projection (12%/yr assumption; Aon 2026 16%, 2027 14.7%), overall % covered gauge.
- **Perbandingan Pelan** (`renderCompare`): 2–3 plans, presets (Idaman 200/300, MediFlex 180/250/350, Rezeki), ★ recommended column, gap-closure % and budget fit pulled from the needs analysis.
- **Proposals**: A-Life Idaman + Health360-i, A-Enrich Rezeki (`src/app.js`).
- Facts used: BNM Deputy Governor speech 28 Aug 2024 ("about 2 in 5 Malaysians have life protection"); Aon 2027 Global Medical Trend Rates Report (12 Oct 2026).
