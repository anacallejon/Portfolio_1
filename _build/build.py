#!/usr/bin/env python3
"""Generador del Portfolio 2.

Lee el contenido de _build/proyectos.json y escribe index.html y las
páginas de proyecto en proyectos/. Para cambiar textos de un proyecto,
edita el JSON y vuelve a ejecutar:   python3 _build/build.py
(Las páginas generadas son HTML normal: no hace falta nada más para
publicarlas en GitHub Pages.)
"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
P = json.loads((ROOT / "_build/proyectos.json").read_text(encoding="utf-8"))
YEAR = "2026"
EMAIL = "ana.callejonalen@gmail.com"
INSTAGRAM = "https://www.instagram.com/calen.archive/"
LINKEDIN = "https://www.linkedin.com/in/ana-callej%C3%B3n-al%C3%A9n-6879a02a6/"
W3F_KEY = "90fb1827-be99-4bc9-a780-6c5016df4897"

def e(s): return html.escape(s, quote=True)

# Flecha única para todo el sitio: trazo recto y punta de líneas rectas.
# Se usan comillas simples para que funcione también dentro de data-es / data-en.
_ARW = ("<svg class='arw arw-{d}' viewBox='0 0 16 16' aria-hidden='true'>"
        "<path d='M1.5 8h12.5M9 3l5 5-5 5'/></svg>")
ARROWS = {"→": _ARW.format(d="r"), "←": _ARW.format(d="l"), "↑": _ARW.format(d="u"), "↓": _ARW.format(d="d")}
def flechas(html_text):
    for k, v in ARROWS.items():
        html_text = html_text.replace(k, v)
    return html_text

# Asterisco de ocho puntas con trazo grueso y recto (aspecto de tipografía sans),
# dibujado en SVG para que se vea igual en todos los navegadores.
STAR = ('<svg class="marquee-dot" viewBox="0 0 100 100" aria-hidden="true">'
        '<g stroke="currentColor" stroke-width="9" stroke-linecap="butt">'
        '<line x1="50" y1="6" x2="50" y2="94"/><line x1="6" y1="50" x2="94" y2="50"/>'
        '<line x1="18.9" y1="18.9" x2="81.1" y2="81.1"/><line x1="81.1" y1="18.9" x2="18.9" y2="81.1"/>'
        '</g></svg>')
def bi(es, en, tag="span", cls="", extra=""):
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c}{extra} data-es="{e(es)}" data-en="{e(en)}">{es}</{tag}>'
def ik(url, w): return f"{url}?tr=w-{w},f-auto"

def head(title, desc, pre, title_en=None):
    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-es="{e(title)}" data-en="{e(title_en or title)}">{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="author" content="Ana Callejón Alén">
<link rel="icon" type="image/svg+xml" href="{pre}assets/img/favicon.svg">
<script>document.documentElement.classList.add("js");try{{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;}}catch(e){{}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://ik.imagekit.io">
<link rel="stylesheet" href="{pre}assets/css/style.css">
</head>
<body>
"""

def header(pre, active, hide_at_top=False):
    nav = [("index.html#proyectos", "Proyectos", "Work", "work"),
           ("index.html#sobre-mi", "Sobre mí", "About", "about"),
           ("index.html#contacto", "Contacto", "Contact", "contact")]
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{pre}{h}"{cur if k == active else ""} data-es="{es}" data-en="{en}">{es}</a>'
        for h, es, en, k in nav)
    tools = ('<div class="header-tools"><div class="lang-switch">'
             '<button data-lang-btn="es" aria-pressed="true">ES</button><span>/</span>'
             '<button data-lang-btn="en" aria-pressed="false">EN</button></div>'
             '<button class="theme-btn" data-theme-btn>Oscuro</button></div>')
    top = ' is-top" data-hide-until=".hero-meta' if hide_at_top else ""
    return f"""<header class="site-header load-fade{top}">
  <a class="brand" href="{pre}index.html">Ana Callejón</a>
  <nav class="site-nav">{links}</nav>
  {tools}
  <button class="menu-btn" aria-expanded="false" data-es="Menú" data-en="Menu">Menú</button>
</header>
<div class="mobile-menu"><nav>{links}</nav>{tools}</div>
"""

def footer(pre):
    return f"""<footer class="site-footer">
  <span>© {YEAR} Ana Callejón Alén</span>
  {bi("Diseño gráfico y multimedia · Madrid", "Graphic & multimedia design · Madrid")}
  <a href="#top" data-es="Volver arriba ↑" data-en="Back to top ↑">Volver arriba ↑</a>
</footer>
<script src="{pre}assets/js/main.js" defer></script>
</body>
</html>
"""

def tags(p, sep=" · "):
    es = sep.join(t[0] for t in p["tags"]); en = sep.join(t[1] for t in p["tags"])
    return es, en


