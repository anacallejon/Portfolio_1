// JS principal para cursor personalizado, modales, navbar y SCROLLYTELLING
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // CUSTOM CURSOR
  // ==============================
  const cursor = document.querySelector(".custom-cursor");

  if (cursor) {
    const COLOR1 = "rgb(227, 74, 111)"; // #E34A6F
    const COLOR2 = "rgb(193, 53, 89)"; // #C13559

    // Mover el cursor y cambiar color según el fondo
    document.addEventListener("mousemove", (e) => {
      cursor.style.opacity = "1";
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;

      // Truco: ocultar el cursor para poder "ver" lo que hay debajo
      cursor.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      cursor.style.visibility = "visible";

      if (!el) return;

      // Si estamos sobre un link/botón y quieres mantener el efecto .is-link,
      // NO cambiamos colores aquí
      if (cursor.classList.contains("is-link")) {
        return;
      }

      // Leer color de fondo real del elemento (subiendo por los padres si es transparente)
      let node = el;
      let bgColor = "rgba(0, 0, 0, 0)";

      while (node && node !== document.documentElement) {
        const computed = window.getComputedStyle(node);
        bgColor = computed.backgroundColor;

        if (bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
          break;
        }
        node = node.parentElement;
      }

      // Cambiar color del cursor según el fondo
      if (bgColor === COLOR1) {
        // si el fondo es #b2c1ed → cursor pasa a #8b93bc
        cursor.style.backgroundColor = COLOR2;
        cursor.style.borderColor = COLOR2;
      } else if (bgColor === COLOR2) {
        // si el fondo es #8b93bc → cursor pasa a #b2c1ed
        cursor.style.backgroundColor = COLOR1;
        cursor.style.borderColor = COLOR1;
      } else {
        // en cualquier otro fondo: color base
        cursor.style.backgroundColor = COLOR1;
        cursor.style.borderColor = COLOR1;
      }
    });

    // Ocultar cursor al salir de la ventana
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    // Hover en enlaces/botones → mantiene tu efecto "is-link"
    const interactive = document.querySelectorAll("a, button");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("is-link"),
      );
    });
  }

  // ==============================
  // CARRUSEL CLICABLE (index.html)
  // Al hacer click en un carousel-item--link navega a projects.html?project=ID
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
  // MODAL DE PROYECTOS (projects.html)
  // ==============================
  if (document.body.classList.contains("projects-page")) {
    // ===== FILTRADO DE PROYECTOS CON SOPORTE PARA MÚLTIPLES CATEGORÍAS =====
    const filterBtns = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Actualizar botón activo
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        // Filtrar cards con soporte para múltiples categorías
        cards.forEach((card) => {
          const categories = card.getAttribute("data-category");

          // Dividir las categorías por espacios para soportar múltiples
          const categoryArray = categories
            ? categories.trim().split(/\s+/)
            : [];

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

    // ===== MODAL DE PROYECTOS =====
    const backdrop = document.querySelector(".project-modal-backdrop");
    const modalText = document.querySelector(".project-modal-text");
    const modalImages = document.querySelector(".project-modal-images");
    const modalCloseBtn = document.querySelector(".project-modal-close");

    // Función para cerrar el modal
    const closeModal = () => {
      backdrop.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    };

    // Función reutilizable para abrir el modal de un proyecto por su ID
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
    };

    // Comprobar si la URL tiene ?project=ID para abrir el modal al cargar
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get("project");
    if (projectParam) {
      // Pequeño delay para que las animaciones de entrada no bloqueen
      setTimeout(() => openModalById(projectParam), 400);
      // Limpiar el parámetro de la URL sin recargar la página
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Solo si existen todos los elementos necesarios
    if (backdrop && cards.length > 0 && modalText && modalImages) {
      // Abrir modal al hacer click en cada card
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          openModalById(card.getAttribute("data-project"));
        });
      });

      // Cerrar modal haciendo click en el fondo oscuro
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          closeModal();
        }
      });

      // Cerrar modal haciendo click en el botón X
      if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
      }
    }
  }

  // ==============================
  // NAVBAR ABOUT: APARICIÓN DE LOGO AL SCROLL
  // ==============================
  const aboutNavbar = document.querySelector(".navbar-about");
  const introSection = document.querySelector(".intro-section");

  // Solo ejecutar en about.html (cuando existe la combinación)
  if (aboutNavbar && introSection) {
    window.addEventListener("scroll", () => {
      const introTop = introSection.getBoundingClientRect().top;

      /*
        Si el borde superior de intro-section está
        en el borde superior del viewport (o ha subido ya),
        activamos la versión con logo (.scrolled).
      */
      if (introTop <= 0) {
        aboutNavbar.classList.add("scrolled");
      } else {
        aboutNavbar.classList.remove("scrolled");
      }
    });
  }

  // Forzar que la página siempre cargue arriba del todo
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // ==============================
  // NAVBAR HAMBURGUESA
  // ==============================
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksMenu = document.querySelector(".nav-links");
  const overlay = document.querySelector(".nav-overlay");

  if (!navToggle || !navLinksMenu || !overlay) {
    console.warn("Falta nav-toggle, nav-links o nav-overlay en el HTML.");
  } else {
    const closeMenu = () => {
      navLinksMenu.classList.remove("nav-open");
      navToggle.classList.remove("nav-open");
      overlay.classList.remove("nav-open");
      document.body.classList.remove("nav-open");
    };

    // Abrir/cerrar al clicar la hamburguesa
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksMenu.classList.toggle("nav-open");
      navToggle.classList.toggle("nav-open", isOpen);
      overlay.classList.toggle("nav-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    });

    // Cerrar al clicar un enlace
    navLinksMenu.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a") {
        closeMenu();
      }
    });

    // Cerrar al clicar el fondo oscuro
    overlay.addEventListener("click", closeMenu);
  }

  // ==============================
  // SCROLLYTELLING EFFECTS
  // ==============================

  // ===== HERO INITIAL LOAD ANIMATION =====
  const heroText = document.querySelector(".hero-text");
  const projectsHeroText = document.querySelector(".projects-hero-text");

  if (heroText) {
    // Pequeño delay para que se note la animación
    setTimeout(() => {
      heroText.classList.add("hero-loaded");
      heroText.classList.add("hero-visible");
    }, 200);
  }

  if (projectsHeroText) {
    // Pequeño delay para que se note la animación
    setTimeout(() => {
      projectsHeroText.classList.add("hero-loaded");
      projectsHeroText.classList.add("hero-visible");
    }, 200);
  }

  // ===== INTERSECTION OBSERVER - FADE IN ELEMENTS =====
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
      }
    });
  }, observerOptions);

  // Observar elementos con la clase 'fade-in-scroll'
  const fadeElements = document.querySelectorAll(".fade-in-scroll");
  fadeElements.forEach((el) => fadeObserver.observe(el));

  // ===== SECTION TITLE SLIDE-IN EFFECT =====
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-in-visible");
        }
      });
    },
    { threshold: 0.3 },
  );

  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach((title) => {
    title.classList.add("slide-in-left");
    titleObserver.observe(title);
  });

  // ===== CAROUSEL ITEMS STAGGER ANIMATION =====
  const carouselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll(".carousel-item");
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("carousel-item-visible");
            }, index * 50);
          });
          carouselObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  const carouselSections = document.querySelectorAll(".carousel-row");
  carouselSections.forEach((section) => carouselObserver.observe(section));

  // ===== ABOUT SECTION - SCALE IN EFFECT =====
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scale-in-visible");
        }
      });
    },
    { threshold: 0.2 },
  );

  const aboutSection = document.querySelector(".about-section");
  if (aboutSection) {
    aboutSection.classList.add("scale-in");
    aboutObserver.observe(aboutSection);
  }

  // ===== CONTACT BOX - FLOAT IN FROM BOTTOM =====
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("float-in-visible");
        }
      });
    },
    { threshold: 0.2 },
  );

  const contactBox = document.querySelector(".contact-box");
  if (contactBox) {
    contactBox.classList.add("float-in-bottom");
    contactObserver.observe(contactBox);
  }

  // ===== SCROLL HINT - DESAPARECE AL HACER SCROLL =====
  const createScrollHint = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const hint = document.createElement("div");
    hint.className = "scroll-hint";
    hint.innerHTML = "↓ Scroll to explore ↓";
    hero.appendChild(hint);

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 100) {
        hint.style.opacity = "0";
        hint.style.pointerEvents = "none";
      } else {
        hint.style.opacity = "1";
        hint.style.pointerEvents = "auto";
      }
    });
  };

  createScrollHint();
});
