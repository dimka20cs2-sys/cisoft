// Главная: Pro, «Почему AkeeTech», последние обновления, короткий FAQ и финальный призыв.
(function () {
  var CI = window.CI, esc = CI.esc, T = CI.t, H = CI.home;
  var B = CI.homeBlocks = CI.homeBlocks || {};

  B.pro = function () {
    var prices = CI.ITEMS.filter(function (it) { return it.product && it.price; }).map(function (it) { return parseFloat(it.price); });
    var min = prices.length ? Math.min.apply(null, prices) : 0;
    var steps = [
      ["1", T("Бесплатно навсегда"), T("Скачайте любую программу — бесплатная версия не ограничена по времени и без рекламы.")],
      ["2", T("Pro — если захочется"), min ? T("Нужны расширенные возможности? Разовая покупка от {price}, без подписки.", { price: "$" + min.toFixed(2) }) : T("Нужны расширенные возможности? Разовая покупка, без подписки.")],
      ["3", T("Оплата PayPal или картой"), T("Покупка — на странице программы, прямо на сайте.")],
      ["4", T("Ключ сразу"), T("Ключ появится сразу после оплаты, а если вы вошли — сохранится в личном кабинете.")]
    ];
    return '<section class="h-sec h-pro">' + H.head(T("Pro — по желанию"), T("Все программы работают бесплатно. Pro открывает больше возможностей тем, кому они нужны."), "#/catalog?type=pro", T("Pro-программы")) +
      '<ol class="h-steps">' + steps.map(function (s) {
        return '<li><span class="h-step">' + s[0] + "</span><b>" + s[1] + "</b><p>" + s[2] + "</p></li>";
      }).join("") + "</ol>" +
      '<p class="h-donate">' + T("Нравятся программы?") + ' <a class="btn btn-donate" href="https://send.monobank.ua/jar/9qj3AaxzT8" target="_blank" rel="noopener">' + T("♥ Поддержать проект") + '</a> — ' + T("любая сумма через Monobank.") + '</p></section>';
  };

  B.why = function () {
    var list = [
      ["🚫", T("Без рекламы"), T("Ни баннеров, ни «полезных» допустановок.")],
      ["🔒", T("Без сбора данных"), T("Программы не отправляют ничего лишнего — сайт считает только общее число скачиваний.")],
      ["⚡", T("Маленькие и быстрые"), T("Установщики весят сотни килобайт, а не сотни мегабайт.")],
      ["📖", T("На русском"), T("Интерфейс, подсказки и справка — по-русски.")],
      ["🔄", T("Обновления"), T("Программы регулярно получают новые возможности — всё видно в новостях.")]
    ];
    return '<section class="h-sec">' + H.head(T("Почему {name}", { name: esc(CI.SITE.name || "AkeeTech") })) + '<div class="h-why">' +
      list.map(function (w) { return '<div><span class="h-why-i" aria-hidden="true">' + w[0] + "</span><b>" + w[1] + "</b><p>" + w[2] + "</p></div>"; }).join("") +
      "</div></section>";
  };

  B.updates = function () {
    var rows = [];
    CI.ITEMS.forEach(function (it, idx) { (it.changelog || []).forEach(function (c) { rows.push({ it: it, c: c, idx: idx }); }); });
    rows.sort(function (a, b) { return String(b.c.date || "").localeCompare(String(a.c.date || "")) || b.idx - a.idx; });
    if (!rows.length) return "";
    return '<section class="h-sec">' + H.head(T("Последние обновления"), "", "#/news", T("Все новости")) + '<div class="h-upd">' +
      rows.slice(0, 5).map(function (r) {
        var ch = r.c.changes || [];
        return '<a class="h-upd-row" href="#/item/' + encodeURIComponent(r.it.id) + '">' + CI.icon(r.it) +
          '<span class="h-upd-body"><b>' + esc(r.it.name) + ' <em>v' + esc(r.c.version) + "</em></b><small>" + (r.c.first ? T("Новая программа:") + " " + esc(r.it.short) : esc(ch[0] || "")) + (ch.length > 1 ? " " + T("и ещё {n}", { n: ch.length - 1 }) : "") + "</small></span>" +
          '<time datetime="' + esc(r.c.date) + '">' + CI.date(r.c.date) + "</time></a>";
      }).join("") + "</div></section>";
  };

  B.faq = function () {
    var qa = [
      [T("Это правда бесплатно?"), T("Да. Бесплатные версии работают без ограничений по времени и без рекламы. Pro — разовая покупка для тех, кому нужны дополнительные функции.")],
      [T("Windows пишет «Windows защитила ваш компьютер». Что делать?"), T("Программы не подписаны платным сертификатом, поэтому SmartScreen предупреждает. Нажмите «Подробнее» → «Выполнить в любом случае».")],
      [T("Нужна ли регистрация?"), T("Чтобы скачивать — нет. Аккаунт нужен для мессенджера, лайков, избранного и хранения Pro-ключей.")],
      [T("Как обновить программу?"), T("Скачайте новую версию и установите поверх старой — настройки сохранятся.")]
    ];
    return '<section class="h-sec h-faq">' + H.head(T("Частые вопросы"), "", "#/faq", T("Все вопросы")) + '<div class="faq">' +
      qa.map(function (q) {
        return '<details class="qa"><summary>' + esc(q[0]) + '<span class="chev" aria-hidden="true"></span></summary><div class="qa-body"><p>' + esc(q[1]) + "</p></div></details>";
      }).join("") + "</div></section>";
  };

  B.cta = function () {
    return '<section class="h-final"><div class="h-bg" aria-hidden="true"></div><h2>' + T("Начните с бесплатной версии") + '</h2>' +
      "<p>" + T("{n} {w} для Windows, Android и Minecraft — выбирайте нужное.", { n: CI.ITEMS.length, w: CI.plural(CI.ITEMS.length, "программа", "программы", "программ") }) + "</p>" +
      '<div class="h-cta"><a class="h-btn" href="#/catalog">' + T("Открыть каталог") + '</a><a class="h-btn h-btn2" href="#/messenger">' + T("Мессенджер") + '</a></div></section>';
  };
})();