# ------------------------------------------------------------ CV (Sobre mí)
EXPERIENCIA = [  # (fechas ES, fechas EN, puesto ES, puesto EN, lugar)
    ("Oct 2025 — Hoy", "Oct 2025 — Present", "Diseño gráfico en el equipo de Marketing (voluntaria)", "Graphic design, marketing team (volunteer)", "CRIS Contra el Cáncer"),
    ("Jun — Sep 2025", "Jun — Sep 2025", "Diseño gráfico y publicitario", "Graphic & advertising designer", "Tintoremus Sttudio"),
    ("Mar — Jun 2025", "Mar — Jun 2025", "Prácticas de diseño", "Design internship", "Tintoremus Sttudio"),
]
FORMACION = [
    ("2024 — Hoy", "2024 — Present", "Grado en Diseño Gráfico y Multimedia", "Bilingual Bachelor's Degree in Multimedia and Graphic Design", "UDIT, Madrid"),
    ("2021 — 2024", "2021 — 2024", "Grado en Diseño", "Bachelor's Degree in Design", "EINA, Barcelona"),
    ("2019 — 2021", "2019 — 2021", "Bachillerato Artístico", "Arts Baccalaureate", "Colegio Estudio"),
]
IDIOMAS = [  # (idioma ES, idioma EN, nivel ES, nivel EN)
    ("Castellano", "Spanish", "Nativo", "Native"),
    ("Inglés", "English", "Alto — C2 (CAD)", "Advanced — C2 (CAD)"),
    ("Catalán", "Catalan", "Alto", "Advanced"),
]
HABILIDADES = [  # (título ES, título EN, [(ES, EN), ...])
    ("Técnicas y artísticas", "Technical & artistic", [
        ("Dibujo", "Drawing"),
        ("Desarrollo web: HTML, CSS y JS", "Web development: HTML, CSS & JS"),
        ("Desarrollo de proyectos", "Project development"),
        ("Modelado 3D", "3D modelling"),
        ("Procesos artesanales y analógicos", "Craft & analogue processes"),
        ("IA aplicada: contenido, imágenes y herramientas", "Applied AI: content, images & tools"),
    ]),
    ("Sociales", "Interpersonal", [
        ("Comunicación y trabajo en equipo", "Communication & teamwork"),
        ("Gestión de redes sociales", "Social media management"),
        ("Gestión de proyectos", "Project management"),
        ("Resolución de conflictos", "Conflict resolution"),
    ]),
]

HERRAMIENTAS = [
    "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Adobe Premiere Pro",
    "Adobe Lightroom", ("Paquete Microsoft Office", "Microsoft Office Suite"), "Figma",
]

def cv_rows(rows):
    out = []
    for des, den, tes, ten, lugar in rows:
        out.append(f'''        <li class="cv-row">
          {bi(des, den, cls="cv-date")}
          {bi(tes, ten, cls="cv-what")}
          <span class="cv-where">{lugar}</span>
        </li>''')
    return "\n".join(out)

def cv_html():
    idiomas = "\n".join(f'''        <li class="cv-row cv-row--2">
          {bi(a, b, cls="cv-what")}
          {bi(c, d, cls="cv-where")}
        </li>''' for a, b, c, d in IDIOMAS)
    grupos = "\n".join(
        f'''        <div class="cv-skill-group">
          {bi(t_es, t_en, tag="h4", cls="cv-sub")}
          <ul>{"".join("<li>" + bi(a, b) + "</li>" for a, b in items)}</ul>
        </div>''' for t_es, t_en, items in HABILIDADES)
    herramientas = "".join(
        "<li>" + (bi(h[0], h[1]) if isinstance(h, tuple) else h) + "</li>" for h in HERRAMIENTAS)
    def bloque(i, es, en, contenido):
        return f'''      <div class="cv-block">
        <button class="cv-toggle" type="button" aria-expanded="false" aria-controls="cv-panel-{i}">
          {bi(es, en, cls="label")}<span class="cv-plus" aria-hidden="true">+</span>
        </button>
        <div class="cv-panel" id="cv-panel-{i}">
          <div class="cv-panel-inner">
{contenido}
          </div>
        </div>
      </div>'''
    bloques = "\n".join([
        bloque(1, "Experiencia", "Experience", f'<ul class="cv-list">\n{cv_rows(EXPERIENCIA)}\n        </ul>'),
        bloque(2, "Formación", "Education", f'<ul class="cv-list">\n{cv_rows(FORMACION)}\n        </ul>'),
        bloque(3, "Idiomas", "Languages", f'<ul class="cv-list">\n{idiomas}\n        </ul>'),
        bloque(4, "Competencias", "Skills", f'<div class="cv-skills">\n{grupos}\n        </div>'),
        bloque(5, "Herramientas", "Tools", f'<ul class="cv-tools">{herramientas}</ul>'),
    ])
    return f'''    <div class="cv">
{bloques}
      <div class="cv-block cv-block--download">
        <span class="label">CV</span>
        <a class="cv-download ulink" href="assets/cv/CV_CallejonAna_ES.pdf" data-es-href="assets/cv/CV_CallejonAna_ES.pdf" data-en-href="assets/cv/CV_CallejonAna_EN.pdf" target="_blank" rel="noopener" data-es="Descargar CV (PDF) ↓" data-en="Download CV (PDF) ↓">Descargar CV (PDF) ↓</a>
      </div>
    </div>'''

