// Маршрутизация по хэшу: #/ — главная, #/catalog[?type=…&q=…], #/item/<id>, #/news, #/faq, #/messenger, #/account.
(function () {
  var CI = window.CI, prev = null;

  function route() {
    var h = location.hash || "#/";
    // Старые закладки каталога: #/?type=media → #/catalog?type=media
    if (/^#\/?\?/.test(h)) { location.replace("#/catalog" + h.slice(h.indexOf("?"))); return; }
    var m = h.match(/^#\/item\/(.+)$/);
    var gm = h.match(/^#\/games(?:\/([\w-]+))?$/);
    var lm = h.match(/^#\/lan\/([\w-]*)$/);
    var cm = h.match(/^#\/catalog\/?(?:\?(.*))?$/);
    var name = m ? "item" : cm ? "catalog" : gm ? "games" : lm ? "lan" : h === "#/news" ? "news" : h === "#/faq" ? "faq" : h === "#/messenger" ? "messenger" : h === "#/account" ? "account" : "home";
    var isMsgr = name === "messenger";

    document.body.classList.toggle("is-msgr", isMsgr);
    document.body.setAttribute("data-route", name);
    CI.setActiveNav(name === "item" ? "catalog" : name);
    CI.msgr.setPage(isMsgr);

    if (isMsgr) {
      document.title = "Мессенджер — " + (CI.SITE.name || "");
      CI.app.innerHTML = '<h1 class="sr-only">Мессенджер</h1>';
    } else if (name === "item") {
      var id;
      try { id = decodeURIComponent(m[1]); } catch (e) { id = m[1]; }
      CI.renderItem(id);
    } else if (name === "catalog") {
      CI.renderCatalog(cm[1] || "");
    } else if (name === "lan") {
      CI.renderLanInvite(lm[1]);
    } else if (name === "games") {
      if (gm[1]) CI.renderGame(gm[1]); else CI.renderGames();
    } else if (name === "news") CI.renderNews();
    else if (name === "faq") CI.renderFaq();
    else if (name === "account") {
      // модуль кабинета (js/account.js) грузится отложенно — он сам дорисует страницу
      if (CI.renderAccount) CI.renderAccount();
      else { document.title = "Личный кабинет — " + (CI.SITE.name || ""); CI.app.innerHTML = '<div class="empty">Загрузка…</div>'; }
    }
    else CI.renderHome();

    // Новая страница — наверх; фокус на содержимое (для читалок экрана)
    window.scrollTo(0, 0);
    if (prev !== null && !isMsgr) {
      try { CI.app.focus({ preventScroll: true }); } catch (e) {}
    }
    if (CI.focusSearchAfterRoute) {
      CI.focusSearchAfterRoute = false;
      var s = document.getElementById("search");
      if (s) s.focus();
    }
    prev = name;
  }

  window.addEventListener("hashchange", route);
  route();
})();
