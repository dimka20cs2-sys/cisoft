// Общие помощники сайта CISOFT: экранирование, даты, склонения, иконки, счётчики, лайки, тосты.
(function () {
  var CI = window.CI = window.CI || {};
  CI.SITE = window.SITE || {};
  CI.TYPES = window.TYPES || {};
  CI.ITEMS = window.ITEMS || [];
  CI.SITE_URL = (CI.SITE.url || "https://cisoft.vercel.app/").replace(/\/?$/, "/");
  CI.app = document.getElementById("app");

  CI.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  CI.date = function (d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : d;
  };
  CI.longDate = function (d) {
    var t = CI.parseDate(d);
    return t ? t.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : CI.esc(d);
  };
  CI.parseDate = function (d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ""));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  // «Новое» — дата публикации не старше 14 дней
  CI.isNew = function (it) {
    var t = CI.parseDate(it.date);
    if (!t) return false;
    var days = (Date.now() - t.getTime()) / 864e5;
    return days >= -1 && days <= 14;
  };
  // 1 программа, 2 программы, 5 программ
  CI.plural = function (n, one, few, many) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b === 1) return one;
    if (b >= 2 && b <= 4) return few;
    return many;
  };
  CI.num = function (n) { return Number(n || 0).toLocaleString("ru-RU"); };

  CI.icon = function (it, big) {
    var cls = "icon" + (big ? " big" : "");
    if (it.icon) return '<img class="' + cls + '" src="' + CI.esc(it.icon) + '" alt="" loading="lazy">';
    return '<div class="' + cls + ' ph">' + CI.esc((it.name || "?").charAt(0).toUpperCase()) + "</div>";
  };
  CI.badge = function (type) {
    return '<span class="badge ' + CI.esc(type) + '">' + CI.esc(CI.TYPES[type] || type || "") + "</span>";
  };
  CI.byId = function (id) { return CI.ITEMS.filter(function (x) { return x.id === id; })[0]; };

  // Система пользователя: windows | android | other
  CI.os = (function () {
    var ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "android";
    if (/Windows/i.test(ua)) return "windows";
    return "other";
  })();

  CI.reducedMotion = function () {
    return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  // ── хранилище (localStorage может быть недоступен) ──
  CI.load = function (k, def) {
    try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
  };
  CI.save = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // ── счётчики (заполняет js/stats.js, если Firebase доступен) ──
  CI.stats = {};          // id → { downloads, likes }
  CI.statsOk = false;
  var pending = [], listeners = [];
  CI.hit = function (id, field) {
    if (!id) return;
    if (CI._hit) CI._hit(id, field); else if (pending.length < 50) pending.push([id, field]);
  };
  CI.attachStats = function (hitFn) {
    CI._hit = hitFn;
    pending.splice(0).forEach(function (p) { hitFn(p[0], p[1]); });
  };
  CI.setStats = function (map) {
    var first = !CI.statsOk;
    CI.stats = map;
    CI.statsOk = true;
    document.body.classList.add("stats-on");
    CI.paintStats(document);
    listeners.forEach(function (fn) { try { fn(first); } catch (e) {} });
  };
  CI.onStats = function (fn) { listeners.push(fn); };
  CI.st = function (id) { return CI.stats[id] || { downloads: 0, likes: 0 }; };
  CI.totalDownloads = function () {
    return CI.ITEMS.reduce(function (s, it) { return s + (CI.st(it.id).downloads || 0); }, 0);
  };

  // ── лайки и избранное: только для вошедших (заполняет js/acc-core.js из Firestore) ──
  try { localStorage.removeItem("ci-liked"); } catch (e) {} // старые анонимные отметки больше не нужны
  CI.myLikes = {};   // itemId → true
  CI.myFavs = {};    // itemId → мс добавления
  CI.isLiked = function (id) { return !!CI.myLikes[id]; };
  CI.isFav = function (id) { return !!CI.myFavs[id]; };
  // Вход нужен: открываем окно входа с пояснением (если модуль аккаунта ещё грузится — тост)
  CI.requireLogin = function (why) {
    if (CI.acc && CI.acc.openAuth) CI.acc.openAuth("login", why);
    else CI.toast(why + " Войдите в аккаунт (кнопка «Войти» вверху).");
  };
  function signedIn() { return !!(CI.acc && CI.acc.ready && CI.acc.user && CI.acc.profile); }
  CI.toggleLike = function (id) {
    if (CI.acc && !CI.acc.ready) return CI.toast("Проверяем вход…");
    if (!signedIn()) return CI.requireLogin("Лайки ставят зарегистрированные пользователи — так счётчик честный.");
    CI.acc.toggleLike(id);
  };
  CI.toggleFav = function (id) {
    if (CI.acc && !CI.acc.ready) return CI.toast("Проверяем вход…");
    if (!signedIn()) return CI.requireLogin("Избранное хранится в личном кабинете.");
    CI.acc.toggleFav(id);
  };

  // Обновить все числа и состояния лайков в разметке
  CI.paintStats = function (root) {
    root.querySelectorAll("[data-count-dl]").forEach(function (el) {
      el.textContent = CI.num(CI.st(el.getAttribute("data-count-dl")).downloads);
    });
    root.querySelectorAll("[data-count-like]").forEach(function (el) {
      el.textContent = CI.num(CI.st(el.getAttribute("data-count-like")).likes);
    });
    root.querySelectorAll("[data-like]").forEach(function (el) {
      var on = CI.isLiked(el.getAttribute("data-like"));
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    root.querySelectorAll("[data-fav]").forEach(function (el) {
      var on = CI.isFav(el.getAttribute("data-fav"));
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
      el.title = on ? "Убрать из избранного" : "В избранное";
      var s = el.querySelector(".star"); if (s) s.textContent = on ? "★" : "☆";
      var l = el.querySelector(".fav-label"); if (l) l.textContent = on ? "В избранном" : "В избранное";
    });
    var tot = document.getElementById("hero-total");
    if (tot) tot.innerHTML = CI.heroLine();
  };

  CI.heroLine = function () {
    var n = CI.ITEMS.length, parts = [n + " " + CI.plural(n, "программа", "программы", "программ")];
    if (CI.statsOk) {
      var d = CI.totalDownloads();
      parts.push(CI.num(d) + " " + CI.plural(d, "скачивание", "скачивания", "скачиваний"));
    }
    parts.push("бесплатно");
    return parts.map(CI.esc).join(" · ");
  };

  // Клик по лайку и по любой ссылке скачивания (делегирование)
  document.addEventListener("click", function (e) {
    var like = e.target.closest && e.target.closest("[data-like]");
    if (like) { e.preventDefault(); e.stopPropagation(); CI.toggleLike(like.getAttribute("data-like")); return; }
    var fav = e.target.closest && e.target.closest("[data-fav]");
    if (fav) { e.preventDefault(); e.stopPropagation(); CI.toggleFav(fav.getAttribute("data-fav")); return; }
    var dl = e.target.closest && e.target.closest("a[data-dl]");
    if (dl) {
      CI.hit(dl.getAttribute("data-dl"), "downloads"); // само скачивание не трогаем
      if (signedIn()) CI.acc.recordDownload(dl.getAttribute("data-dl"), dl.getAttribute("data-dl-label") || "Скачать");
    }
  });

  // ── тосты ──
  CI.toast = function (text, opts) {
    opts = opts || {};
    var box = document.getElementById("toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.className = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="toast-text"></span>';
    t.firstChild.textContent = text;
    if (opts.action) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "toast-btn"; b.textContent = opts.action;
      b.onclick = function () { close(); if (opts.onAction) opts.onAction(); };
      t.appendChild(b);
    }
    var x = document.createElement("button");
    x.type = "button"; x.className = "toast-x"; x.setAttribute("aria-label", "Закрыть"); x.textContent = "✕";
    x.onclick = close;
    t.appendChild(x);
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    var timer = setTimeout(close, opts.timeout || 4000);
    function close() { clearTimeout(timer); t.classList.add("out"); setTimeout(function () { t.remove(); }, 250); }
    return close;
  };
})();
