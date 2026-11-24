// Шапка, подвал, тема, кнопка «Наверх», горячие клавиши.
(function () {
  var CI = window.CI, T = CI.t, SITE = CI.SITE, root = document.documentElement;

  // ── шапка/подвал ──
  document.getElementById("site-name").textContent = SITE.name || "";
  function footCopy() {
    document.getElementById("copy").textContent = "© " + new Date().getFullYear() + " " + (SITE.author || SITE.name || "") + " · " + T("Файлы бесплатны.");
  }
  footCopy();
  CI.applyStatic();
  if (SITE.contact) {
    ["contact-link", "foot-contact"].forEach(function (id) {
      var a = document.getElementById(id);
      a.href = SITE.contact; a.hidden = false;
    });
  }

  // Высота шапки → --hdr (для страницы мессенджера и отступов)
  var top = document.getElementById("top");
  function measure() { root.style.setProperty("--hdr", top.offsetHeight + "px"); }
  measure();
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(top);
  else window.addEventListener("resize", measure);

  CI.setActiveNav = function (name) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === name;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  };

  // ── тема: сохранённая или системная (dark, light, indigo, purple) ──
  var meta = document.querySelector('meta[name="theme-color"]');
  var sys = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  var validThemes = ["dark", "light", "indigo", "purple"];
  function saved() {
    try {
      var t = localStorage.getItem("ci-theme");
      if (validThemes.indexOf(t) !== -1) return t;
    } catch (e) {}
    return null;
  }
  function themeMetaColor(t) {
    if (t === "light") return "#f5f7fb";
    if (t === "indigo") return "#060814";
    if (t === "purple") return "#0b0714";
    return "#090a10";
  }
  function apply(t) {
    if (validThemes.indexOf(t) === -1) t = "dark";
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", themeMetaColor(t));
    var btn = document.getElementById("theme-btn");
    var titles = {
      dark: T("Тёмная тема"),
      light: T("Светлая тема"),
      indigo: T("Тема Индиго"),
      purple: T("Фиолетовая тема")
    };
    if (btn) {
      btn.setAttribute("title", titles[t] || T("Выбрать тему"));
      btn.setAttribute("aria-label", titles[t] || T("Выбрать тему"));
    }
    var menu = document.getElementById("theme-menu");
    if (menu) {
      menu.querySelectorAll("[data-theme-val]").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-theme-val") === t);
      });
    }
  }

  var curTheme = saved();
  if (!curTheme) {
    curTheme = sys && sys.matches ? "light" : "dark";
  }
  apply(curTheme);

  var themeBtn = document.getElementById("theme-btn");
  var themeMenu = document.getElementById("theme-menu");
  if (themeBtn && themeMenu) {
    themeBtn.onclick = function (e) {
      e.stopPropagation();
      var open = !themeMenu.hidden;
      themeMenu.hidden = open;
      themeBtn.setAttribute("aria-expanded", String(!open));
    };
    themeMenu.querySelectorAll("[data-theme-val]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var val = b.getAttribute("data-theme-val");
        try { localStorage.setItem("ci-theme", val); } catch (err) {}
        apply(val);
        themeMenu.hidden = true;
        themeBtn.setAttribute("aria-expanded", "false");
      };
    });
    document.addEventListener("click", function (e) {
      if (!themeMenu.hidden && !themeMenu.contains(e.target) && e.target !== themeBtn) {
        themeMenu.hidden = true;
        themeBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (sys) {
    var onSys = function () { if (!saved()) apply(sys.matches ? "light" : "dark"); };
    if (sys.addEventListener) sys.addEventListener("change", onSys); else if (sys.addListener) sys.addListener(onSys);
  }

  // ── кнопка «Наверх» ──
  var up = document.createElement("button");
  up.type = "button";
  up.className = "to-top";
  up.setAttribute("aria-label", T("Наверх"));
  up.title = T("Наверх");
  up.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  up.onclick = function () { window.scrollTo({ top: 0, behavior: CI.reducedMotion() ? "auto" : "smooth" }); };
  document.body.appendChild(up);
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; up.classList.toggle("show", window.scrollY > 600); });
  }, { passive: true });

  // ── язык: кнопка RU / UK / EN с меню (как у темы) ──
  var langBtn = document.getElementById("lang-btn"), langMenu = document.getElementById("lang-menu");
  function langPaint() {
    var code = CI.lang.toUpperCase();
    document.getElementById("lang-cur").textContent = code;
    var lbl = T("Язык") + ": " + CI.LANG_NAMES[CI.lang];
    langBtn.setAttribute("aria-label", lbl);
    langBtn.title = lbl;
    langMenu.querySelectorAll("[data-lang-val]").forEach(function (b) {
      var on = b.getAttribute("data-lang-val") === CI.lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
  }
  function langOpen(v) {
    langMenu.hidden = !v;
    langBtn.setAttribute("aria-expanded", v ? "true" : "false");
    if (v) { var a = langMenu.querySelector(".active") || langMenu.querySelector("button"); if (a) a.focus(); }
  }
  if (langBtn && langMenu) {
    langPaint();
    langBtn.onclick = function (e) {
      e.stopPropagation();
      if (themeMenu && !themeMenu.hidden) { themeMenu.hidden = true; themeBtn.setAttribute("aria-expanded", "false"); }
      langOpen(langMenu.hidden);
    };
    langMenu.querySelectorAll("[data-lang-val]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        langOpen(false);
        langBtn.focus();
        CI.setLang(b.getAttribute("data-lang-val"));
      };
    });
    langMenu.addEventListener("keydown", function (e) {
      var items = [].slice.call(langMenu.querySelectorAll("button")), i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
      } else if (e.key === "Escape") { e.stopPropagation(); langOpen(false); langBtn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!langMenu.hidden && !langMenu.contains(e.target) && e.target !== langBtn) langOpen(false);
    });
    if (themeBtn) themeBtn.addEventListener("click", function () { langOpen(false); });
  }
  CI.onLang(function () {
    footCopy();
    apply(root.getAttribute("data-theme"));
    up.setAttribute("aria-label", T("Наверх"));
    up.title = T("Наверх");
    if (langBtn) langPaint();
  });

  // ── горячие клавиши: «/» — поиск, Esc — очистить поиск / закрыть панель ──
  function typing(el) {
    return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }
  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "/" && !typing(document.activeElement)) {
      e.preventDefault();
      var s = document.getElementById("search");
      if (s) { s.focus(); s.select(); return; }
      CI.focusSearchAfterRoute = true;
      location.hash = "#/catalog";
    } else if (e.key === "Escape") {
      if (CI.msgr && CI.msgr.isOpen()) { CI.msgr.close(); return; }
      if (document.activeElement && document.activeElement.id === "search") {
        if (!CI.clearSearch()) document.activeElement.blur();
      } else CI.clearSearch();
    }
  });
})();
