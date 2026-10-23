# Portfolio — Ana Callejón

Portfolio web de Ana Callejón Alén, diseñadora gráfica y multimedia (Madrid).
Versión actual: **Editorial V2** (estética editorial minimal). La versión anterior está en el
historial de git y guardada en local en `Portfolios Web/Portfolio Original`.

## Estructura
- `index.html` — portada: proyectos, sobre mí (CV desplegable) y contacto
- `proyectos/*.html` — una página por proyecto
- `assets/css/style.css` — estilos (colores y tipografías en el bloque `:root`)
- `assets/js/main.js` — idioma ES/EN, modo claro/oscuro, cursor, menú móvil, vista previa,
  animaciones, lightbox y formulario (Web3Forms)
- `assets/cv/` — CV en PDF (ES y EN)
- `_build/proyectos.json` + `_build/build.py` — contenido y generador de las páginas:
  `python3 _build/build.py`
- `about.html`, `projects.html`, `proyecto-*.html` — redirecciones desde las direcciones del
  portfolio anterior, para que los enlaces antiguos sigan funcionando
- `assets/pdf/` — CV del portfolio anterior, se mantiene por si hay enlaces que apuntan ahí
- `404.html` — página de error

Las imágenes de los proyectos se cargan desde ImageKit.