# ---------------------------------------------------------------- HOME
def build_index():
    items = []
    for i, p in enumerate(P, 1):
        tes, ten = tags(p)
        items.append(f"""    <li class="index-item" data-slug="{p['slug']}" data-cover="{ik(p['cover'], 700)}">
      <a href="proyectos/{p['slug']}.html">
        <span class="index-thumb"><img src="{ik(p['cover'], 900)}" alt="" loading="lazy"></span>
        <span class="index-num">{i:02d}</span>
        {bi(p['title'], p['title_en'], cls="index-title")}
        {bi(tes, ten, cls="index-tags")}
        <span class="index-arrow" aria-hidden="true">→</span>
      </a>
    </li>""")
    out = head("Ana Callejón — Diseño gráfico y multimedia",
               "Portfolio de Ana Callejón Alén, diseñadora gráfica y multimedia en Madrid: identidad de marca, diseño editorial, fotografía y 3D.", "")
    out += '<a id="top"></a>\n' + header("", "work", hide_at_top=True)
    out += f"""<main>
<section class="hero wrap">
  <div class="grid hero-meta label">
    {bi("Portfolio — " + YEAR, "Portfolio — " + YEAR, cls="load", extra=' style="--d:.08s"')}
    {bi("Diseño gráfico y multimedia", "Graphic & multimedia design", cls="load", extra=' style="--d:.14s"')}
    {bi("Madrid, España", "Madrid, Spain", cls="load", extra=' style="--d:.2s"')}
    {bi("Abierta a prácticas", "Open to internships", cls="hero-meta-spacer", extra=' aria-hidden="true"')}
  </div>
  <h1 class="hero-name"><span class="mask"><span style="--d:.18s">Ana <em>Callejón</em></span></span></h1>
  <div class="grid hero-statement">
    {bi("(Intro)", "(Intro)", cls="label load", extra=' style="--d:.5s"')}
    {bi("Comunicación visual entre la <em>identidad de marca</em> y el <em>diseño editorial</em>, donde lo digital y lo artesanal se mezclan.",
        "Visual communication between <em>brand identity</em> and <em>editorial design</em>, where digital and handmade meet.", tag="p", cls="load", extra=' style="--d:.56s"')}
  </div>
</section>

<section class="section wrap" id="proyectos">
  <div class="section-head">
    {bi("Proyectos seleccionados", "Selected work", cls="label")}
  </div>
  <ul class="index-list">
{chr(10).join(items)}
  </ul>
  <div class="hover-preview" aria-hidden="true"></div>
</section>

<section class="section wrap" id="sobre-mi">
  <div class="section-head">
    {bi("Sobre mí", "About", cls="label")}
  </div>
  <div class="grid about-body reveal">
    {bi("(Perfil)", "(Profile)", cls="label")}
    {bi("Soy Ana Callejón, diseñadora creativa en proyectos gráficos, digitales y multimedia. Este portfolio es una selección de experimentos, trabajo con clientes y exploraciones personales.",
        "I'm Ana Callejón, a creative designer working across graphic, digital and multimedia projects. This portfolio is a selection of experiments, client work and personal explorations.", tag="p", cls="about-lead")}
    <div class="about-cols">
      {bi("Actualmente estoy finalizando un Grado en Diseño Gráfico y Multimedia en Madrid, tras tres años de formación en Barcelona. Me dedico principalmente a la comunicación visual, entre identidades de marca y diseño editorial. Me apasionan la tipografía, la teoría del color, y esa zona donde lo digital y lo artesanal se mezclan.",
          "Currently finishing a degree in Graphic and Multimedia Design in Madrid, after three years of training in Barcelona. My work centers on visual communication, somewhere between brand identity and editorial design. I'm especially passionate about typography, color theory, and the place where digital and handmade meet.", tag="p")}
      {bi("Mi experiencia incluye prácticas en un estudio de diseño donde posteriormente me incorporé al equipo, colaboraciones freelance y trabajo voluntario de comunicación visual. Fuera del espacio digital, disfruto de la ilustración analógica, la encuadernación y proyectos artesanales. La música y la cultura visual son influencias constantes en mi proceso.",
          "My experience includes an internship at a design studio where I later joined the team, freelance collaborations and volunteer work in visual communication. Outside the digital space, I enjoy analog illustration, bookbinding and craft projects. Music and visual culture are constant influences in my process.", tag="p")}
    </div>
{cv_html()}
  </div>
</section>

<section class="section contact wrap" id="contacto">
  {bi("¡Hablemos!", "Let's connect!", tag="h2", cls="contact-title reveal")}
  <a class="marquee" href="mailto:{EMAIL}" aria-label="{EMAIL}">
    <span class="marquee-track" aria-hidden="true">{("<span>" + EMAIL + "</span>" + STAR) * 4}</span>
  </a>
  <div class="grid contact-row reveal">
    <div class="contact-social">
      <a class="ulink" href="{INSTAGRAM}" target="_blank" rel="noopener">Instagram ↗</a>
      <a class="ulink" href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
    <div class="contact-form-wrap">
      {bi("O deja tu email y te escribo yo.", "Or leave your email and I'll get back to you.", tag="p")}
      <form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="{W3F_KEY}">
        <input type="hidden" name="subject" value="Nuevo contacto desde el portfolio">
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">
        <input type="email" name="email" required autocomplete="email" placeholder="Tu email"
               data-es-placeholder="Tu email" data-en-placeholder="Your email"
               data-es-aria="Tu email" data-en-aria="Your email" aria-label="Tu email">
        <button type="submit" data-es="Enviar →" data-en="Send →">Enviar →</button>
      </form>
      <p class="contact-feedback" aria-live="polite"></p>
    </div>
  </div>
</section>
</main>
"""
    out += footer("")
    (ROOT / "index.html").write_text(flechas(out), encoding="utf-8")

