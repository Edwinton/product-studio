(() => {
  "use strict";
  const KEY = "ps.settings.v1";
  const DEFAULTS = {
    theme: "auto", accent: "section", density: "comfortable",
    motion: "full", radius: "round", fontSize: "md",
    showHints: true, stickyFilters: true, autoScrollResults: true
  };
  const store = {
    get() { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { ...DEFAULTS }; } },
    set(n) { try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} }
  };
  const state = store.get();

  function apply(s = state) {
    const r = document.documentElement;
    r.dataset.theme = s.theme;
    r.dataset.density = s.density;
    r.dataset.motion = s.motion;
    r.dataset.radius = s.radius;
    r.dataset.fontSize = s.fontSize;

    if (s.accent && s.accent !== "section") {
      const m = {
        indigo:  ["#4f46e5","#8b7bff","#ecebfd"],
        emerald: ["#0d7a64","#2fbf9a","#e2f4ee"],
        violet:  ["#6d4aff","#c084fc","#efeafe"],
        coral:   ["#e8553a","#ffb199","#fdeee9"],
        blue:    ["#1d5fc7","#60a5fa","#e6effb"]
      };
      const [a, a2, soft] = m[s.accent] || m.indigo;
      r.style.setProperty("--accent", a);
      r.style.setProperty("--accent-2", a2);
      r.style.setProperty("--accent-soft", soft);
    } else {
      r.style.removeProperty("--accent");
      r.style.removeProperty("--accent-2");
      r.style.removeProperty("--accent-soft");
    }

    document.querySelectorAll("[data-hint]").forEach(el => { el.hidden = !s.showHints; });
    document.body.dataset.stickyFilters = String(s.stickyFilters);
    document.body.dataset.autoScroll = String(s.autoScrollResults);

    // Reflect state back into controls
    document.querySelectorAll("[data-setting]").forEach(el => {
      const key = el.dataset.setting;
      if (!(key in s)) return;
      if (el.type === "checkbox") {
        // Special case: motion is a string but shown as a checkbox
        if (key === "motion") el.checked = (s.motion === "reduced");
        else el.checked = !!s[key];
      } else {
        el.value = s[key];
      }
    });
  }

  function update(patch) {
    Object.assign(state, patch);
    store.set(state);
    apply();
    document.dispatchEvent(new CustomEvent("settings:change", { detail: { ...state } }));
  }

  function wireControls() {
    document.querySelectorAll("[data-setting]").forEach(el => {
      const key = el.dataset.setting;
      const evt = (el.type === "checkbox" || el.tagName === "SELECT") ? "change" : "input";
      el.addEventListener(evt, () => {
        if (key === "motion") {
          update({ motion: el.checked ? "reduced" : "full" });
        } else {
          const val = el.type === "checkbox" ? el.checked : el.value;
          update({ [key]: val });
        }
      });
    });

    document.querySelectorAll("[data-settings-reset]").forEach(btn => {
      btn.addEventListener("click", () => {
        Object.assign(state, DEFAULTS);
        store.set(state);
        apply();
        document.dispatchEvent(new CustomEvent("settings:change", { detail: { ...state } }));
      });
    });

    const d = document.querySelector("#settingsDrawer");
    const sc = document.querySelector("#settingsScrim");
    const ob = document.querySelector("#settingsBtn");
    function setOpen(open) {
      if (!d) return;
      d.classList.toggle("open", open);
      if (sc) sc.hidden = !open;
      if (ob) ob.setAttribute("aria-expanded", String(open));
      d.setAttribute("aria-hidden", String(!open));
    }
    if (ob) ob.addEventListener("click", () => setOpen(!d.classList.contains("open")));
    if (sc) sc.addEventListener("click", () => setOpen(false));
    document.querySelectorAll("[data-settings-close]").forEach(b => b.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  }

  window.PSSettings = { get: () => ({ ...state }), update, apply };
  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireControls);
  else wireControls();
})();
