// Языки сайта: ru (по умолчанию, исходные тексты), uk, en.
// Выбор: ?lang=xx в адресе → localStorage «ci-lang» → язык браузера (uk*/ru*, иначе en) → ru.
// Строки интерфейса: CI.t("Русский текст", {n: 5}) — ключ = русский текст (как msgid в gettext),
// переводы — js/i18n-dict.js (uk и en). Тексты программ — items.uk.js / items.en.js (id → поля).
// Для не-русского языка словарь и переводы подгружаются синхронно при первой загрузке (document.write
// до core.js — без вспышки русского), а при переключении — динамически, затем текущая страница перерисовывается.
(function () {
  var CI = window.CI = window.CI || {};
  var LANGS = CI.LANGS = ["ru", "uk", "en"];
  var LOCALE = { ru: "ru-RU", uk: "uk-UA", en: "en-US" };
  CI.LANG_NAMES = { ru: "Русский", uk: "Українська", en: "English" };
  CI.I18N = CI.I18N || {};            // словарь: русский ключ → [uk, en] (js/i18n-dict.js)
  window.ITEMS_I18N = window.ITEMS_I18N || {}; // lang → { id → поля } (items.<lang>.js)

  function valid(l) { return LANGS.indexOf(l) >= 0 ? l : null; }
  function fromQuery() {
    var m = /[?&]lang=([a-z]{2})\b/i.exec(location.search || "");
    return m ? valid(m[1].toLowerCase()) : null;
  }
  function fromBrowser() {
    var list = [].concat(navigator.languages || [], navigator.language || navigator.userLanguage || []);
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || "").toLowerCase();
      if (/^uk\b|^ua\b/.test(l)) return "uk";
      if (/^ru\b/.test(l)) return "ru";
    }
    return list.length ? "en" : null;
  }
  function saved() { try { return valid(localStorage.getItem("ci-lang")); } catch (e) { return null; } }
  function store(l) { try { localStorage.setItem("ci-lang", l); } catch (e) {} }

  var q = fromQuery();
  if (q) store(q); // ссылка с ?lang= — явный выбор
  CI.lang = q || saved() || fromBrowser() || "ru";
  CI.locale = function () { return LOCALE[CI.lang] || "ru-RU"; };

  // ── перевод строк интерфейса ──
  var IDX = { uk: 0, en: 1 };
  CI.t = function (s, vars) {
    var r = s == null ? "" : String(s);
    if (CI.lang !== "ru") {
      var e = CI.I18N[r];
      if (e && e[IDX[CI.lang]] != null && e[IDX[CI.lang]] !== "") r = e[IDX[CI.lang]];
    }
    if (vars) r = r.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    return r;
  };
  CI.N_ = function (s) { return s; }; // пометка «строка для перевода» в данных (переводится при показе)

  // Склонения: 1 программа / 2 программы / 5 программ (ru, uk); 1 program / 2 programs (en).
  // Вызов прежний — русскими формами; формы для uk/en берутся из словаря по ключу «one|few|many».
  CI.plural = function (n, one, few, many) {
    var forms = [one, few, many];
    if (CI.lang !== "ru") {
      var tr = CI.t(one + "|" + few + "|" + many);
      if (tr !== one + "|" + few + "|" + many) forms = tr.split("|");
    }
    if (CI.lang === "en") return Math.abs(n) === 1 ? forms[0] : (forms[1] || forms[0]);
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2] || forms[1];
    if (b === 1) return forms[0];
    if (b >= 2 && b <= 4) return forms[1];
    return forms[2] || forms[1];
  };

  // Единицы размера: «638 КБ» → «638 KB» для английского
  CI.size = function (s) {
    s = String(s || "");
    if (CI.lang === "en") {
      s = s.replace(/КБ/g, "KB").replace(/МБ/g, "MB").replace(/ГБ/g, "GB").replace(/после установки/g, "after install");
    } else if (CI.lang === "uk") {
      s = s.replace(/после установки/g, "після встановлення");
    }
    return s;
  };

  // ── загрузка словаря и переводов программ ──
  var loaded = { ru: true };
  function need(l) { return l !== "ru" && !(window.ITEMS_I18N[l] && CI.dictOk); }
  function files(l) { return ["js/i18n-dict.js", "items." + l + ".js"]; }
  if (need(CI.lang)) {
    // Первая загрузка: синхронно, до core.js и отрисовки
    files(CI.lang).forEach(function (f) { document.write('<script src="' + f + '"><\/script>'); });
  }
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = function () { fail(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  CI.ensureLang = function (l) {
    if (l === "ru" || loaded[l] || (window.ITEMS_I18N[l] && CI.dictOk)) { loaded[l] = true; return Promise.resolve(); }
    var list = [];
    if (!CI.dictOk) list.push(loadScript("js/i18n-dict.js"));
    if (!window.ITEMS_I18N[l]) list.push(loadScript("items." + l + ".js"));
    return Promise.all(list).then(function () { loaded[l] = true; });
  };

  // ── применение языка к данным ──
  function copy(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function pick(tr, ru) { return tr != null && tr !== "" ? tr : ru; }
  function arr(v) { return v == null ? v : [].concat(v); } // у части программ notes — строка, а не список
  function list(tr, ru) {
    if (!ru) return ru;
    tr = arr(tr); ru = arr(ru);
    return ru.map(function (x, i) { return pick(tr && tr[i], CI.t(x)); }); // null в переводе → общая строка из словаря (или русский)
  }
  // Поля программы: short, description[], features[[title, text]], notes[], changes[[…] по записям changelog],
  // shots[] (подписи скриншотов), req[], tags[], pro[]. Чего нет в переводе — остаётся по-русски.
  CI.applyItemsLang = function () {
    var map = (CI.lang !== "ru" && window.ITEMS_I18N[CI.lang]) || {};
    (CI.ITEMS || window.ITEMS || []).forEach(function (it) {
      if (!it._ru) {
        it._ru = {
          name: it.name, alias: it.alias, short: it.short, description: copy(it.description), features: copy(it.features), notes: copy(it.notes),
          changelog: copy(it.changelog), screenshots: copy(it.screenshots), requirements: copy(it.requirements),
          tags: copy(it.tags), pro: copy(it.pro), size: it.size, downloads: copy(it.downloads)
        };
      }
      var ru = it._ru, tr = map[it.id] || {};
      it.short = pick(tr.short, ru.short);
      if (ru.name != null) it.name = pick(tr.name, ru.name);   // название — только если в нём есть слова (напр. «… для Android»)
      if (ru.alias != null) it.alias = pick(tr.alias, ru.alias);
      if (ru.description) it.description = list(tr.description, [].concat(ru.description));
      if (ru.features) it.features = ru.features.map(function (f, i) {
        if (typeof f === "string") f = { title: f, text: "" }; // у части программ возможности — просто строки
        var t = (tr.features || [])[i] || [];
        return { title: pick(t[0], f.title), text: pick(t[1], f.text) };
      });
      if (ru.notes) it.notes = list(tr.notes, ru.notes);
      if (ru.changelog) it.changelog = ru.changelog.map(function (c, i) {
        var o = copy(c);
        o.changes = list((tr.changes || [])[i], c.changes || []);
        o.first = (c.changes || []).length === 1 && /первый выпуск/i.test(c.changes[0]); // «Новая программа»
        return o;
      });
      if (ru.screenshots) it.screenshots = ru.screenshots.map(function (s, i) {
        var o = copy(s); o.caption = pick((tr.shots || [])[i], CI.t(s.caption)); return o;
      });
      if (ru.requirements) it.requirements = list(tr.req, ru.requirements);
      if (ru.tags) it.tags = list(tr.tags, ru.tags);
      if (ru.pro) it.pro = list(tr.pro, ru.pro);
      if (ru.size != null) it.size = CI.size(ru.size);
      if (ru.downloads) it.downloads = ru.downloads.map(function (d) {
        var o = copy(d); o.labelRu = d.label; o.label = CI.t(d.label); if (d.size) o.size = CI.size(d.size); return o;
      });
    });
  };

  // Типы публикаций и подзаголовок сайта
  CI.applyMetaLang = function () {
    var T = window.TYPES || {};
    if (!CI._typesRu) { CI._typesRu = {}; Object.keys(T).forEach(function (k) { CI._typesRu[k] = T[k]; }); }
    Object.keys(CI._typesRu).forEach(function (k) { T[k] = CI.t(CI._typesRu[k]); });
    var S = window.SITE || {};
    if (S._taglineRu == null) S._taglineRu = S.tagline || "";
    S.tagline = CI.t(S._taglineRu);
  };

  // Статические тексты index.html: data-i18n (текст элемента), data-i18n-attr="title aria-label" (атрибуты)
  CI.applyStatic = function (root) {
    root = root || document;
    document.documentElement.setAttribute("lang", CI.lang);
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el._i18n == null) el._i18n = el.textContent;
      el.textContent = CI.t(el._i18n);
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      if (!el._i18nA) el._i18nA = {};
      el.getAttribute("data-i18n-attr").split(/\s+/).forEach(function (a) {
        if (!a) return;
        if (el._i18nA[a] == null) el._i18nA[a] = el.getAttribute(a) || "";
        el.setAttribute(a, CI.t(el._i18nA[a]));
      });
    });
    var md = document.querySelector('meta[name="description"]');
    if (md) {
      if (md._ru == null) md._ru = md.getAttribute("content") || "";
      md.setAttribute("content", CI.t(md._ru));
    }
  };

  // Переключение без перезагрузки: подгрузить переводы → применить → перерисовать страницу
  var fns = [];
  CI.onLang = function (fn) { fns.push(fn); };
  CI.setLang = function (l) {
    l = valid(l);
    if (!l) return Promise.resolve();
    store(l);
    // убрать ?lang= из адреса, чтобы обновление страницы не вернуло старый язык
    if (/[?&]lang=/.test(location.search) && history.replaceState) {
      var qs = location.search.replace(/([?&])lang=[^&]*&?/, "$1").replace(/[?&]$/, "");
      try { history.replaceState(null, "", location.pathname + qs + location.hash); } catch (e) {}
    }
    if (l === CI.lang) return Promise.resolve();
    return CI.ensureLang(l).then(function () {
      CI.lang = l;
      CI.applyItemsLang();
      CI.applyMetaLang();
      CI.applyStatic();
      fns.forEach(function (fn) { try { fn(l); } catch (e) { if (window.console) console.error(e); } });
      if (CI.route) CI.route();
    }, function () {
      if (CI.toast) CI.toast(CI.t("Не удалось загрузить перевод. Проверьте интернет."));
    });
  };

  // Ссылка с языком: index.html?lang=en#/catalog
  CI.langUrl = function (l, hash) {
    return location.pathname + "?lang=" + l + (hash == null ? location.hash : hash);
  };
})();
