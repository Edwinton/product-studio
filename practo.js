(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const TYPES = [
    { id: "all", label: "All" },
    { id: "clinic", label: "Vet clinics" },
    { id: "hospital", label: "Hospitals" },
    { id: "boarding", label: "Boarding" },
    { id: "diagnostics", label: "Diagnostics" },
    { id: "ambulance", label: "Ambulance" },
    { id: "ngo", label: "NGOs & rescue" }
  ];
  const TYPE_LABEL = { clinic:"Veterinary clinic", hospital:"Animal hospital", boarding:"Boarding & day care", diagnostics:"Diagnostics", ambulance:"Ambulance", ngo:"NGO & rescue" };
  const TYPE_ICON  = { clinic:"+", hospital:"\u2665", boarding:"\u2302", diagnostics:"\u25CE", ambulance:"\u2691", ngo:"\u273F" };

  const SERVICES = [
    { type:"clinic", icon:"+", title:"Routine care", copy:"Vaccination, checkups, dental and grooming." },
    { type:"hospital", icon:"\u2665", title:"Emergency & ICU", copy:"24-hour hospitals with surgery and critical care." },
    { type:"boarding", icon:"\u2302", title:"Boarding & day care", copy:"Trusted stays while you travel." },
    { type:"diagnostics", icon:"\u25CE", title:"Diagnostics", copy:"Blood tests, ultrasound and imaging." },
    { type:"ambulance", icon:"\u2691", title:"Pet ambulance", copy:"Transport and first aid." },
    { type:"ngo", icon:"\u273F", title:"Rescue & adoption", copy:"NGOs for strays and adoption drives." }
  ];

  const PROVIDERS = [
    { name:"Paws & Claws Animal Hospital", type:"clinic", city:"Kochi", area:"Edappally", rating:4.8, reviews:412, hours:"8 AM \u2013 9 PM", open24:false, emergency:true, verified:true, species:"Dogs, cats", services:["Vaccination","Surgery","Dental"], phone:"+91 484 555 0101" },
    { name:"Harbour Vet Clinic", type:"clinic", city:"Kochi", area:"Fort Kochi", rating:4.6, reviews:188, hours:"9 AM \u2013 8 PM", open24:false, emergency:false, verified:true, species:"Dogs, cats, birds", services:["Vaccination","Grooming","Checkups"], phone:"+91 484 555 0102" },
    { name:"Thrissur Pet Care Hospital", type:"hospital", city:"Thrissur", area:"Round East", rating:4.7, reviews:260, hours:"24 hours", open24:true, emergency:true, verified:true, species:"Dogs, cats, cattle", services:["ICU","Surgery","X-ray"], phone:"+91 487 555 0103" },
    { name:"Calicut Animal Emergency Hospital", type:"hospital", city:"Kozhikode", area:"Mavoor Road", rating:4.5, reviews:143, hours:"24 hours", open24:true, emergency:true, verified:false, species:"Dogs, cats", services:["Emergency","ICU","Blood bank"], phone:"+91 495 555 0104" },
    { name:"Happy Tails Boarding", type:"boarding", city:"Kochi", area:"Kakkanad", rating:4.4, reviews:97, hours:"7 AM \u2013 10 PM", open24:false, emergency:false, verified:true, species:"Dogs, cats", services:["Day care","Overnight boarding","Grooming"], phone:"+91 484 555 0105" },
    { name:"Wagging Stay Pet Hotel", type:"boarding", city:"Thrissur", area:"Ayyanthole", rating:4.9, reviews:71, hours:"8 AM \u2013 7 PM", open24:false, emergency:false, verified:true, species:"Dogs", services:["Boarding","Walks","Training"], phone:"+91 487 555 0106" },
    { name:"VetLab Diagnostics", type:"diagnostics", city:"Kochi", area:"Vyttila", rating:4.6, reviews:205, hours:"7 AM \u2013 7 PM", open24:false, emergency:false, verified:true, species:"All species", services:["Blood tests","Ultrasound","Pathology"], phone:"+91 484 555 0107" },
    { name:"Canine Imaging Centre", type:"diagnostics", city:"Kozhikode", area:"Palayam", rating:4.3, reviews:64, hours:"9 AM \u2013 6 PM", open24:false, emergency:false, verified:false, species:"Dogs, cats", services:["X-ray","Ultrasound","Referrals"], phone:"+91 495 555 0108" },
    { name:"Rapid Pet Ambulance", type:"ambulance", city:"Kochi", area:"Citywide", rating:4.7, reviews:330, hours:"24 hours", open24:true, emergency:true, verified:true, species:"Dogs, cats", services:["Transport","First aid"], phone:"+91 484 555 0109" },
    { name:"Mercy Paws Ambulance", type:"ambulance", city:"Thrissur", area:"District-wide", rating:4.5, reviews:122, hours:"24 hours", open24:true, emergency:true, verified:true, species:"All species", services:["Transport","Rescue","First aid"], phone:"+91 487 555 0110" },
    { name:"Street Animal Rescue Trust", type:"ngo", city:"Kochi", area:"Ernakulam", rating:4.9, reviews:540, hours:"10 AM \u2013 6 PM", open24:false, emergency:false, verified:true, species:"Strays", services:["Rescue","Adoption","Sterilisation"], phone:"+91 484 555 0111" },
    { name:"Shelter Hope NGO", type:"ngo", city:"Kozhikode", area:"Beach", rating:4.6, reviews:210, hours:"Weekends 9 AM \u2013 1 PM", open24:false, emergency:false, verified:true, species:"Dogs, cats", services:["Adoption","Vaccination drives"], phone:"+91 495 555 0112" }
  ];

  const state = { q:"", type:"all", city:"all", minRating:0, sort:"rating", open24:false, emergency:false, verified:false };
  const grid = $("#providerGrid");
  const empty = $("#emptyState");
  const countEl = $("#resultCount");

  const tplProv = $("#tpl-provider");
  const tplChip = $("#tpl-chip");
  const tplSvc = $("#tpl-service");

  if (!tplProv || !tplChip || !tplSvc) { console.warn("practo: templates missing"); return; }

  // ---- chips ----
  const chipWrap = $("#typeChips");
  TYPES.forEach(t => {
    const n = tplChip.content.cloneNode(true);
    const b = n.querySelector(".chip");
    b.dataset.type = t.id;
    b.textContent = t.label;
    b.classList.toggle("is-on", t.id === "all");
    chipWrap.appendChild(n);
  });

  // ---- services ----
  const svcWrap = $("#serviceTiles");
  SERVICES.forEach(s => {
    const n = tplSvc.content.cloneNode(true);
    const b = n.querySelector(".svc");
    b.dataset.goto = s.type;
    n.querySelector(".svc-ico").textContent = s.icon;
    n.querySelector(".svc-title").textContent = s.title;
    n.querySelector(".svc-copy").textContent = s.copy;
    svcWrap.appendChild(n);
  });

  function matches(p) {
    if (state.type !== "all" && p.type !== state.type) return false;
    if (state.city !== "all" && p.city !== state.city) return false;
    if (p.rating < state.minRating) return false;
    if (state.open24 && !p.open24) return false;
    if (state.emergency && !p.emergency) return false;
    if (state.verified && !p.verified) return false;
    if (state.q) {
      const hay = [p.name, p.city, p.area, TYPE_LABEL[p.type], p.species, ...p.services].join(" ").toLowerCase();
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(t => hay.includes(t))) return false;
    }
    return true;
  }
  function sorted(list) {
    const c = [...list];
    if (state.sort === "rating") c.sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);
    if (state.sort === "reviews") c.sort((a,b) => b.reviews - a.reviews);
    if (state.sort === "name") c.sort((a,b) => a.name.localeCompare(b.name));
    return c;
  }

  function render() {
    const results = sorted(PROVIDERS.filter(matches));
    grid.innerHTML = "";
    results.forEach(p => {
      const n = tplProv.content.cloneNode(true);
      n.querySelector(".prov-thumb").textContent = TYPE_ICON[p.type];
      n.querySelector(".tag").textContent = TYPE_LABEL[p.type];
      n.querySelector("h3").textContent = p.name;
      n.querySelector(".r-num").textContent = "\u2605 " + p.rating.toFixed(1);
      n.querySelector(".r-count").textContent = "(" + p.reviews + ")";
      n.querySelector(".m-area").textContent = "\uD83D\uDCCD " + p.area + ", " + p.city;
      n.querySelector(".m-hours").textContent = "\uD83D\uDD58 " + p.hours;
      n.querySelector(".m-species").textContent = "\uD83D\uDC3E " + p.species;
      const badges = [];
      if (p.open24) badges.push('<span class="badge">Open 24 hours</span>');
      if (p.emergency) badges.push('<span class="badge">Emergencies</span>');
      badges.push(p.verified ? '<span class="badge">\u2713 Verified</span>' : '<span class="badge">Unverified</span>');
      n.querySelector(".badges").innerHTML = badges.join("");
      n.querySelector(".services-line").textContent = p.services.join(" \u00B7 ");
      n.querySelector(".call-btn").href = "tel:" + p.phone.replace(/\s+/g, "");
      n.querySelector(".dir-btn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.name + " " + p.city);
      n.querySelector(".correct-btn").dataset.correct = p.name;
      grid.appendChild(n);
    });
    empty.hidden = results.length > 0;
    grid.hidden = results.length === 0;
    countEl.textContent = results.length === PROVIDERS.length
      ? "Showing all " + results.length + " providers"
      : results.length + " of " + PROVIDERS.length + " providers match";
    syncChips();
  }
  function syncChips() {
    $$("#typeChips .chip").forEach(c => {
      const on = c.dataset.type === state.type;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-pressed", String(on));
    });
  }
  function reset() {
    Object.assign(state, { q:"", type:"all", city:"all", minRating:0, sort:"rating", open24:false, emergency:false, verified:false });
    $("#q").value = ""; $("#fCity").value = "all"; $("#fRating").value = "0"; $("#fSort").value = "rating";
    $("#fOpen").checked = false; $("#fEmergency").checked = false; $("#fVerified").checked = false;
    render();
  }
  function jump(type) {
    state.type = type; state.city = "all"; state.minRating = 0;
    state.open24 = false; state.emergency = false; state.verified = false;
    $("#fCity").value = "all"; $("#fRating").value = "0";
    $("#fOpen").checked = false; $("#fEmergency").checked = false; $("#fVerified").checked = false;
    render();
    if (document.body.dataset.autoScroll !== "false") {
      document.querySelector(".practo-layout")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  $("#searchForm").addEventListener("submit", e => { e.preventDefault(); state.q = $("#q").value.trim(); render(); });
  $("#q").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
  $("#typeChips").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    state.type = c.dataset.type; render();
  });
  $("#fCity").addEventListener("change", e => { state.city = e.target.value; render(); });
  $("#fRating").addEventListener("change", e => { state.minRating = Number(e.target.value); render(); });
  $("#fSort").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("#fOpen").addEventListener("change", e => { state.open24 = e.target.checked; render(); });
  $("#fEmergency").addEventListener("change", e => { state.emergency = e.target.checked; render(); });
  $("#fVerified").addEventListener("change", e => { state.verified = e.target.checked; render(); });
  $("#clearFilters").addEventListener("click", reset);
  $("#emptyReset").addEventListener("click", reset);
  $("#ctaFindVet").addEventListener("click", () => jump("clinic"));
  $("#ctaList").addEventListener("click", () => openDlg("#listDlg"));
  $("#ctaCorrect").addEventListener("click", () => openDlg("#corrDlg"));
  $("#serviceTiles").addEventListener("click", e => {
    const b = e.target.closest(".svc"); if (b) jump(b.dataset.goto);
  });
  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-correct]"); if (!b) return;
    $("#cName").value = b.dataset.correct; openDlg("#corrDlg");
  });

  function openDlg(sel) { const d = $(sel); if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open",""); }
  function closeDlg(d) { if (typeof d.close === "function") d.close(); else d.removeAttribute("open"); }

  $$("[data-close]").forEach(b => b.addEventListener("click", () => closeDlg(b.closest("dialog"))));
  $("#listForm").addEventListener("submit", e => e.preventDefault());
  $("#corrForm").addEventListener("submit", e => e.preventDefault());
  $("#listSubmit").addEventListener("click", () => {
    const f = $("#listForm");
    if (!f.reportValidity()) return;
    $("#listMsg").textContent = "Thanks. Your listing is in review (demo: nothing sent).";
    f.reset(); setTimeout(() => closeDlg($("#listDlg")), 1400);
  });
  $("#corrSubmit").addEventListener("click", () => {
    const f = $("#corrForm");
    if (!f.reportValidity()) return;
    $("#corrMsg").textContent = "Got it. We\u2019ll review this within 48 hours (demo: nothing sent).";
    f.reset(); setTimeout(() => closeDlg($("#corrDlg")), 1400);
  });
  ["#listDlg","#corrDlg"].forEach(sel => {
    $(sel).addEventListener("close", () => { $(sel + " .ok-inline").textContent = ""; });
  });

  render();
})();
