# Proposal Studio (Mamu)

Static webapp that generates AIA PUBLIC Takaful client proposals (2-page A4, BM | EN).
No backend. Client data is never stored or sent anywhere.

- `src/shell.html` · app layout + UI CSS
- `src/tplA.css` · Idaman + Health360-i template styles
- `src/tplC.css` · A-Enrich Rezeki template styles
- `src/app.js` · data (fact sheets, hospitals), Rezeki calculator, templates, form logic
- `build.py` · scopes template CSS and builds `dist/index.html`

Update: edit `src/`, run `python3 build.py`, commit `dist/`. Netlify serves `dist/`.
