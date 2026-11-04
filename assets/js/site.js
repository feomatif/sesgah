(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");

  var TITLES = {
    en: "Sesgâh — local AI voice studio with real emotions",
    tr: "Sesgâh — duygularıyla konuşan yerel ses atölyesi"
  };

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  function pickLang() {
    var q = /[?&]lang=(tr|en)\b/.exec(window.location.search);
    if (q) return q[1];
    var saved = store("sesgah-lang");
    if (saved === "tr" || saved === "en") return saved;
    var list = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      if (/^tr\b/i.test(list[i])) return "tr";
    }
    return "en";
  }

  function setLang(lang, remember) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = TITLES[lang];
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === lang));
    });
    document.querySelectorAll("[data-alt-" + lang + "]").forEach(function (el) {
      el.setAttribute("alt", el.getAttribute("data-alt-" + lang));
    });
    if (remember) store("sesgah-lang", lang);
  }

  setLang(pickLang(), false);
  document.querySelectorAll(".langs button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set"), true); });
  });

  // ekran görüntüsü sekmeleri
  var shot = document.getElementById("shot-img");
  var tabs = document.querySelectorAll(".tabs button");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) { o.setAttribute("aria-selected", String(o === t)); });
      document.querySelectorAll(".viewer figcaption [data-cap]").forEach(function (c) {
        c.hidden = c.getAttribute("data-cap") !== t.getAttribute("data-shot");
      });
      shot.src = "assets/img/shots/" + t.getAttribute("data-shot") + ".webp";
      shot.setAttribute("data-alt-en", t.getAttribute("data-alt-en"));
      shot.setAttribute("data-alt-tr", t.getAttribute("data-alt-tr"));
      shot.setAttribute("alt", t.getAttribute("data-alt-" + root.getAttribute("data-lang")));
    });
  });

  // tema seçici
  var theme = document.getElementById("theme-img");
  var themeBtns = document.querySelectorAll(".themes button");
  themeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      themeBtns.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      theme.src = "assets/img/themes/" + b.getAttribute("data-theme") + ".webp";
    });
  });

  // kaydırınca beliren bölümler
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
