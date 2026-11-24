// #/news — лента изменений всех программ (changelog из ITEMS), новые сверху.
(function () {
  var CI = window.CI, esc = CI.esc, T = CI.t;

  CI.renderNews = function () {
    document.title = T("Новости") + " — " + (CI.SITE.name || "");
    var rows = [];
    CI.ITEMS.forEach(function (it, idx) {
      (it.changelog || []).forEach(function (c) { rows.push({ it: it, c: c, idx: idx }); });
    });
    rows.sort(function (a, b) {
      return String(b.c.date || "").localeCompare(String(a.c.date || "")) || b.idx - a.idx;
    });

    var html = '<section class="page-head"><h1>' + T("Новости") + "</h1><p>" + T("Новые программы и обновления — всё, что менялось на сайте.") + "</p></section>";
    if (!rows.length) html += '<div class="empty">' + T("Пока новостей нет") + "</div>";
    var lastDate = null;
    html += '<div class="news">';
    rows.forEach(function (r) {
      if (r.c.date !== lastDate) {
        if (lastDate !== null) html += "</div>";
        lastDate = r.c.date;
        html += '<div class="news-day"><h2 class="news-date"><time datetime="' + esc(r.c.date) + '">' + CI.longDate(r.c.date) + "</time></h2>";
      }
      // «Первый выпуск» помечает js/i18n.js (по русскому тексту, до перевода)
      var first = r.c.first != null ? r.c.first : (r.c.changes || []).length === 1 && /первый выпуск/i.test(r.c.changes[0]);
      html += '<article class="news-item">' +
        '<a class="news-icon" href="#/item/' + encodeURIComponent(r.it.id) + '" tabindex="-1" aria-hidden="true">' + CI.icon(r.it) + "</a>" +
        '<div class="news-body"><div class="news-title">' +
          '<a href="#/item/' + encodeURIComponent(r.it.id) + '">' + esc(r.it.name) + "</a>" +
          '<span class="ver">v' + esc(r.c.version) + "</span>" + CI.badge(r.it.type) +
          (first ? '<span class="new-tag">' + T("Новая программа") + "</span>" : "") +
        "</div>" +
        (first ? "<p>" + esc(r.it.short) + "</p>" : "") +
        "<ul>" + (r.c.changes || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "</div></article>";
    });
    if (lastDate !== null) html += "</div>";
    html += "</div>";
    CI.app.innerHTML = html;
  };
})();
