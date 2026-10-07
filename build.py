"""Build dist/index.html from src/. Scopes each proposal template's CSS so they don't clash."""
import re, pathlib
SRC = pathlib.Path(__file__).parent / "src"
DIST = pathlib.Path(__file__).parent / "dist"


def scope(css, sc):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"@page\s*\{[^}]*\}", "", css)
    out = []
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        parts = []
        for s in sel.split(","):
            s = s.strip()
            if not s:
                continue
            if s in (":root", "body", "html"):
                parts.append(sc)
            elif s == "*":
                parts.append(f"{sc},{sc} *")
            else:
                parts.append(f"{sc} {s}")
        out.append(",".join(parts) + "{" + body.strip() + "}")
    return "\n".join(out)


shell = (SRC / "shell.html").read_text()
css = scope((SRC / "tplA.css").read_text(), ".tA") + "\n" + scope((SRC / "tplC.css").read_text(), ".tC")
js = (SRC / "app.js").read_text()
html = shell.replace("/*@@TPL_CSS@@*/", css).replace("/*@@APP_JS@@*/", js)
DIST.mkdir(exist_ok=True)
(DIST / "index.html").write_text(html)
print("built", len(html), "bytes")
