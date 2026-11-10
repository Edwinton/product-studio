(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const SLIDES = [
    { kicker:"Swipe to learn \u2192", title:"Stop getting generic answers from AI", body:"Five prompt patterns that turn a vague question into a useful one.", example:"" },
    { kicker:"Pattern 01 \u00B7 Role", title:"Tell AI who to be", body:"Start with a role and an audience. A simple role changes the tone and depth of the answer.", example:"Act as a patient tutor explaining to a first-year student." },
    { kicker:"Pattern 02 \u00B7 Context", title:"Give the situation", body:"AI can only work with what you share. Add your goal, your level and what you already tried.", example:"I have 3 days to prepare for a viva. I know basic ML, not neural nets." },
    { kicker:"Pattern 03 \u00B7 Constraints", title:"Set the boundaries", body:"Length, format and tone make the output usable on the first try.", example:"Answer in 5 bullets. Each under 15 words. No jargon." },
    { kicker:"Pattern 04 \u00B7 Examples", title:"Show a sample", body:"One example of the style you want beats three paragraphs of description.", example:"Match this style: \u201CGradient descent: walk downhill until the error stops falling.\u201D" },
    { kicker:"Pattern 05 \u00B7 Iterate", title:"Critique, then improve", body:"Treat the first answer as a draft. Ask AI to find its weak spots, then rewrite.", example:"List 3 weaknesses in your answer, then rewrite it to fix them." },
    { kicker:"Next step", title:"Practise one a week", body:"Save this post and try one pattern on your next task. Want hands-on practice? Join AI Foundations.", example:"Enquire at the AI Education page \u2192" }
  ];
  const CAPTION = [
    "Most people get weak answers from AI because they ask weak questions.",
    "",
    "Here are 5 prompt patterns that fix that:",
    "1. Role: tell AI who to be",
    "2. Context: share your situation",
    "3. Constraints: set length and format",
    "4. Examples: show the style you want",
    "5. Iterate: critique the draft, then improve it",
    "",
    "Save this and try one on your next task.",
    "",
    "#AI #PromptEngineering #Learning #Productivity"
  ].join("\n");

  let i = 0;
  const frame = $("#slideFrame");
  const tpl = $("#tpl-slide");
  const dots = $("#dots");
  if (!frame || !tpl || !dots) return;

  function render() {
    const s = SLIDES[i];
    const n = tpl.content.cloneNode(true);
    n.querySelector(".s-kicker").textContent = s.kicker;
    n.querySelector("h4").textContent = s.title;
    n.querySelector("p").textContent = s.body;
    const ex = n.querySelector(".s-ex");
    if (s.example) { ex.textContent = s.example; ex.hidden = false; }
    n.querySelector(".s-count").textContent =
      i === SLIDES.length - 1 ? "" : String(i + 1).padStart(2,"0") + " / " + String(SLIDES.length).padStart(2,"0");
    frame.innerHTML = "";
    frame.appendChild(n);

    $("#slideCount").textContent = "Slide " + (i + 1) + " of " + SLIDES.length;
    $("#caption").textContent = CAPTION;
    $("#prevSlide").disabled = i === 0;
    $("#nextSlide").disabled = i === SLIDES.length - 1;
    dots.innerHTML = SLIDES.map((_, idx) =>
      '<button type="button" aria-label="Go to slide ' + (idx+1) + '" aria-current="' + (idx===i) + '" data-i="' + idx + '"></button>'
    ).join("");
  }

  function go(n) { i = Math.max(0, Math.min(SLIDES.length - 1, n)); render(); }
  $("#prevSlide").addEventListener("click", () => go(i - 1));
  $("#nextSlide").addEventListener("click", () => go(i + 1));
  dots.addEventListener("click", e => {
    const b = e.target.closest("button[data-i]"); if (b) go(Number(b.dataset.i));
  });
  document.addEventListener("keydown", e => {
    if (document.body.dataset.page !== "carousel") return;
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "ArrowRight") go(i + 1);
    if (e.key === "ArrowLeft") go(i - 1);
  });

  // Touch swipe
  let tx = null;
  frame.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    tx = null;
  });

  $("#copyCaption").addEventListener("click", async () => {
    const msg = $("#copyMsg");
    try { await navigator.clipboard.writeText(CAPTION); msg.textContent = "Copied"; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = CAPTION; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove(); msg.textContent = "Copied";
    }
    setTimeout(() => { msg.textContent = ""; }, 2000);
  });

  render();
})();
