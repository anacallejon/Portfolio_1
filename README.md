# creative-portfolio-web

This is my personal portfolio, built with vanilla HTML, CSS, and JavaScript, showcasing my work as a Graphic and Multimedia Design student. It started as a course project and has since grown into the portfolio I'm using to look for professional internships.

**Live Site:** [https://anacallejon.github.io/Portfolio_1/index.html](https://anacallejon.github.io/Portfolio_1/index.html)

## Project Description

A fully responsive portfolio featuring my design projects across branding, editorial, 3D, and photography work. The site includes a bilingual (Spanish/English) interface, automatic light/dark mode, an interactive project gallery with filtering and a lightbox viewer, and a downloadable CV.

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties/variables, custom animations, Grid, Flexbox)
- JavaScript (vanilla, no libraries)
- GitHub Pages (hosting)

**Fonts:** Unbounded and Petit Formal Script from Google Fonts

## Design System

### Color Palette

The whole site runs on light and dark mode, which follows the visitor's system preference by default (with a manual override that's remembered on return visits). Every color comes from one set of CSS custom properties in `assets/css/base.css`, so the whole palette can be adjusted from a single place.

| Color                   | Hex       | Usage                                    |
| ----------------------- | --------- | ---------------------------------------- |
| **Brand Green**         | `#416844` | Navbar, buttons, accents                 |
| **Brand Green (dark)**  | `#1a3320` | About background, strong accents         |
| **Brand Green (hover)** | `#2e4a30` | Button hover state                       |
| **Cream**               | `#ede8e1` | Surfaces and text over green backgrounds |
| **Off-white**           | `#f5f5f5` | Text over navbar/hero, light backgrounds |
| **Strong Text**         | `#1a1a1a` | Text over light backgrounds              |
| **Muted Text**          | `#4a4a4a` | Secondary/muted text                     |
| **Accent Pink**         | `#df6595` | One-off accent (404 page, submit button) |

### Typography

- **Primary Font:** [Unbounded](https://fonts.google.com/specimen/Unbounded)
  - Weights: Light (200), Regular (400), Medium (500), SemiBold (600), Bold (700)
  - Usage: Body text, headings, UI elements

- **Accent Font:** [Petit Formal Script](https://fonts.google.com/specimen/Petit+Formal+Script)
  - Weight: Regular (400)
  - Usage: Decorative headings, taglines

## Project Structure

```
Portfolio_1/
├── index.html
├── about.html
├── projects.html
├── 404.html
├── README.md
└── assets/
    ├── css/
    │   ├── reset.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   ├── index.css
    │   └── prefers-reduced-motion.css
    ├── js/
    │   └── main.js
    ├── img/
    └── pdfs/
```

## Features

- Bilingual interface (Spanish/English), with smooth fade transitions between languages
- Automatic light/dark mode that follows the visitor's system preference, with a manual toggle that's remembered on return visits
- Custom animated cursor that adapts its color to whatever it's hovering over (desktop)
- Infinite scrolling project carousel
- Project filtering by category (Branding, Editorial, 3D, Photography)
- Modal project viewer with an image gallery/lightbox, swipe-to-navigate on touch devices
- Responsive hamburger navigation
- Downloadable CV
- Contact form
- Custom 404 page
- Respects the visitor's "reduce motion" system setting

## Customization

**Colors:** update the CSS custom properties at the top of `assets/css/base.css` — every other color in the site is derived from that one set of variables.

**Fonts:** change the Google Fonts `<link>` tags in each HTML file's `<head>`, and the matching `font-family` declarations in the CSS.

**Content:** edit the HTML files directly. Project cards live in `projects.html`, experience and education details in `about.html`.

**Images:** most images are served from an external CDN (ImageKit); a handful of local ones live in `assets/img/`.

## Screenshots

### Hero Section

<!-- TODO: add screenshots -->

### Projects Grid

<!-- TODO: add screenshots -->

### About Section

<!-- TODO: add screenshots -->

### Contact Form

<!-- TODO: add screenshots -->

## Contact

Ana Callejón Alén

- Instagram: [@calen.between](https://instagram.com/calen.between)
- LinkedIn: [linkedin.com/in/ana-callejón-alén-6879a02a6](https://www.linkedin.com/in/ana-callej%C3%B3n-al%C3%A9n-6879a02a6/)
- Email: ana.callejonalen@gmail.com

## Credits

- Started as the final project for the Web Foundations course, WEB ATELIER (UDIT) — Professor Rubén Vega Balbás, PhD
- Fonts: Google Fonts
- Hosting: GitHub Pages
