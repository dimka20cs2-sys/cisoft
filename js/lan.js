// #/lan/<netId> — приглашение в сеть SquadLAN: открыть программу по ссылке cisoft-lan://join/<id> или скачать её.
(function () {
  var CI = window.CI, esc = CI.esc, T = CI.t;

  CI.renderLanInvite = function (id) {
    document.title = T("Приглашение в сеть") + " — " + (CI.SITE.name || "");
    var ok = /^[a-z0-9]{10}$/.test(id || "");
    var app = CI.byId ? CI.byId("cisoft-lan") : null;
    var dl = app && app.file ? app.file : "downloads/CisoftLAN-Setup.exe";
    CI.app.innerHTML =
      '<section class="lan-invite">' +
      (app ? '<img class="lan-icon" src="' + esc(app.icon) + '" alt="">' : "") +
      "<h1>" + T("Вас пригласили в сеть SquadLAN") + "</h1>" +
      (ok ? '<p class="lan-id">' + T("ID сети:") + ' <b>' + esc(id) + '</b> <button class="btn btn2 lan-copy" type="button">' + T("Скопировать") + '</button></p>' +
            "<p>" + T("Пароль сети вам должен сообщить друг — его нет в ссылке.") + "</p>" +
            '<div class="lan-actions"><a class="btn" href="cisoft-lan://join/' + esc(id) + '">' + T("Открыть в SquadLAN") + '</a>' +
            '<a class="btn btn2" href="' + esc(dl) + '" download>' + T("Скачать SquadLAN") + '</a></div>'
          : "<p>" + T("Ссылка повреждена — попросите друга прислать её ещё раз.") + "</p>") +
      '<ol class="lan-steps"><li>' + T("Скачайте и установите SquadLAN (если ещё нет).") + "</li>" +
      "<li>" + T("Войдите тем же аккаунтом, что на этом сайте.") + "</li>" +
      "<li>" + T("Нажмите «Открыть в SquadLAN» выше или «Войти в сеть» в программе и введите ID и пароль.") + "</li>" +
      "<li>" + T("Готово: друзья видны в списке, а миры Minecraft, открытые «Для сети», появятся в «Сетевой игре» сами.") + "</li></ol>" +
      (app ? '<p><a href="#/item/cisoft-lan">' + T("Подробнее о программе") + " →</a></p>" : "") +
      "</section>";
    var b = CI.app.querySelector(".lan-copy");
    if (b) b.onclick = function () {
      navigator.clipboard.writeText(id).then(function () { CI.toast(T("ID сети скопирован")); });
    };
  };
})();
