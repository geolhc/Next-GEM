const slides = [
  { kicker: "THE HUMAN TRUTH", title: "A business should not have to stop before it can start.", copy: "In one familiar three-minute wait, an eligible business could receive its account number and begin a guided relationship with us.", stat: "3 MIN", label: "a memorable first moment" },
  { kicker: "THE TRUST SHIFT", title: "Trust is not one checkpoint. It grows at every milestone.", copy: "We ask only what is needed for the next safe step, show customers what is happening, and progressively open more value as confidence grows on both sides.", stat: "ONE PATH", label: "visible from start to growth" },
  { kicker: "THE NEW JOURNEY", title: "Start now. Unlock progressively. Grow continuously.", copy: "Digital identity, essential business information and initial checks create the first account. Services, limits and capabilities then expand around real business needs.", stat: "1 → ∞", label: "one start, a lifetime relationship" },
  { kicker: "THE LIVING RELATIONSHIP", title: "KYC becomes a quiet, ongoing conversation.", copy: "Consent-based data and timely prompts keep the business profile current—replacing the annual-review surprise with small, relevant actions when something changes.", stat: "ALWAYS READY", label: "less disruption, clearer control" },
  { kicker: "HUMAN + DIGITAL", title: "Automation creates more space for relationships.", copy: "Routine verification happens intelligently in the background, while relationship managers focus on advice, connections and the moments where human judgment matters most.", stat: "MORE HUMAN", label: "where it matters" },
  { kicker: "THE FUTURE BANK", title: "A bank that learns with the business—not one that waits to be asked.", copy: "Always-on intelligence recognises business signals, offers the next relevant action and connects customers to useful solutions and ecosystems—with transparency and customer control.", stat: "24 / 7", label: "relevant, responsible support" },
  { kicker: "THE ASK", title: "Pilot one golden journey. Prove a lifetime of value.", copy: "Begin with one eligible segment, test the three-minute moment and measure readiness, progression, confidence and relationship depth before scaling responsibly.", stat: "PILOT", label: "learn fast, earn trust" }
];

let currentSlide = 0;
const overlay = document.getElementById("pitchOverlay");
const progress = document.getElementById("pitchProgress");
const next = document.getElementById("pitchNext");
const prev = document.getElementById("pitchPrev");
const finish = document.getElementById("pitchFinish");

progress.innerHTML = slides.map(() => "<i></i>").join("");

function renderSlide() {
  const item = slides[currentSlide];
  document.getElementById("pitchKicker").textContent = item.kicker;
  document.getElementById("pitchTitle").textContent = item.title;
  document.getElementById("pitchCopy").textContent = item.copy;
  document.getElementById("pitchStat").textContent = item.stat;
  document.getElementById("pitchLabel").textContent = item.label;
  document.getElementById("pitchCount").textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  [...progress.children].forEach((bar, index) => bar.classList.toggle("done", index <= currentSlide));
  prev.disabled = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;
  next.hidden = isLast;
  finish.hidden = !isLast;
  const content = document.getElementById("pitchContent");
  content.style.animation = "none";
  requestAnimationFrame(() => { content.style.animation = ""; });
}

function openPitch() {
  currentSlide = 0;
  overlay.hidden = false;
  document.body.classList.add("pitch-open");
  renderSlide();
  document.getElementById("closePitch").focus();
}

function closePitch() {
  overlay.hidden = true;
  document.body.classList.remove("pitch-open");
}

document.querySelectorAll("[data-start-pitch]").forEach(button => button.addEventListener("click", openPitch));
document.getElementById("closePitch").addEventListener("click", closePitch);
finish.addEventListener("click", closePitch);
next.addEventListener("click", () => { if (currentSlide < slides.length - 1) { currentSlide += 1; renderSlide(); } });
prev.addEventListener("click", () => { if (currentSlide > 0) { currentSlide -= 1; renderSlide(); } });

document.addEventListener("keydown", event => {
  if (overlay.hidden) return;
  if (event.key === "Escape") closePitch();
  if (event.key === "ArrowRight" && currentSlide < slides.length - 1) { currentSlide += 1; renderSlide(); }
  if (event.key === "ArrowLeft" && currentSlide > 0) { currentSlide -= 1; renderSlide(); }
});
