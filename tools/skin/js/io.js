/* Skin Studio — загрузка (файл, перетаскивание, ник), скачивание, черновик */
(function () {
  'use strict';
  var SS = window.SS;
  var DRAFT = 'cisoft-skin-draft';

  function loadImg(src, cors) {
    return new Promise(function (res, rej) {
      var img = new Image();
      if (cors) img.crossOrigin = 'anonymous';
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('Не удалось загрузить изображение')); };
      img.src = src;
    });
  }

  var io = SS.io = {
    skin: null,
    applyImage: function (img, label) {
      var r = io.skin.loadImage(img, true);
      SS.toast((label || 'Скин загружен') + (r === 'legacy' ? ' (старый формат 64×32 — сконвертирован)' : '') +
        ' · модель: ' + (io.skin.slim ? 'Alex (тонкие руки)' : 'Steve (классика)'));
    },
    loadFile: function (file) {
      if (!file) return Promise.resolve();
      if (!/^image\/png$/.test(file.type) && !/\.png$/i.test(file.name)) { SS.toast('Нужен файл PNG', true); return Promise.resolve(); }
      var url = URL.createObjectURL(file);
      return loadImg(url, false).then(function (img) {
        io.applyImage(img, 'Файл «' + file.name + '» загружен');
      }).catch(function (e) { SS.toast(e.message, true); }).then(function () { URL.revokeObjectURL(url); });
    },
    loadNick: function (nick) {
      nick = String(nick || '').trim();
      if (!/^[A-Za-z0-9_]{2,16}$/.test(nick)) { SS.toast('Ник: 2–16 символов, латиница, цифры и _', true); return Promise.resolve(false); }
      var srcs = ['https://mc-heads.net/skin/' + encodeURIComponent(nick), 'https://minotar.net/skin/' + encodeURIComponent(nick)];
      SS.toast('Загружаю скин игрока ' + nick + '…');
      function attempt(i) {
        if (i >= srcs.length) return Promise.reject(new Error('Скин игрока «' + nick + '» не найден или сервис недоступен'));
        return loadImg(srcs[i], true).then(function (img) {
          io.applyImage(img, 'Скин игрока ' + nick + ' загружен');
          return true;
        }).catch(function () { return attempt(i + 1); });
      }
      return attempt(0).catch(function (e) { SS.toast(e.message, true); return false; });
    },
    dataURL: function () { return io.skin.canvas.toDataURL('image/png'); },
    saveAs: function (url, name) {
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
    },
    download: function () {
      io.saveAs(io.dataURL(), 'skin' + (io.skin.slim ? '-alex' : '') + '.png');
      SS.toast('PNG 64×64 сохранён');
    },
    saveDraft: function () {
      try {
        localStorage.setItem(DRAFT, JSON.stringify({ png: io.dataURL(), slim: io.skin.slim, t: Date.now() }));
      } catch (e) { /* хранилище недоступно */ }
    },
    loadDraft: function () {
      var d = null;
      try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) { d = null; }
      if (!d || !d.png) return Promise.resolve(false);
      return loadImg(d.png, false).then(function (img) {
        io.skin.loadImage(img, false);
        if (io.skin.slim !== !!d.slim) io.skin.setSlim(!!d.slim, false);
        return true;
      }).catch(function () { return false; });
    },
    init: function (skin) {
      io.skin = skin;
      var timer = 0;
      SS.on('skin', function () {
        clearTimeout(timer);
        timer = setTimeout(io.saveDraft, 700);
      });
      var depth = 0, body = document.body;
      document.addEventListener('dragenter', function (e) {
        if (!e.dataTransfer || Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') < 0) return;
        e.preventDefault(); depth++; body.classList.add('dragging');
      });
      document.addEventListener('dragover', function (e) { e.preventDefault(); });
      document.addEventListener('dragleave', function () { if (--depth <= 0) { depth = 0; body.classList.remove('dragging'); } });
      document.addEventListener('drop', function (e) {
        e.preventDefault(); depth = 0; body.classList.remove('dragging');
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) io.loadFile(f);
      });
    }
  };
})();
