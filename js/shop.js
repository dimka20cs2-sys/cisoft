// Магазин Pro-программ: блок «Купить» на странице программы, оплата PayPal, выдача ключа.
// Публикация платная, если в items.js есть поля product (id лицензии) и price.
// Сервер: /api/shop-config, /api/shop-create, /api/shop-capture, /api/shop-recover (папка api/).
(function () {
  var CI = window.CI, esc = CI.esc;
  // перевод (js/i18n.js); без него — русский текст с подстановкой {переменных}
  var T = CI.t || function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && k in v ? v[k] : m; }); };
  var PP_LOCALE = { ru: "ru_RU", uk: "uk_UA", en: "en_US" };
  var cfg = null, cfgPromise = null, sdkPromise = null;

  function getConfig() {
    if (!cfgPromise) cfgPromise = fetch("/api/shop-config").then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; }).then(function (c) { cfg = c; return c; });
    return cfgPromise;
  }

  function loadSdk(c) {
    if (!sdkPromise) sdkPromise = new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(c.clientId) +
        "&currency=" + c.currency + "&intent=capture&locale=" + (PP_LOCALE[CI.lang] || "ru_RU") + "&components=buttons";
      s.onload = function () { ok(window.paypal); };
      s.onerror = function () { sdkPromise = null; fail(new Error(T("PayPal не загрузился"))); };
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  function post(url, body) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error ? T(d.error) : T("Ошибка") + " " + r.status); return d; }); });
  }

  // HTML блока покупки (вставляется в правую колонку страницы программы)
  CI.shopBlock = function (it) {
    if (!it.product || !it.price) return "";
    var perks = (it.pro || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    return '<div class="shop" id="shop" data-product="' + esc(it.product) + '">' +
      '<div class="shop-head"><span class="pro-badge">PRO</span><span class="shop-price">$' + esc(it.price) + '</span>' +
      '<small>' + T("разовая покупка · навсегда") + '</small></div>' +
      (perks ? '<ul class="shop-perks">' + perks + "</ul>" : "") +
      // Покупка — через личные сообщения автору в Pingo (оплата договорная, ключ присылает автор)
      '<div class="shop-buttons shop-contact">' +
        '<p class="shop-how">' + T("Чтобы купить, напишите автору в мессенджер Pingo:") + '</p>' +
        '<div class="shop-user"><b>' + SELLER + '</b>' +
          '<button type="button" class="btn btn2 sm" data-shop-copy>' + T("Скопировать") + '</button></div>' +
        '<button type="button" class="btn" data-shop-msg>💬 ' + T("Написать в Pingo") + '</button>' +
      '</div>' +
      '<p class="shop-note">' + T("Укажите программу ({name}) и уровень — Pro или Ultra. После оплаты автор пришлёт ключ лицензии, его нужно вставить в программе.", { name: esc(it.name) }) + '</p>' +
      '<p class="shop-note"><a href="https://send.monobank.ua/jar/9qj3AaxzT8" target="_blank" rel="noopener">♥ ' + T("Поддержать проект донатом") + '</a> — ' + T("без покупки, любая сумма.") + '</p>' +
      '</div>';
  };

  var SELLER = "@akee_t";

  function copySeller() {
    var done = function () { CI.toast(T("Скопировано: {u}", { u: SELLER })); };
    if (navigator.clipboard) navigator.clipboard.writeText(SELLER).then(done, done); else done();
  }

  // Подключение кнопок PayPal после отрисовки страницы
  CI.shopMount = function (it) {
    var box = document.getElementById("shop");
    if (!box) return;
    box.querySelector("[data-shop-copy]").onclick = copySeller;
    // Открыть Pingo и сразу скопировать ник — останется вставить его в поиск
    box.querySelector("[data-shop-msg]").onclick = function () {
      copySeller();
      location.hash = "#/messenger";
      setTimeout(function () { CI.toast(T("Найдите {u} через поиск в Pingo — ник уже скопирован", { u: SELLER })); }, 400);
    };
  };

  // Ключ получен: сохранить в аккаунте и показать окно
  function done(res) {
    if (CI.acc && CI.acc.savePurchase) CI.acc.savePurchase(res);
    var it = CI.byId(res.product) || CI.ITEMS.filter(function (x) { return x.product === res.product; })[0] || { name: res.name };
    var m = document.createElement("div");
    m.className = "shop-modal";
    m.innerHTML = '<div class="shop-dialog" role="dialog" aria-label="' + T("Ключ лицензии") + '">' +
      '<h2>' + T("Спасибо за покупку!") + ' 🎉</h2><p><b>' + esc(res.name) + "</b> — " + T("лицензия для {who}.", { who: esc(res.email || T("вас")) }) + "</p>" +
      '<label>' + T("Ваш ключ:") + '</label><textarea readonly rows="4">' + esc(res.license) + "</textarea>" +
      '<div class="shop-row"><button class="btn" data-copy>' + T("Скопировать ключ") + '</button>' +
      (it && it.file ? '<a class="btn btn2" href="' + esc(it.file) + '" download>' + T("Скачать программу") + '</a>' : "") + "</div>" +
      "<ol><li>" + T("Установите и откройте программу.") + "</li><li>" + T("Нажмите «Ввести ключ» (в Android-приложении — значок FREE в шапке) и вставьте ключ.") + "</li><li>" + T("Готово — Pro открыт навсегда.") + "</li></ol>" +
      '<p class="shop-note">' + T("Заказ") + ' ' + esc(res.order) + ". " + (CI.acc && CI.acc.user ? T("Ключ можно восстановить по номеру заказа и email, а ещё он сохранён в «Личном кабинете».")
        : T("Ключ можно восстановить по номеру заказа и email.")) + "</p>" +
      '<button class="shop-close" aria-label="' + T("Закрыть") + '">×</button></div>';
    document.body.appendChild(m);
    m.querySelector("[data-copy]").onclick = function () {
      navigator.clipboard.writeText(res.license).then(function () { CI.toast(T("Ключ скопирован")); });
    };
    m.querySelector(".shop-close").onclick = function () { m.remove(); };
    m.onclick = function (e) { if (e.target === m) m.remove(); };
  }

  CI.shopConfig = getConfig;
})();
