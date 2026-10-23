/* Ana Callejón — Portfolio 2 · interacción
   Idioma (ES/EN), tema (claro/oscuro), menú móvil, vista previa
   del índice, animaciones de entrada, lightbox y formulario. */
(function () {
  "use strict";
  const root = document.documentElement;
  // Misma flecha que en el HTML (punta recta)
  const ARW = (d) => "<svg class='arw arw-" + d + "' viewBox='0 0 16 16' aria-hidden='true'><path d='M1.5 8h12.5M9 3l5 5-5 5'/></svg>";
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Idioma ---------- */
  function applyLang(lang) {
    root.lang = lang;
    document.querySelectorAll("[data-es]").forEach((el) => {
      const txt = el.getAttribute("data-" + lang);
      if (txt !== null) el.innerHTML = txt;
    });
    document.querySelectorAll("[data-es-placeholder]").forEach((el) => {
      el.placeholder = el.getAttribute("data-" + lang + "-placeholder");
    });
    document.querySelectorAll("[data-es-aria]").forEach((el) => {
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria"));
    });
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang));
    });
    document.querySelectorAll("[data-es-href]").forEach((el) => {
      el.setAttribute("href", el.getAttribute("data-" + lang + "-href"));
    });
    updateThemeLabels();
  }
  let lang = store.get("lang") || "es";
  document.querySelectorAll("[data-lang-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      lang = b.dataset.langBtn;
      store.set("lang", lang);
      applyLang(lang);
    })
  );

  /* ---------- Tema ---------- */
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : mq.matches;
  function updateThemeLabels() {
    // El botón dice el modo AL QUE se pasará al pulsarlo.
    const dark = isDark();
    document.querySelectorAll("[data-theme-btn]").forEach((b) => {
      b.textContent = dark
        ? (lang === "en" ? "Light" : "Claro")
        : (lang === "en" ? "Dark" : "Oscuro");
    });
  }
  document.querySelectorAll("[data-theme-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      store.set("theme", next);
      updateThemeLabels();
    })
  );
  mq.addEventListener && mq.addEventListener("change", updateThemeLabels);

  applyLang(lang);

  /* ---------- Cabecera oculta al principio de la home ----------
     Mientras se ve la primera fila (Portfolio — 2026…), solo se muestran
     idioma y tema. Al dejar de verse, aparece la barra completa. */
  const hdr = document.querySelector(".site-header[data-hide-until]");
  const hdrTarget = hdr && document.querySelector(hdr.dataset.hideUntil);
  if (hdr && hdrTarget && "IntersectionObserver" in window) {
    const hio = new IntersectionObserver(([en]) => {
      // En escritorio la fila va a la altura de la cabecera; en móvil, debajo.
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const atTop = mobile
        ? en.isIntersecting || en.boundingClientRect.top > hdr.offsetHeight
        : en.isIntersecting;
      hdr.classList.toggle("is-top", atTop);
    }, { rootMargin: window.matchMedia("(max-width: 760px)").matches ? "-" + hdr.offsetHeight + "px 0px 0px 0px" : "0px" });
    hio.observe(hdrTarget);
  } else if (hdr) {
    hdr.classList.remove("is-top");
  }

  /* ---------- Bloques desplegables de "Sobre mí" ---------- */
  // Solo puede haber un bloque abierto: al abrir uno, se cierra el que lo estuviera.
  const cvToggles = document.querySelectorAll(".cv-toggle");
  cvToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      cvToggles.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.closest(".cv-block").classList.remove("is-open");
      });
      btn.setAttribute("aria-expanded", String(open));
      btn.closest(".cv-block").classList.toggle("is-open", open);
    });
  });

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.querySelector(".mobile-menu");
  if (menuBtn && menu) {
    const toggle = (open) => {
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      menuBtn.textContent = open
        ? (lang === "en" ? "Close" : "Cerrar")
        : (lang === "en" ? "Menu" : "Menú");
    };
    menuBtn.addEventListener("click", () => toggle(!menu.classList.contains("is-open")));
    menu.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* ---------- Vista previa flotante del índice ---------- */
  const preview = document.querySelector(".hover-preview");
  const list = document.querySelector(".index-list");
  if (preview && list && window.matchMedia("(hover: hover)").matches) {
    const imgs = {};
    list.querySelectorAll(".index-item").forEach((li) => {
      const img = document.createElement("img");
      img.src = li.dataset.cover; img.alt = ""; img.loading = "lazy";
      preview.appendChild(img);
      imgs[li.dataset.slug] = img;
      li.addEventListener("mouseenter", () => {
        Object.values(imgs).forEach((i) => i.classList.remove("is-active"));
        img.classList.add("is-active");
        preview.classList.add("is-visible");
      });
    });
    list.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.14; cy += (y - cy) * 0.14;
      const w = preview.offsetWidth, h = preview.offsetHeight;
      const px = Math.min(Math.max(cx + 28, 8), innerWidth - w - 8);
      const py = Math.min(Math.max(cy - h / 2, 64), innerHeight - h - 8);
      preview.style.translate = px + "px " + py + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Entrada al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Lightbox de la galería ---------- */
  const galleryImgs = Array.from(document.querySelectorAll(".gallery img"));
  if (galleryImgs.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<div class="lb-bar"><span class="lb-count"></span>' +
      '<button class="lb-close" data-es="Cerrar ✕" data-en="Close ✕">Cerrar ✕</button></div>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<div class="lb-nav"><button class="lb-prev" data-es="' + ARW("l") + ' Anterior" data-en="' + ARW("l") + ' Previous">' + ARW("l") + ' Anterior</button>' +
      '<button class="lb-next" data-es="Siguiente ' + ARW("r") + '" data-en="Next ' + ARW("r") + '">Siguiente ' + ARW("r") + '</button></div>';
    document.body.appendChild(lb);
    applyLang(lang);
    const big = lb.querySelector(".lb-stage img");
    const count = lb.querySelector(".lb-count");
    let idx = 0;
    const show = (i) => {
      idx = (i + galleryImgs.length) % galleryImgs.length;
      big.src = galleryImgs[idx].dataset.full || galleryImgs[idx].src;
      count.textContent = String(idx + 1).padStart(2, "0") + " / " + String(galleryImgs.length).padStart(2, "0");
    };
    const open = (i) => { show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; };
    galleryImgs.forEach((img, i) => img.addEventListener("click", () => open(i)));
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
    lb.querySelector(".lb-stage").addEventListener("click", (e) => { if (e.target !== big) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Cursor circular ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cur = document.createElement("div");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    document.body.appendChild(cur);
    root.classList.add("has-cursor");
    let x = -100, y = -100, cx = x, cy = y;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-on"));
    window.addEventListener("mousedown", () => cur.classList.add("is-down"));
    window.addEventListener("mouseup", () => cur.classList.remove("is-down"));
    // Crece sobre enlaces, botones e imágenes ampliables.
    // Desaparece en los campos de texto y sobre la lista de proyectos,
    // donde el indicador es la propia imagen de vista previa.
    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      cur.classList.toggle("is-big", !!t.closest("a, button, .gallery img"));
      const onPreview = t.closest(".index-item") && window.innerWidth > 760; // la vista previa solo existe en pantallas anchas
      cur.style.visibility = t.closest("input, textarea") || onPreview ? "hidden" : "";
    });
    (function loop() {
      cx += (x - cx) * 0.35; cy += (y - cy) * 0.35;
      cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Formulario de contacto (Web3Forms) ---------- */
  document.querySelectorAll(".contact-form").forEach((form) => {
    const fb = form.parentElement.querySelector(".contact-feedback");
    const btn = form.querySelector("button[type=submit]");
    const setFb = (es, en, err) => {
      fb.setAttribute("data-es", es); fb.setAttribute("data-en", en);
      fb.innerHTML = lang === "en" ? en : es;
      fb.classList.toggle("is-error", !!err);
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true;
      const old = btn.innerHTML;
      btn.innerHTML = lang === "en" ? "Sending…" : "Enviando…";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error();
        form.reset();
        setFb("Gracias, te escribo pronto.", "Thanks, I'll be in touch soon.");
      } catch (err) {
        setFb("No se ha podido enviar. Prueba otra vez o escríbeme por email.",
              "It couldn't be sent. Try again or email me directly.", true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = old;
      }
    });
  });
})();
