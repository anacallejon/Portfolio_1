// JS principal para cursor personalizado, modales, navbar y SCROLLYTELLING
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // CUSTOM CURSOR
  // ==============================
  const cursor = document.querySelector(".custom-cursor");

  if (cursor) {
    const COLOR1 = "rgb(65, 104, 68)"; // #416844
    const COLOR2 = "rgb(46, 74, 48)"; // #2E4A30
    const COLOR1_RGB = "65, 104, 68";
    const COLOR2_RGB = "46, 74, 48";

    // Extrae solo el trío r, g, b de un color computado, ignorando el
    // canal alpha (para que rgba(65, 104, 68, 0.97) siga reconociéndose
    // como "COLOR1" aunque no coincida el string exacto con el alpha).
    const getOpaqueRgb = (colorStr) => {
      const match = colorStr.match(
        /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/,
      );
      if (!match) return null;
      const alpha = match[4] === undefined ? 1 : parseFloat(match[4]);
      if (alpha <= 0) return null;
      return `${match[1]}, ${match[2]}, ${match[3]}`;
    };

    document.addEventListener("mousemove", (e) => {
      cursor.style.opacity = "1";
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;

      cursor.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      cursor.style.visibility = "visible";

      if (!el) return;
      if (cursor.classList.contains("is-link")) return;

      let node = el;
      let bgRgb = null;
      while (node && node !== document.documentElement) {
        const computed = window.getComputedStyle(node);
        bgRgb = getOpaqueRgb(computed.backgroundColor);
        if (bgRgb) break;
        node = node.parentElement;
      }

      if (bgRgb === COLOR1_RGB) {
        cursor.style.backgroundColor = COLOR2;
        cursor.style.borderColor = COLOR2;
      } else if (bgRgb === COLOR2_RGB) {
        cursor.style.backgroundColor = COLOR1;
        cursor.style.borderColor = COLOR1;
      } else {
        cursor.style.backgroundColor = COLOR1;
        cursor.style.borderColor = COLOR1;
      }
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    const interactive = document.querySelectorAll("a, button");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("is-link"),
      );
    });
  }

  // ==============================
  // MODAL DE PROYECTOS (projects.html)
  // ==============================
  if (document.body.classList.contains("projects-page")) {
    const cards = document.querySelectorAll(".card");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const backdrop = document.querySelector(".project-modal-backdrop");
    const modalText = document.querySelector(".project-modal-text");
    const modalImages = document.querySelector(".project-modal-images");
    const modalCloseBtn = document.querySelector(".project-modal-close");

    // Hacer visibles las cards inmediatamente (sin esperar observer)
    cards.forEach((el) => el.classList.add("fade-in-visible"));

    // Inyectar hover overlay en cada card
    cards.forEach((card) => {
      const title = card.getAttribute("data-title");
      const desc = card.getAttribute("data-desc");
      if (title || desc) {
        const overlay = document.createElement("div");
        overlay.className = "card-hover-overlay";
        overlay.innerHTML = `
          ${title ? `<p class="card-hover-title">${title}</p>` : ""}
          ${desc ? `<p class="card-hover-desc">${desc}</p>` : ""}
        `;
        card.appendChild(overlay);
      }
    });

    // Filtrado de proyectos
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        cards.forEach((card) => {
          const categories = card.getAttribute("data-category") || "";
          const categoryArray = categories.trim().split(/\s+/);
          if (filter === "all" || categoryArray.includes(filter)) {
            card.classList.remove("hidden");
            card.classList.add("show");
          } else {
            card.classList.remove("show");
            card.classList.add("hidden");
          }
        });
      });
    });

    // Función cerrar modal
    const closeModal = () => {
      backdrop.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    };

    // Función abrir modal por ID
    const openModalById = (projectId) => {
      const card = document.querySelector(`[data-project="${projectId}"]`);
      if (!card) return;

      const detail = document.getElementById(projectId);
      modalText.innerHTML = "";

      if (detail) {
        const detailTitle = detail.querySelector("h3");
        const detailText = detail.querySelector("p");
        // El h3/p del bloque de detalle no llevan clase propia: se las
        // añadimos al clonar para que hereden el color de
        // .project-modal-text .card-title/.card-text (si no, se quedan
        // sin la regla de color de modo claro y salen en blanco sobre
        // fondo crema, ilegibles).
        if (detailTitle) {
          const clonedTitle = detailTitle.cloneNode(true);
          clonedTitle.classList.add("card-title");
          modalText.appendChild(clonedTitle);
        }
        if (detailText) {
          const clonedText = detailText.cloneNode(true);
          clonedText.classList.add("card-text");
          modalText.appendChild(clonedText);
        }
      } else {
        const titleEl = card.querySelector(".card-title");
        const textEl = card.querySelector(".card-text");
        if (titleEl) modalText.appendChild(titleEl.cloneNode(true));
        if (textEl) modalText.appendChild(textEl.cloneNode(true));
      }

      modalImages.innerHTML = "";
      const dataImages = card.getAttribute("data-images");
      const imgEl = card.querySelector(".card-img");
      let sources = [];
      if (dataImages && dataImages.trim() !== "") {
        sources = dataImages.split(",").map((s) => s.trim());
      } else if (imgEl && imgEl.src) {
        sources = [imgEl.src];
      }
      sources.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        modalImages.appendChild(img);
      });

      backdrop.classList.add("is-open");
      document.body.classList.add("modal-open");

      // Adjuntar lightbox a las imágenes recién inyectadas
      setTimeout(() => {
        const imgs = document.querySelectorAll(".project-modal-images img");
        const sources = Array.from(imgs).map((img) => img.src);
        imgs.forEach((img, i) => {
          img.style.cursor = "zoom-in";
          img.addEventListener("click", (e) => {
            e.stopPropagation();
            openLightbox(sources, i);
          });
        });
      }, 50);
    };

    // Abrir modal desde URL ?project=ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get("project");
    if (projectParam) {
      setTimeout(() => openModalById(projectParam), 400);
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Click en cards → abrir modal
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        openModalById(card.getAttribute("data-project"));
      });
    });

    // Cerrar modal
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");
    const lightboxCounter = document.getElementById("lightbox-counter");

    let lightboxImages = [];
    let lightboxIndex = 0;

    const showLightboxImage = (index, animate = true) => {
      lightboxIndex = index;
      if (animate) {
        lightboxImg.classList.add("is-transitioning");
        setTimeout(() => {
          lightboxImg.src = lightboxImages[index];
          lightboxImg.classList.remove("is-transitioning");
        }, 200);
      } else {
        lightboxImg.src = lightboxImages[index];
      }
      lightboxCounter.textContent = `${index + 1} / ${lightboxImages.length}`;
      lightboxPrev.disabled = index === 0;
      lightboxNext.disabled = index === lightboxImages.length - 1;
    };

    const openLightbox = (images, startIndex) => {
      lightboxImages = images;
      showLightboxImage(startIndex, false);
      lightbox.classList.add("is-open");
    };

    if (lightbox) {
      lightboxClose.addEventListener("click", () =>
        lightbox.classList.remove("is-open"),
      );
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) lightbox.classList.remove("is-open");
      });
      lightboxPrev.addEventListener("click", () => {
        if (lightboxIndex > 0) showLightboxImage(lightboxIndex - 1);
      });
      lightboxNext.addEventListener("click", () => {
        if (lightboxIndex < lightboxImages.length - 1)
          showLightboxImage(lightboxIndex + 1);
      });
      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("is-open")) return;
        if (e.key === "ArrowLeft" && lightboxIndex > 0)
          showLightboxImage(lightboxIndex - 1);
        if (e.key === "ArrowRight" && lightboxIndex < lightboxImages.length - 1)
          showLightboxImage(lightboxIndex + 1);
        if (e.key === "Escape") lightbox.classList.remove("is-open");
      });

      // Deslizar con el dedo (móvil/táctil) para pasar de una imagen a
      // otra, sin necesidad de tocar las flechas
      let touchStartX = 0;
      let touchStartY = 0;

      lightboxImg.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        },
        { passive: true },
      );

      lightboxImg.addEventListener(
        "touchend",
        (e) => {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;

          // Umbral mínimo y que el gesto sea mayormente horizontal (para
          // no confundirlo con un scroll vertical accidental)
          if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY))
            return;

          if (deltaX < 0 && lightboxIndex < lightboxImages.length - 1) {
            // Deslizar hacia la izquierda → siguiente imagen
            showLightboxImage(lightboxIndex + 1);
          } else if (deltaX > 0 && lightboxIndex > 0) {
            // Deslizar hacia la derecha → imagen anterior
            showLightboxImage(lightboxIndex - 1);
          }
        },
        { passive: true },
      );
    }
  }

  // ==============================
  // CARRUSEL CLICABLE (index.html)
  // ==============================
  const carouselLinks = document.querySelectorAll(".carousel-item--link");
  carouselLinks.forEach((item) => {
    item.addEventListener("click", () => {
      const projectId = item.getAttribute("data-project");
      if (projectId) {
        window.location.href = `./projects.html?project=${projectId}`;
      }
    });
  });

  // ==============================
  // THEME TOGGLE (claro / oscuro)
  // ==============================
  // Hay dos botones (el fijo de escritorio junto al selector de idioma,
  // y el que vive dentro del menú desplegable en móvil/tablet): ambos
  // deben alternar el tema igual, así que los recorremos todos.
  const themeToggles = document.querySelectorAll(".theme-toggle");

  // Aplicar tema: si la persona ya eligió uno manualmente en esta web,
  // se respeta ese; si no ha elegido nunca, se sigue la preferencia de
  // su sistema operativo/navegador (claro u oscuro).
  const storedTheme = localStorage.getItem("theme");
  const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = storedTheme || (prefersDarkQuery.matches ? "dark" : "light");
  document.documentElement.classList.toggle("dark-mode", savedTheme === "dark");

  // Activar el fundido de colores SOLO a partir de aquí (dos frames
  // después de pintar el tema guardado), para que la carga de la
  // página no se vea como una transición y solo se note al pulsar
  // el botón de claro/oscuro.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add("theme-transitions-ready");
    });
  });

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });

  // Si el sistema cambia de tema mientras la página está abierta y la
  // persona todavía no ha elegido nunca manualmente en esta web,
  // seguimos ese cambio en directo. En cuanto elige manualmente (click
  // de arriba), esto deja de aplicar y se respeta siempre su elección.
  prefersDarkQuery.addEventListener("change", (e) => {
    if (localStorage.getItem("theme")) return;
    document.documentElement.classList.toggle("dark-mode", e.matches);
  });

  // ==============================
  // LANG DROPDOWN EN NAVBAR
  // ==============================
  // Igual que con el theme-toggle: puede haber dos dropdowns de idioma
  // en la página (el fijo de escritorio, y el que vive dentro del menú
  // desplegable en móvil/tablet), así que los recorremos todos en vez
  // de asumir que solo existe uno.
  const langDropdowns = Array.from(document.querySelectorAll(".lang-dropdown")).map(
    (dropdown) => ({
      dropdown,
      btn: dropdown.querySelector(".lang-dropdown-btn"),
      menu: dropdown.querySelector(".lang-dropdown-menu"),
    }),
  );

  // Estado inicial: español
  let currentLang = localStorage.getItem("lang") || "es";

  // Respeta "reducir movimiento" del sistema: si está activado, los
  // textos cambian de golpe, sin animación de ningún tipo.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // No animamos la primera vez que se aplica el idioma (justo al cargar
  // la página), solo cuando el usuario cambia de idioma a partir de ahí.
  let langTransitionsReady = false;

  // ------------------------------
  // Fundido: al cambiar de idioma, el texto actual se desvanece y el
  // nuevo aparece igual de suave. Se usa para todos los textos (cortos
  // y párrafos largos con negritas/saltos de línea incluidos).
  // ------------------------------
  function fadeSwap(el, newHTML) {
    if (prefersReducedMotion || !langTransitionsReady) {
      el.innerHTML = newHTML;
      return;
    }

    if (el.innerHTML === newHTML) return;

    if (el._fadeTimer) {
      clearTimeout(el._fadeTimer);
      el._fadeTimer = null;
    }

    const prevTransition = el.style.transition;
    el.style.transition = "opacity 0.18s ease";
    el.style.opacity = "0";
    el._fadeTimer = setTimeout(() => {
      el.innerHTML = newHTML;
      void el.offsetWidth; // fuerza reflow para que el opacity:0 se aplique antes de animar
      el.style.opacity = "1";
      el._fadeTimer = setTimeout(() => {
        el.style.transition = prevTransition;
        el._fadeTimer = null;
      }, 200);
    }, 180);
  }

  // Envolver el código de idioma de cada botón (ES/EN) en su propio
  // <span> para poder actualizarlo sin tocar la flecha.
  langDropdowns.forEach((entry) => {
    if (!entry.btn) return;
    const arrow = entry.btn.querySelector(".lang-arrow");
    const langCodeEl = document.createElement("span");
    langCodeEl.className = "lang-code";
    langCodeEl.textContent = entry.btn.textContent.trim();
    entry.btn.innerHTML = "";
    entry.btn.appendChild(langCodeEl);
    entry.btn.appendChild(document.createTextNode(" "));
    if (arrow) entry.btn.appendChild(arrow);
    entry.langCodeEl = langCodeEl;
  });

  const applyLang = (lang) => {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    // Traducir todos los elementos con data-es / data-en
    document.querySelectorAll("[data-es], [data-en]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text === null) return;
      fadeSwap(el, text);
    });

    // Traducir cards hover overlay (data-title-es / data-title-en)
    document.querySelectorAll(".card[data-title-es]").forEach((card) => {
      const title = card.getAttribute(`data-title-${lang}`);
      const desc = card.getAttribute(`data-desc-${lang}`);
      const overlayTitle = card.querySelector(".card-hover-title");
      const overlayDesc = card.querySelector(".card-hover-desc");
      if (overlayTitle && title) fadeSwap(overlayTitle, title);
      if (overlayDesc && desc) fadeSwap(overlayDesc, desc);
    });

    // Actualizar todos los botones del dropdown (escritorio y móvil)
    const otherLang = lang === "es" ? "en" : "es";
    langDropdowns.forEach(({ menu, langCodeEl }) => {
      if (langCodeEl) fadeSwap(langCodeEl, lang.toUpperCase());
      const langOption = menu ? menu.querySelector(".lang-option") : null;
      if (langOption) {
        fadeSwap(langOption, otherLang.toUpperCase());
        langOption.setAttribute("data-lang", otherLang);
      }
    });
  };

  // Aplicar idioma guardado al cargar (sin animación la primera vez)
  applyLang(currentLang);
  langTransitionsReady = true;

  langDropdowns.forEach(({ btn, menu }) => {
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Al abrir uno, cerramos cualquier otro dropdown de idioma que
      // pudiera estar abierto (por si hubiera más de uno visible a la vez).
      langDropdowns.forEach(({ btn: otherBtn, menu: otherMenu }) => {
        if (otherMenu === menu) return;
        if (otherMenu) otherMenu.classList.remove("is-open");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });
      const isOpen = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", () => {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });

    menu.querySelectorAll(".lang-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        applyLang(opt.getAttribute("data-lang"));
        menu.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  // ==============================
  // NAVBAR ABOUT / PROJECTS: APARICIÓN DE LOGO AL SALIR DEL HERO
  // ==============================
  // El logo (que repite nombre + "Portfolio") se queda oculto en la
  // navbar mientras el hero de la página sigue siendo visible, y solo
  // aparece una vez ese hero ha desaparecido detrás de la propia navbar
  // al hacer scroll. Con IntersectionObserver en vez de comparar
  // posiciones de scroll a mano: más fiable en móvil, donde la altura
  // visible de la ventana cambia mientras se hace scroll (la barra de
  // direcciones aparece/desaparece).
  const setupLogoOnHeroScroll = (navbarSelector, heroSelector) => {
    const navbar = document.querySelector(navbarSelector);
    const hero = document.querySelector(heroSelector);
    if (!navbar || !hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        navbar.classList.toggle("scrolled", !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }, // -80px = alto de la navbar fija
    );
    observer.observe(hero);
  };

  setupLogoOnHeroScroll(".navbar-about", ".hero");
  setupLogoOnHeroScroll(".navbar-projects", ".top-parallax");

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // ==============================
  // NAVBAR HAMBURGUESA
  // ==============================
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksMenu = document.querySelector(".nav-links");
  const overlay = document.querySelector(".nav-overlay");

  if (navToggle && navLinksMenu && overlay) {
    const closeMenu = () => {
      navLinksMenu.classList.remove("nav-open");
      navToggle.classList.remove("nav-open");
      overlay.classList.remove("nav-open");
      document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navLinksMenu.classList.toggle("nav-open");
      navToggle.classList.toggle("nav-open", isOpen);
      overlay.classList.toggle("nav-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinksMenu.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a") closeMenu();
    });

    overlay.addEventListener("click", closeMenu);
  }

  // ==============================
  // SCROLLYTELLING EFFECTS
  // ==============================

  // Hero inicial
  const heroText = document.querySelector(".hero-text");
  const projectsHeroText = document.querySelector(".projects-hero-text");

  if (heroText) {
    setTimeout(() => {
      heroText.classList.add("hero-loaded");
      heroText.classList.add("hero-visible");
    }, 200);
  }

  if (projectsHeroText) {
    setTimeout(() => {
      projectsHeroText.classList.add("hero-loaded");
      projectsHeroText.classList.add("hero-visible");
    }, 200);
  }

  // Fade in al scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("fade-in-visible");
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in-scroll")
    .forEach((el) => fadeObserver.observe(el));

  // Section titles slide-in
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          entry.target.classList.add("slide-in-visible");
      });
    },
    { threshold: 0.3 },
  );
  document.querySelectorAll(".section-title").forEach((title) => {
    title.classList.add("slide-in-left");
    titleObserver.observe(title);
  });

  // Carousel stagger
  const carouselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll(".carousel-item");
          items.forEach((item, index) => {
            setTimeout(
              () => item.classList.add("carousel-item-visible"),
              index * 50,
            );
          });
          carouselObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(".carousel-row")
    .forEach((section) => carouselObserver.observe(section));

  // About scale-in
  const aboutSection = document.querySelector(".about-section");
  if (aboutSection) {
    aboutSection.classList.add("scale-in");
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("scale-in-visible");
        });
      },
      { threshold: 0.2 },
    ).observe(aboutSection);
  }

  // Contact float-in
  const contactBox = document.querySelector(".contact-box");
  if (contactBox) {
    contactBox.classList.add("float-in-bottom");
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("float-in-visible");
        });
      },
      { threshold: 0.2 },
    ).observe(contactBox);
  }

  // Scroll hint (flecha imagen)
  const createScrollHint = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const hint = document.createElement("div");
    hint.className = "scroll-hint icon-swap";
    hint.innerHTML = `<img src="https://ik.imagekit.io/anacallejon/portfolio_img/scroll_down_crema1.png" alt="scroll" class="scroll-hint-img icon-swap--crema" /><img src="https://ik.imagekit.io/anacallejon/portfolio_img/scroll_down_verde1.png" alt="" aria-hidden="true" class="scroll-hint-img icon-swap--verde" />`;
    hero.appendChild(hint);

    window.addEventListener("scroll", () => {
      const carouselRow = document.querySelector(".carousel-row");
      if (carouselRow) {
        const rect = carouselRow.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight) {
          hint.style.opacity = "0";
          hint.style.pointerEvents = "none";
        } else {
          hint.style.opacity = "1";
          hint.style.pointerEvents = "auto";
        }
      } else {
        hint.style.opacity = window.pageYOffset > 100 ? "0" : "1";
      }
    });
  };

  createScrollHint();
});
