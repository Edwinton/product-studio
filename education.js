(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const PROGRAMMES = [
    { tag:"Beginner", meta:"6 weeks \u00B7 Online \u00B7 Live", title:"AI Foundations", desc:"How AI works, prompting patterns, using AI safely.", list:["Prompt engineering basics","AI for research and writing","Capstone: AI study assistant"], price:"\u20B94,999" },
    { tag:"Intermediate", meta:"6 weeks \u00B7 Online \u00B7 Live", title:"AI for Digital Marketing", desc:"Content systems for social, email and landing pages.", list:["Carousel and reel workflows","Campaign copy and A/B tests","Capstone: 30-day content plan"], price:"\u20B97,999" },
    { tag:"Intermediate", meta:"6 weeks \u00B7 Project-based", title:"No-Code Automation with AI", desc:"Connect forms, sheets, AI and messaging into workflows.", list:["Make and n8n scenarios","AI classification and routing","Capstone: lead-capture automation"], price:"\u20B98,999" },
    { tag:"Advanced", meta:"8 weeks \u00B7 Hybrid", title:"Applied AI Product Sprints", desc:"Idea to clickable prototype with user research.", list:["Product discovery and CTAs","Prototyping with AI tools","Capstone: shipped landing page"], price:"\u20B912,999" }
  ];

  const tpl = $("#tpl-programme");
  const grid = $("#programmeGrid");
  if (tpl && grid) {
    PROGRAMMES.forEach(p => {
      const n = tpl.content.cloneNode(true);
      n.querySelector(".p-tag").textContent = p.tag;
      n.querySelector(".p-meta").textContent = p.meta;
      n.querySelector(".p-title").textContent = p.title;
      n.querySelector(".p-desc").textContent = p.desc;
      const ul = n.querySelector(".p-list");
      p.list.forEach(li => { const el = document.createElement("li"); el.textContent = li; ul.appendChild(el); });
      n.querySelector(".p-price").textContent = p.price;
      const btn = n.querySelector(".p-btn");
      btn.dataset.track = p.title;
      grid.appendChild(n);
    });
  }

  // Click a programme's Enquire button → prefill the track select
  grid?.addEventListener("click", e => {
    const b = e.target.closest(".p-btn"); if (!b) return;
    const track = b.dataset.track;
    const sel = $("#eTrack");
    if (sel) {
      for (const opt of sel.options) if (opt.value === track) { sel.value = track; break; }
    }
    $("#enrol")?.scrollIntoView({ behavior:"smooth", block:"start" });
    setTimeout(() => $("#eName")?.focus({ preventScroll:true }), 400);
  });

  // ---- Validation ----
  const form = $("#enrolForm");
  if (!form) return;
  const rules = {
    eName:    { err:"#eNameErr",    test:v => v.trim().length >= 2,                                         msg:"Please enter your full name." },
    eEmail:   { err:"#eEmailErr",   test:v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),               msg:"Enter a valid email address." },
    ePhone:   { err:"#ePhoneErr",   test:v => /^[6-9]\d{9}$/.test(v.replace(/\s|-/g, "")),                 msg:"Enter a 10-digit Indian mobile number." },
    eTrack:   { err:"#eTrackErr",   test:v => v !== "",                                                     msg:"Choose a track to continue." },
    eConsent: { err:"#eConsentErr", test:(_,el) => el.checked,                                             msg:"Please tick the box so we can contact you." }
  };
  function validate(id) {
    const el = document.getElementById(id);
    const rule = rules[id];
    const v = el.type === "checkbox" ? "" : el.value;
    const ok = rule.test(v, el);
    $(rule.err).textContent = ok ? "" : rule.msg;
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("blur", () => validate(id));
    el.addEventListener("input", () => { if ($(rules[id].err).textContent) validate(id); });
    if (el.type === "checkbox") el.addEventListener("change", () => validate(id));
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const results = Object.keys(rules).map(validate);
    const firstBad = Object.keys(rules).find(id => document.getElementById(id).getAttribute("aria-invalid") === "true");
    if (results.every(Boolean)) {
      $("#enrolOk").hidden = false;
      form.reset();
      Object.keys(rules).forEach(id => { $(rules[id].err).textContent = ""; document.getElementById(id).removeAttribute("aria-invalid"); });
    } else if (firstBad) {
      document.getElementById(firstBad).focus();
    }
  });
})();
