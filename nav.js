(() => {
  "use strict";
  const sb = document.querySelector("#sidebar");
  const sc = document.querySelector("#scrim");
  const mb = document.querySelector("#menuBtn");
  function setOpen(o){ if(!sb) return; sb.classList.toggle("open", o); if(sc) sc.hidden = !o; if(mb) mb.setAttribute("aria-expanded", String(o)); }
  if (mb) mb.addEventListener("click", () => setOpen(!sb.classList.contains("open")));
  if (sc) sc.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  const page = document.body.dataset.page;
  document.querySelectorAll(".sidebar nav a").forEach(a => { if (a.dataset.page === page) a.setAttribute("aria-current", "page"); });
})();