# ------------------------------------------------------ PÁGINA PROYECTO
def build_project(i, p):
    n = len(P)
    nxt = P[i % n]
    tes, ten = tags(p)
    paras = "\n      ".join(bi(es, en, tag="p") for es, en in p["body"])
    rows, fig = [], 0
    for r in p["rows"]:
        figs = []
        for img in r:
            fig += 1
            figs.append(f'<figure class="g-fig" style="--ar:{img["ar"]}">'
                        f'<img src="{ik(img["src"], 1800)}" data-full="{img["src"]}" alt="{e(p["title"])} — Fig. {fig:02d}" loading="lazy">'
                        f'<figcaption class="label">Fig. {fig:02d}</figcaption></figure>')
        single = " is-single" if len(r) == 1 else ""
        rows.append(f'<div class="g-row{single} reveal">' + "".join(figs) + "</div>")
    out = head(f"{p['title']} — Ana Callejón", p["intro"][0], "../", title_en=f"{p['title_en']} — Ana Callejón")
    out += '<a id="top"></a>\n' + header("../", "work")
    out += f"""<main class="wrap">
  <div class="p-top load" style="--d:.05s">
    <a href="../index.html#proyectos" data-es="← Volver a proyectos" data-en="← Back to projects">← Volver a proyectos</a>
    <span>{i:02d} / {n:02d}</span>
  </div>

  <header class="p-head">
    <div class="grid p-meta label">
      {bi("Proyecto " + f"{i:02d}", "Project " + f"{i:02d}", cls="load", extra=' style="--d:.1s"')}
      {bi(tes, ten, cls="load", extra=' style="--d:.16s"')}
    </div>
    {bi(p['title'], p['title_en'], tag="h1", cls="p-title load", extra=' style="--d:.2s"')}
    <div class="grid p-intro load" style="--d:.4s">
      {bi("(Resumen)", "(Summary)", cls="label")}
      {bi(p['intro'][0], p['intro'][1], tag="p")}
    </div>
  </header>

  <section class="grid p-body reveal">
    {bi("(Descripción)", "(Description)", cls="label")}
    <div class="p-text">
      {paras}
    </div>
  </section>

  <section class="gallery">
    {chr(10).join("    " + r for r in rows).strip()}
    {bi("Haz clic en las imágenes para ampliarlas", "Click the images to enlarge them", tag="p", cls="label gallery-hint")}
  </section>

  <nav class="p-next">
    <a href="{nxt['slug']}.html">
      {bi("Siguiente proyecto →", "Next project →", cls="label")}
      {bi(nxt['title'], nxt['title_en'], cls="p-next-title")}
      <span class="p-next-thumb"><img src="{ik(nxt['cover'], 800)}" alt="" loading="lazy"></span>
    </a>
  </nav>
</main>
"""
    out += footer("../")
    (ROOT / "proyectos" / f"{p['slug']}.html").write_text(flechas(out), encoding="utf-8")

if __name__ == "__main__":
    (ROOT / "proyectos").mkdir(exist_ok=True)
    build_index()
    for i, p in enumerate(P, 1):
        build_project(i, p)
    print(f"OK: index.html + {len(P)} páginas de proyecto")
