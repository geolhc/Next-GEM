"use client";

import { useEffect, useState } from "react";
import { VisualIcon } from "./components/VisualIcon";

const slides = [
  { kicker: "01 · THE FRICTION", title: "A business can start today. Its banking often cannot.", copy: "Owners repeat information, prepare document packs and wait without a clear view of what happens next. The first banking experience interrupts business momentum.", stat: "TOO SLOW", label: "too many stops · too little visibility" },
  { kicker: "02 · THE IDEA", title: "Give an eligible business its account number in three minutes.", copy: "Next GEM begins with an AI-guided conversation, reuses trusted information with permission and asks only what is essential for a secure first milestone.", stat: "3 MIN", label: "from first touch to account number" },
  { kicker: "03 · THE VALUE", title: "Start small. Unlock more. Grow without restarting.", copy: "Documents and selective human checks strengthen assurance, while useful services open around the business’s readiness—always visible and under customer control.", stat: "START → GROW", label: "one journey · a lasting relationship" },
];

const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function GemMark() {
  return <span className="gemMark" aria-hidden="true"><i /><i /><i /></span>;
}

export default function Home() {
  const [pitchOpen, setPitchOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!pitchOpen) return;
      if (event.key === "Escape") setPitchOpen(false);
      if (event.key === "ArrowRight") setSlide((current) => Math.min(slides.length - 1, current + 1));
      if (event.key === "ArrowLeft") setSlide((current) => Math.max(0, current - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pitchOpen]);

  const startPitch = () => {
    setSlide(0);
    setPitchOpen(true);
  };

  return (
    <main className="simpleLanding">
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Next GEM home"><span className="logoWords"><b><span>Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span><GemMark /></a>
        <div className="simpleNavActions"><button className="pitchTextButton" onClick={startPitch}>Pitch overview</button><a className="navButton" href={`${siteBasePath}/demo/`}>Customer demo <span>↗</span></a></div>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroGlow" />
        <div className="heroCopy">
          <p className="eyebrow"><span /> THE WHOLE IDEA, IN ONE LINE</p>
          <h1>Start in three minutes.<br /><em>Grow without restarting.</em></h1>
          <p className="lead">Next GEM turns business account opening into one AI-guided journey—beginning with an account number, then unlocking more as trust grows.</p>
          <div className="pitchLine" aria-label="Problem, idea and value">
            <div><span>FRICTION</span><b>Waiting breaks momentum</b></div><i>→</i>
            <div><span>START</span><b>Account number in 3 minutes</b></div><i>→</i>
            <div><span>GROW</span><b>More value, one journey</b></div>
          </div>
          <div className="heroActions"><button className="primary" onClick={startPitch}>Start the pitch <span>→</span></button><a className="secondary demoLink" href={`${siteBasePath}/demo/`}>Go straight to demo <span>↗</span></a></div>
          <p className="pitchTiming"><b>Present the idea</b> Problem · possibility · business value</p>
        </div>

        <div className="heroVisual" aria-label="Account number in three minutes">
          <div className="orbit orbitOne" /><div className="orbit orbitTwo" />
          <div className="timeRing"><span className="ringIcon"><VisualIcon name="account" /></span><span className="miniLabel">ACCOUNT NUMBER GOAL</span><strong>3<small> MIN</small></strong><span className="ready"><i /> READY TO START BUSINESS</span></div>
        </div>

        <div className="heroFoot"><span>ONE IDEA · ONE JOURNEY</span><span>AI-GUIDED · CUSTOMER CONTROLLED</span></div>
      </section>

      {pitchOpen && <div className="pitchOverlay" role="dialog" aria-modal="true" aria-label="Sharp Next GEM pitch mode">
        <button className="closePitch" onClick={() => setPitchOpen(false)} aria-label="Close pitch">×</button>
        <div className="pitchProgress">{slides.map((_, index) => <i key={index} className={index <= slide ? "done" : ""} />)}</div>
        <div className="pitchContent" key={slide}><p className="eyebrow"><span /> {slides[slide].kicker}</p><h2>{slides[slide].title}</h2><p className="pitchCopy">{slides[slide].copy}</p><div className="pitchStat"><strong>{slides[slide].stat}</strong><span>{slides[slide].label}</span></div></div>
        <div className="pitchNav"><span>{String(slide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><div><button onClick={() => setSlide((current) => Math.max(0, current - 1))} disabled={slide === 0}>←</button>{slide === slides.length - 1 ? <a className="finish" href={`${siteBasePath}/demo/`}>Start demo →</a> : <button onClick={() => setSlide((current) => current + 1)}>→</button>}</div></div>
      </div>}
    </main>
  );
}
