// Мессенджер внутри сайта: одна общая рамка (iframe) для плавающей панели и страницы #/messenger.
// iframe создаётся при первом открытии и дальше не уничтожается — сессия и звонок не теряются.
(function () {
  var CI = window.CI;
  var MOBILE = 760;
  var ALLOW = "camera; microphone; autoplay; clipboard-read; clipboard-write; display-capture; fullscreen";
  var ICON_CHAT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_EXPAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>';

  var host = document.createElement("div");
  host.className = "msgr";
  host.id = "msgr";
  host.setAttribute("role", "dialog");
  host.setAttribute("aria-label", "Мессенджер");
  host.setAttribute("aria-hidden", "true");
  host.innerHTML =
    '<div class="msgr-bar"><b>Мессенджер</b><span class="sp"></span>' +
    '<button type="button" class="msgr-btn" data-act="expand" title="Развернуть" aria-label="Развернуть">' + ICON_EXPAND + "</button>" +
    '<button type="button" class="msgr-btn" data-act="close" title="Закрыть" aria-label="Закрыть">' + ICON_X + "</button></div>" +
    '<div class="msgr-body"></div>';
  document.body.appendChild(host);
  var body = host.querySelector(".msgr-body");

  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "fab";
  fab.id = "chat-fab";
  fab.setAttribute("aria-label", "Открыть мессенджер");
  fab.setAttribute("aria-controls", "msgr");
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = '<span class="fab-i chat">' + ICON_CHAT + '</span><span class="fab-i x">' + ICON_X + '</span><b class="nbadge" data-unread hidden></b>';
  document.body.appendChild(fab);

  var frame = null, isOpen = false, isPage = false;

  function ensureFrame() {
    if (frame) return frame;
    frame = document.createElement("iframe");
    frame.src = "messenger/";
    frame.title = "CISOFT Messenger";
    frame.setAttribute("allow", ALLOW);
    frame.setAttribute("allowfullscreen", "");
    body.appendChild(frame);
    return frame;
  }

  function sync() {
    host.classList.toggle("open", isOpen && !isPage);
    host.classList.toggle("full", isPage);
    host.setAttribute("aria-hidden", isOpen || isPage ? "false" : "true");
    fab.classList.toggle("is-open", isOpen && !isPage);
    fab.setAttribute("aria-expanded", isOpen && !isPage ? "true" : "false");
    fab.setAttribute("aria-label", isOpen ? "Закрыть мессенджер" : "Открыть мессенджер");
    document.body.classList.toggle("msgr-open", isOpen && !isPage);
  }

  function open() {
    if (window.innerWidth < MOBILE) { location.hash = "#/messenger"; return; }
    ensureFrame();
    isOpen = true;
    sync();
    setTimeout(function () { try { frame.focus(); } catch (e) {} }, 50);
  }
  function close() { if (!isOpen) return; isOpen = false; sync(); fab.focus(); }

  fab.onclick = function () { isOpen ? close() : open(); };
  host.querySelector('[data-act="close"]').onclick = close;
  host.querySelector('[data-act="expand"]').onclick = function () { location.hash = "#/messenger"; };

  // Вызывается роутером: true — открыт маршрут #/messenger
  function setPage(on) {
    isPage = on;
    if (on) { ensureFrame(); isOpen = false; }
    sync();
  }

  // ── непрочитанные и уведомления из iframe ──
  var lastCount = -1, lastNotifyAt = 0;
  function visible() { return isPage || isOpen; }
  function setBadges(n) {
    var txt = n > 99 ? "99+" : String(n);
    document.querySelectorAll("[data-unread]").forEach(function (b) {
      b.textContent = txt;
      b.hidden = !(n > 0);
    });
    fab.setAttribute("title", n > 0 ? "Мессенджер — непрочитанных: " + n : "Мессенджер");
  }
  function showToast(text, ms) {
    if (visible()) return;
    lastNotifyAt = Date.now();
    CI.toast(text, { action: "Открыть", onAction: open, timeout: ms || 6000 });
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin) return;
    if (!frame || e.source !== frame.contentWindow) return;
    var d = e.data;
    if (!d || d.source !== "cisoft-messenger") return;
    if (d.type === "unread") {
      var n = Math.max(0, parseInt(d.count, 10) || 0);
      var grew = lastCount >= 0 && n > lastCount;
      lastCount = n;
      setBadges(n);
      // в iframe «notify» приходит только при скрытой вкладке — поэтому показываем общий тост сами
      if (grew) setTimeout(function () { if (Date.now() - lastNotifyAt > 1500) showToast("Новое сообщение в мессенджере"); }, 400);
    } else if (d.type === "notify") {
      showToast("Новое сообщение от " + String(d.title || "собеседника").slice(0, 60));
    } else if (d.type === "call") {
      showToast((d.title || "Входящий звонок") + (d.body ? ": " + String(d.body).slice(0, 60) : ""), 20000);
    }
  });

  CI.msgr = {
    open: open,
    close: close,
    setPage: setPage,
    isOpen: function () { return isOpen && !isPage; },
    unread: function () { return Math.max(0, lastCount); }
  };
})();
