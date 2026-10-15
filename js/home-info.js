// Главная: Pro, «Почему CISOFT», последние обновления, короткий FAQ и финальный призыв.
(function () {
  var CI = window.CI, esc = CI.esc, H = CI.home;
  var B = CI.homeBlocks = CI.homeBlocks || {};

  B.pro = function () {
    var prices = CI.ITEMS.filter(function (it) { return it.product && it.price; }).map(function (it) { return parseFloat(it.price); });
    var min = prices.length ? Math.min.apply(null, prices) : 0;
    var steps = [
      ["1", "Бесплатно навсегда", "Скачайте любую программу — бесплатная версия не ограничена по времени и без рекламы."],
      ["2", "Pro — если захочется", "Нужны расширенные возможности? Разовая покупка" + (min ? " от $" + min.toFixed(2) : "") + ", без подписки."],
      ["3", "Оплата PayPal или картой", "Покупка — на странице программы, прямо на сайте."],
      ["4", "Ключ сразу", "Ключ появится сразу после оплаты, а если вы вошли — сохранится в личном кабинете."]
    ];
    return '<section class="h-sec h-pro">' + H.head("Pro — по желанию", "Все программы работают бесплатно. Pro открывает больше возможностей тем, кому они нужны.", "#/catalog?type=pro", "Pro-программы") +
      '<ol class="h-steps">' + steps.map(function (s) {
        return '<li><span class="h-step">' + s[0] + "</span><b>" + s[1] + "</b><p>" + s[2] + "</p></li>";
      }).join("") + "</ol>" +
      '<p class="h-donate">Нравятся программы? <a class="btn btn-donate" href="https://send.monobank.ua/jar/9qj3AaxzT8" target="_blank" rel="noopener">♥ Поддержать проект</a> — любая сумма через Monobank.</p></section>';
  };

  B.why = function () {
    var list = [
      ["🚫", "Без рекламы", "Ни баннеров, ни «полезных» допустановок."],
      ["🔒", "Без сбора данных", "Программы не отправляют ничего лишнего — сайт считает только общее число скачиваний."],
      ["⚡", "Маленькие и быстрые", "Установщики весят сотни килобайт, а не сотни мегабайт."],
      ["📖", "На русском", "Интерфейс, подсказки и справка — по-русски."],
      ["🔄", "Обновления", "Программы регулярно получают новые возможности — всё видно в новостях."]
    ];
    return '<section class="h-sec">' + H.head("Почему " + esc(CI.SITE.name || "CISOFT")) + '<div class="h-why">' +
      list.map(function (w) { return '<div><span class="h-why-i" aria-hidden="true">' + w[0] + "</span><b>" + w[1] + "</b><p>" + w[2] + "</p></div>"; }).join("") +
      "</div></section>";
  };

  B.updates = function () {
    var rows = [];
    CI.ITEMS.forEach(function (it, idx) { (it.changelog || []).forEach(function (c) { rows.push({ it: it, c: c, idx: idx }); }); });
    rows.sort(function (a, b) { return String(b.c.date || "").localeCompare(String(a.c.date || "")) || b.idx - a.idx; });
    if (!rows.length) return "";
    return '<section class="h-sec">' + H.head("Последние обновления", "", "#/news", "Все новости") + '<div class="h-upd">' +
      rows.slice(0, 5).map(function (r) {
        var ch = r.c.changes || [];
        return '<a class="h-upd-row" href="#/item/' + encodeURIComponent(r.it.id) + '">' + CI.icon(r.it) +
          '<span class="h-upd-body"><b>' + esc(r.it.name) + ' <em>v' + esc(r.c.version) + "</em></b><small>" + (ch.length === 1 && /первый выпуск/i.test(ch[0]) ? "Новая программа: " + esc(r.it.short) : esc(ch[0] || "")) + (ch.length > 1 ? " и ещё " + (ch.length - 1) : "") + "</small></span>" +
          '<time datetime="' + esc(r.c.date) + '">' + CI.date(r.c.date) + "</time></a>";
      }).join("") + "</div></section>";
  };

  B.faq = function () {
    var qa = [
      ["Это правда бесплатно?", "Да. Бесплатные версии работают без ограничений по времени и без рекламы. Pro — разовая покупка для тех, кому нужны дополнительные функции."],
      ["Windows пишет «Windows защитила ваш компьютер». Что делать?", "Программы не подписаны платным сертификатом, поэтому SmartScreen предупреждает. Нажмите «Подробнее» → «Выполнить в любом случае»."],
      ["Нужна ли регистрация?", "Чтобы скачивать — нет. Аккаунт нужен для мессенджера, лайков, избранного и хранения Pro-ключей."],
      ["Как обновить программу?", "Скачайте новую версию и установите поверх старой — настройки сохранятся."]
    ];
    return '<section class="h-sec h-faq">' + H.head("Частые вопросы", "", "#/faq", "Все вопросы") + '<div class="faq">' +
      qa.map(function (q) {
        return '<details class="qa"><summary>' + esc(q[0]) + '<span class="chev" aria-hidden="true"></span></summary><div class="qa-body"><p>' + esc(q[1]) + "</p></div></details>";
      }).join("") + "</div></section>";
  };

  B.cta = function () {
    return '<section class="h-final"><div class="h-bg" aria-hidden="true"></div><h2>Начните с бесплатной версии</h2>' +
      "<p>" + CI.ITEMS.length + " " + CI.plural(CI.ITEMS.length, "программа", "программы", "программ") + " для Windows, Android и Minecraft — выбирайте нужное.</p>" +
      '<div class="h-cta"><a class="h-btn" href="#/catalog">Открыть каталог</a><a class="h-btn h-btn2" href="#/messenger">Мессенджер</a></div></section>';
  };
})();
