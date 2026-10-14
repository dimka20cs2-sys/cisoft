// Шапка, подвал, тема, кнопка «Наверх», горячие клавиши.
(function () {
  var CI = window.CI, SITE = CI.SITE, root = document.documentElement;

  // ── шапка/подвал ──
  document.getElementById("site-name").textContent = SITE.name || "";
  document.getElementById("logo").textContent = (SITE.name || "?").replace(/[^A-Za-zА-Яа-я0-9]/g, "").slice(0, 2).toUpperCase();
  document.getElementById("copy").textContent = "© " + new Date().getFullYear() + " " + (SITE.author || SITE.name || "") + " · Файлы бесплатны.";
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

  // ── тема: сохранённая или системная ──
  var meta = document.querySelector('meta[name="theme-color"]');
  var sys = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  function saved() { try { return localStorage.getItem("ci-theme"); } catch (e) { return null; } }
  function apply(t) {
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", t === "light" ? "#f5f6fa" : "#111217");
    var btn = document.getElementById("theme-btn");
    btn.setAttribute("title", t === "light" ? "Тёмная тема" : "Светлая тема");
    btn.setAttribute("aria-label", t === "light" ? "Включить тёмную тему" : "Включить светлую тему");
  }
  apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  document.getElementById("theme-btn").onclick = function () {
    var t = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem("ci-theme", t); } catch (e) {}
    apply(t);
  };
  if (sys) {
    var onSys = function () { if (!saved()) apply(sys.matches ? "light" : "dark"); };
    if (sys.addEventListener) sys.addEventListener("change", onSys); else if (sys.addListener) sys.addListener(onSys);
  }

  // ── кнопка «Наверх» ──
  var up = document.createElement("button");
  up.type = "button";
  up.className = "to-top";
  up.setAttribute("aria-label", "Наверх");
  up.title = "Наверх";
  up.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  up.onclick = function () { window.scrollTo({ top: 0, behavior: CI.reducedMotion() ? "auto" : "smooth" }); };
  document.body.appendChild(up);
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; up.classList.toggle("show", window.scrollY > 600); });
  }, { passive: true });

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
      location.hash = "#/";
    } else if (e.key === "Escape") {
      if (CI.msgr && CI.msgr.isOpen()) { CI.msgr.close(); return; }
      if (document.activeElement && document.activeElement.id === "search") {
        if (!CI.clearSearch()) document.activeElement.blur();
      } else CI.clearSearch();
    }
  });
})();
