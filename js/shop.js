// Магазин Pro-программ: блок «Купить» на странице программы, оплата PayPal, выдача ключа.
// Публикация платная, если в items.js есть поля product (id лицензии) и price.
// Сервер: /api/shop-config, /api/shop-create, /api/shop-capture, /api/shop-recover (папка api/).
(function () {
  var CI = window.CI, esc = CI.esc;
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
        "&currency=" + c.currency + "&intent=capture&locale=ru_RU&components=buttons";
      s.onload = function () { ok(window.paypal); };
      s.onerror = function () { sdkPromise = null; fail(new Error("PayPal не загрузился")); };
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  function post(url, body) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Ошибка " + r.status); return d; }); });
  }

  // HTML блока покупки (вставляется в правую колонку страницы программы)
  CI.shopBlock = function (it) {
    if (!it.product || !it.price) return "";
    var perks = (it.pro || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    return '<div class="shop" id="shop" data-product="' + esc(it.product) + '">' +
      '<div class="shop-head"><span class="pro-badge">PRO</span><span class="shop-price">$' + esc(it.price) + '</span>' +
      '<small>разовая покупка · навсегда</small></div>' +
      (perks ? '<ul class="shop-perks">' + perks + "</ul>" : "") +
      '<div id="shop-buttons" class="shop-buttons"><div class="shop-wait">Загружаю оплату…</div></div>' +
      '<p class="shop-note">Оплата картой или через PayPal. Ключ появится сразу после оплаты' +
      (CI.acc && CI.acc.user ? " и сохранится в вашем кабинете" : " — войдите в аккаунт, чтобы он сохранился в кабинете") + ".</p>" +
      '<details class="shop-recover"><summary>Потеряли ключ?</summary>' +
      '<form id="shop-recover-form"><input name="order" placeholder="Номер заказа из письма PayPal" required>' +
      '<input name="email" type="email" placeholder="Email, с которого платили" required>' +
      '<button class="btn btn2" type="submit">Восстановить ключ</button></form></details></div>';
  };

  // Подключение кнопок PayPal после отрисовки страницы
  CI.shopMount = function (it) {
    var box = document.getElementById("shop");
    if (!box) return;
    var btns = document.getElementById("shop-buttons");
    getConfig().then(function (c) {
      if (!c || !c.ready) { btns.innerHTML = '<div class="shop-wait">Продажи скоро откроются. Пока можно скачать бесплатную версию.</div>'; return; }
      return loadSdk(c).then(function (paypal) {
        if (!document.body.contains(btns)) return;
        btns.innerHTML = "";
        if (c.env !== "live") btns.insertAdjacentHTML("beforebegin", '<div class="shop-test">Тестовый режим: настоящие деньги не списываются</div>');
        paypal.Buttons({
          style: { layout: "vertical", color: "blue", shape: "rect", label: "buynow", height: 44 },
          createOrder: function () { return post("/api/shop-create", { product: it.product }).then(function (d) { return d.id; }); },
          onApprove: function (data) {
            btns.style.opacity = ".5";
            return post("/api/shop-capture", { orderId: data.orderID }).then(function (res) {
              btns.style.opacity = "";
              done(res);
            }, function (e) { btns.style.opacity = ""; CI.toast(e.message); });
          },
          onError: function () { CI.toast("Оплата не прошла. Попробуйте ещё раз или другой картой."); },
        }).render(btns);
      });
    }).catch(function () { btns.innerHTML = '<div class="shop-wait">Не удалось загрузить оплату. Обновите страницу.</div>'; });

    document.getElementById("shop-recover-form").onsubmit = function (e) {
      e.preventDefault();
      var f = e.target;
      post("/api/shop-recover", { orderId: f.order.value, email: f.email.value }).then(done, function (err) { CI.toast(err.message); });
    };
  };

  // Ключ получен: сохранить в аккаунте и показать окно
  function done(res) {
    if (CI.acc && CI.acc.savePurchase) CI.acc.savePurchase(res);
    var it = CI.byId(res.product) || CI.ITEMS.filter(function (x) { return x.product === res.product; })[0] || { name: res.name };
    var m = document.createElement("div");
    m.className = "shop-modal";
    m.innerHTML = '<div class="shop-dialog" role="dialog" aria-label="Ключ лицензии">' +
      '<h2>Спасибо за покупку! 🎉</h2><p><b>' + esc(res.name) + "</b> — лицензия для " + esc(res.email || "вас") + ".</p>" +
      '<label>Ваш ключ:</label><textarea readonly rows="4">' + esc(res.license) + "</textarea>" +
      '<div class="shop-row"><button class="btn" data-copy>Скопировать ключ</button>' +
      (it && it.file ? '<a class="btn btn2" href="' + esc(it.file) + '" download>Скачать программу</a>' : "") + "</div>" +
      "<ol><li>Установите и откройте программу.</li><li>Нажмите «Ввести ключ» и вставьте ключ.</li><li>Готово — Pro открыт навсегда.</li></ol>" +
      '<p class="shop-note">Заказ ' + esc(res.order) + ". Ключ можно восстановить по номеру заказа и email" +
      (CI.acc && CI.acc.user ? ", а ещё он сохранён в «Личном кабинете»." : ".") + "</p>" +
      '<button class="shop-close" aria-label="Закрыть">×</button></div>';
    document.body.appendChild(m);
    m.querySelector("[data-copy]").onclick = function () {
      navigator.clipboard.writeText(res.license).then(function () { CI.toast("Ключ скопирован"); });
    };
    m.querySelector(".shop-close").onclick = function () { m.remove(); };
    m.onclick = function (e) { if (e.target === m) m.remove(); };
  }

  CI.shopConfig = getConfig;
})();
