// JS principal para cursor personalizado, modales, navbar y SCROLLYTELLING
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // CUSTOM CURSOR
  // ==============================
  const cursor = document.querySelector(".custom-cursor");

  if (cursor) {
    const COLOR1 = "rgb(65, 104, 68)"; // #416844
    const COLOR2 = "rgb(46, 74, 48)"; // #2E4A30

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
      let bgColor = "rgba(0, 0, 0, 0)";
      while (node && node !== document.documentElement) {
        const computed = window.getComputedStyle(node);
        bgColor = computed.backgroundColor;
        if (bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") break;
        node = node.parentElement;
      }

      if (bgColor === COLOR1) {
        cursor.style.backgroundColor = COLOR2;
        cursor.style.borderColor = COLOR2;
      } else if (bgColor === COLOR2) {
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
        if (detailTitle) modalText.appendChild(detailTitle.cloneNode(true));
        if (detailText) modalText.appendChild(detailText.cloneNode(true));
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
  const themeToggle = document.getElementById("theme-toggle");

  // Aplicar tema guardado (por defecto oscuro)
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("dark-mode", savedTheme === "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ==============================
  // LANG DROPDOWN EN NAVBAR
  // ==============================
  const langBtn = document.querySelector(".lang-dropdown-btn");
  const langMenu = document.querySelector(".lang-dropdown-menu");

  // Estado inicial: español
  let currentLang = localStorage.getItem("lang") || "es";

  const applyLang = (lang) => {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    // Traducir todos los elementos con data-es / data-en
    document.querySelectorAll("[data-es], [data-en]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        // Usar innerHTML para respetar <br> y otras etiquetas
        el.innerHTML = text;
      }
    });

    // Traducir cards hover overlay (data-title-es / data-title-en)
    document.querySelectorAll(".card[data-title-es]").forEach((card) => {
      const title = card.getAttribute(`data-title-${lang}`);
      const desc = card.getAttribute(`data-desc-${lang}`);
      const overlayTitle = card.querySelector(".card-hover-title");
      const overlayDesc = card.querySelector(".card-hover-desc");
      if (overlayTitle && title) overlayTitle.textContent = title;
      if (overlayDesc && desc) overlayDesc.textContent = desc;
    });

    // Actualizar botón del dropdown
    const otherLang = lang === "es" ? "en" : "es";
    if (langBtn)
      langBtn.innerHTML = `${lang.toUpperCase()} <span class="lang-arrow">▾</span>`;
    const langOption = langMenu ? langMenu.querySelector(".lang-option") : null;
    if (langOption) {
      langOption.textContent = otherLang.toUpperCase();
      langOption.setAttribute("data-lang", otherLang);
    }
  };

  // Aplicar idioma guardado al cargar
  applyLang(currentLang);

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = langMenu.classList.toggle("is-open");
      langBtn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", () => {
      langMenu.classList.remove("is-open");
      langBtn.setAttribute("aria-expanded", "false");
    });

    langMenu.querySelectorAll(".lang-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        applyLang(opt.getAttribute("data-lang"));
        langMenu.classList.remove("is-open");
        langBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==============================
  // NAVBAR ABOUT: APARICIÓN DE LOGO AL SCROLL
  // ==============================
  const aboutNavbar = document.querySelector(".navbar-about");
  const introSection = document.querySelector(".intro-section");
  if (aboutNavbar && introSection) {
    window.addEventListener("scroll", () => {
      if (introSection.getBoundingClientRect().top <= 0) {
        aboutNavbar.classList.add("scrolled");
      } else {
        aboutNavbar.classList.remove("scrolled");
      }
    });
  }

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
    hint.className = "scroll-hint";
    hint.innerHTML = `<img src="https://ik.imagekit.io/anacallejon/img_portfolio/scroll_down1.png?updatedAt=1776855881079" alt="scroll" class="scroll-hint-img" />`;
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
