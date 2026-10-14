// Страница программы: #/item/<id>
(function () {
  var CI = window.CI, esc = CI.esc;

  CI.renderItem = function (id) {
    var app = CI.app, it = CI.byId(id);
    if (!it) { app.innerHTML = '<a class="back" href="#/">← Каталог</a><div class="empty">Публикация не найдена</div>'; return; }
    document.title = it.name + " — " + (CI.SITE.name || "");
    var shots = it.screenshots || [];
    var eid = esc(it.id);

    var html =
      '<a class="back" href="#/">← Каталог</a>' +
      '<div class="item-head">' + CI.icon(it, true) +
        "<div>" + CI.badge(it.type) + (CI.isNew(it) ? '<span class="new-tag">Новое</span>' : "") +
        "<h1>" + esc(it.name) + "</h1><p>" + esc(it.short) + "</p></div></div>" +
      '<div class="layout"><div>';

    if (shots.length) {
      html += '<div class="shots"><button type="button" class="main" id="shot-main" aria-label="Увеличить"><img id="shot-img" src="' + esc(shots[0].src) + '" alt=""></button>' +
        '<div class="caption" id="shot-cap">' + esc(shots[0].caption || "") + "</div>";
      if (shots.length > 1) {
        html += '<div class="thumbs">' + shots.map(function (s, i) {
          return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-i="' + i + '" aria-label="Скриншот ' + (i + 1) + '"><img src="' + esc(s.src) + '" alt=""></button>';
        }).join("") + "</div>";
      }
      html += "</div>";
    }
    if (it.description && it.description.length) {
      html += '<div class="section"><h2>Описание</h2>' + [].concat(it.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
    }
    if (it.features && it.features.length) {
      html += '<div class="section"><h2>Возможности</h2><div class="features">' + it.features.map(function (f) {
        return '<div class="feature"><b>' + esc(f.title) + "</b><span>" + esc(f.text) + "</span></div>";
      }).join("") + "</div></div>";
    }
    if (it.notes && it.notes.length) {
      html += '<div class="section"><h2>Важно</h2>' + it.notes.map(function (n) { return '<div class="note">' + esc(n) + "</div>"; }).join("") + "</div>";
    }
    if (it.changelog && it.changelog.length) {
      html += '<div class="section"><h2>Что нового</h2>' + it.changelog.map(function (c) {
        return '<div class="log"><b>v' + esc(c.version) + "</b><small>" + CI.date(c.date) + "</small><ul>" +
          (c.changes || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div>";
    }

    html += '</div><aside class="side"><div class="dl">' + dlButtons(it) +
      '<div class="item-actions">' +
        '<span class="stat dl-count" title="Скачиваний">⬇ <span data-count-dl="' + eid + '">0</span></span>' +
        '<button type="button" class="like" data-like="' + eid + '" aria-pressed="false" title="Нравится">' +
          '<span class="heart">❤</span><span class="like-label">Нравится</span><span class="stat" data-count-like="' + eid + '">0</span></button>' +
        '<button type="button" class="fav" data-fav="' + eid + '" aria-pressed="false" title="В избранное">' +
          '<span class="star">☆</span><span class="fav-label">В избранное</span></button>' +
        '<button type="button" class="share-btn" id="share-btn" title="Поделиться">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>Поделиться</button>' +
      "</div>" +
      CI.qrBlock(it) +
      "<dl>" +
      (it.version ? "<dt>Версия</dt><dd>" + esc(it.version) + "</dd>" : "") +
      (it.date ? "<dt>Обновлено</dt><dd>" + CI.date(it.date) + "</dd>" : "") +
      (it.size ? "<dt>Размер</dt><dd>" + esc(it.size) + "</dd>" : "") +
      "<dt>Тип</dt><dd>" + esc(CI.TYPES[it.type] || it.type || "") + "</dd></dl>";
    if (it.requirements && it.requirements.length) {
      html += "<h4>Требования</h4><ul>" + it.requirements.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>";
    }
    if (it.tags && it.tags.length) {
      html += '<div class="tags">' + it.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
    }
    html += "</div></aside></div>";
    app.innerHTML = html;

    var cur = 0;
    app.querySelectorAll(".thumbs button").forEach(function (b) {
      b.onclick = function () {
        cur = +b.dataset.i;
        document.getElementById("shot-img").src = shots[cur].src;
        document.getElementById("shot-cap").textContent = shots[cur].caption || "";
        app.querySelectorAll(".thumbs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      };
    });
    var main = document.getElementById("shot-main");
    if (main) main.onclick = function () { openLightbox(shots[cur].src); };
    document.getElementById("share-btn").onclick = function () { CI.share(it); };
    CI.paintStats(app);
    CI.drawQr(app);
  };

  // Одна кнопка «Скачать» или несколько (it.downloads: [{label, file|link, size}]).
  // Для нескольких — подсвечиваем вариант под систему пользователя.
  function dlButtons(it) {
    if (!it.downloads || !it.downloads.length) {
      var href = it.file || it.link || "#";
      return '<a class="btn" href="' + esc(href) + '"' + linkAttr(it.file) + ' data-dl="' + esc(it.id) + '" data-dl-label="Скачать">⬇ Скачать' +
        (it.size ? " · " + esc(it.size) : "") + "</a>";
    }
    var list = it.downloads.slice(), rec = CI.recommendIndex(list);
    if (rec > 0) list.unshift(list.splice(rec, 1)[0]);
    return '<div class="dl-list">' + list.map(function (d, i) {
      return '<a class="btn' + (i === 0 ? "" : " btn2") + '" href="' + esc(d.file || d.link || "#") + '"' + linkAttr(d.file) +
        ' data-dl="' + esc(it.id) + '" data-dl-label="' + esc(d.label) + '">' + esc(d.label) + (d.size ? "<small> · " + esc(d.size) + "</small>" : "") + "</a>" +
        (rec >= 0 && i === 0 ? '<div class="rec">✓ Рекомендуем для вашего устройства</div>' : "");
    }).join("") + "</div>";
  }
  function linkAttr(isFile) { return isFile ? " download" : ' target="_blank" rel="noopener"'; }

  function openLightbox(src) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<img src="' + esc(src) + '" alt="">';
    function close() { lb.remove(); document.removeEventListener("keydown", onKey, true); }
    function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    lb.onclick = close;
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(lb);
  }
})();
