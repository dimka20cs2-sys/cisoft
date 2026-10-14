// Страница программы: подсказка по ОС, QR-код для APK, «Поделиться».
(function () {
  var CI = window.CI, esc = CI.esc;

  // Какой вариант загрузки подходит системе пользователя (-1 — не знаем)
  CI.recommendIndex = function (list) {
    function find(fn) { for (var i = 0; i < list.length; i++) if (fn(list[i])) return i; return -1; }
    function ext(d, e) { return !!d.file && new RegExp("\\." + e + "$", "i").test(d.file); }
    if (CI.os === "android") return find(function (d) { return ext(d, "apk"); });
    if (CI.os === "windows") return find(function (d) { return ext(d, "exe") || ext(d, "msi"); });
    return find(function (d) { return !d.file && !!d.link; }); // «Открыть в браузере»
  };

  function apkOf(it) {
    var files = [it.file].concat((it.downloads || []).map(function (d) { return d.file; }));
    return files.filter(function (f) { return f && /\.apk$/i.test(f); })[0] || null;
  }

  // ── QR-код (библиотека qrcode-generator 1.4.4 с cdnjs, грузится только когда нужна) ──
  CI.qrBlock = function (it) {
    var apk = apkOf(it);
    if (!apk || CI.os === "android") return ""; // на самом телефоне QR не нужен
    var url = CI.SITE_URL + apk.replace(/^\.?\//, "");
    return '<div class="qr" data-qr="' + esc(url) + '">' +
      '<div class="qr-code" aria-hidden="true"></div>' +
      '<div class="qr-text"><b>Скачать на телефон</b><span>Наведите камеру телефона на код</span></div></div>';
  };

  var qrLib = null;
  function loadQr() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (qrLib) return qrLib;
    qrLib = new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
      s.integrity = "sha384-mZT2gIty7ZDdOGkxfP6joZcYdMW1Jvj9dRlfpTmaJAKKXTqzygtB22k7FLe+KZC1";
      s.crossOrigin = "anonymous";
      s.onload = function () { window.qrcode ? ok(window.qrcode) : fail(new Error("qrcode")); };
      s.onerror = function () { qrLib = null; fail(new Error("qrcode")); };
      document.head.appendChild(s);
    });
    return qrLib;
  }

  CI.drawQr = function (root) {
    var box = root.querySelector("[data-qr]");
    if (!box) return;
    loadQr().then(function (qrcode) {
      var qr = qrcode(0, "M");
      qr.addData(box.getAttribute("data-qr"));
      qr.make();
      box.querySelector(".qr-code").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      box.classList.add("ready");
    }).catch(function () { box.remove(); }); // нет сети до CDN — просто без QR
  };

  // ── «Поделиться» ──
  CI.share = function (it) {
    var url = location.origin + location.pathname + "#/item/" + encodeURIComponent(it.id);
    var data = { title: it.name, text: it.short || it.name, url: url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      navigator.share(data).catch(function (e) { if (!e || e.name !== "AbortError") copy(url); });
    } else copy(url);
  };

  function copy(text) {
    function done() { CI.toast("Ссылка скопирована"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { legacy(text) ? done() : CI.toast("Не удалось скопировать: " + text, { timeout: 8000 }); });
    } else if (legacy(text)) done();
    else CI.toast("Ссылка: " + text, { timeout: 8000 });
  }
  function legacy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  }
})();
