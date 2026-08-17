"use client";

import { useEffect, useState } from "react";

const slides = [
  { kicker: "THE HUMAN TRUTH", title: "A business should not have to stop before it can start.", copy: "In one familiar three-minute wait, an eligible business could receive its account number and begin a guided relationship with us.", stat: "3 MIN", label: "a memorable first moment" },
  { kicker: "THE TRUST SHIFT", title: "Trust is not one checkpoint. It grows at every milestone.", copy: "We ask only what is needed for the next safe step, show customers what is happening, and progressively open more value as confidence grows on both sides.", stat: "ONE PATH", label: "visible from start to growth" },
  { kicker: "THE NEW JOURNEY", title: "Start now. Unlock progressively. Grow continuously.", copy: "Digital identity, essential business information and initial checks create the first account. Services, limits and capabilities then expand around real business needs.", stat: "1 → ∞", label: "one start, a lifetime relationship" },
  { kicker: "THE LIVING RELATIONSHIP", title: "KYC becomes a quiet, ongoing conversation.", copy: "Consent-based data and timely prompts keep the business profile current—replacing the annual-review surprise with small, relevant actions when something changes.", stat: "ALWAYS READY", label: "less disruption, clearer control" },
  { kicker: "HUMAN + DIGITAL", title: "Automation creates more space for relationships.", copy: "Routine verification happens intelligently in the background, while relationship managers focus on advice, connections and the moments where human judgment matters most.", stat: "MORE HUMAN", label: "where it matters" },
  { kicker: "THE FUTURE BANK", title: "A bank that learns with the business—not one that waits to be asked.", copy: "Always-on intelligence recognises business signals, offers the next relevant action and connects customers to useful solutions and ecosystems—with transparency and customer control.", stat: "24 / 7", label: "relevant, responsible support" },
  { kicker: "THE ASK", title: "Pilot one golden journey. Prove a lifetime of value.", copy: "Begin with one eligible segment, test the three-minute moment and measure readiness, progression, confidence and relationship depth before scaling responsibly.", stat: "PILOT", label: "learn fast, earn trust" },
];

const futureLayers = [
  { no: "01", icon: "◎", eyebrow: "ONE VISIBLE JOURNEY", title: "Never leave the customer wondering", copy: "One place to see status, outstanding actions, available services and the next best step—from application to everyday banking.", proof: "Clarity at every milestone" },
  { no: "02", icon: "↻", eyebrow: "LIVING BUSINESS PROFILE", title: "Keep KYC quietly current", copy: "Consent-based data and small, timely prompts update the profile when the business changes—not through one disruptive annual event.", proof: "Fewer surprises, less repetition" },
  { no: "03", icon: "◇", eyebrow: "RELATIONSHIPS AMPLIFIED", title: "Let people focus on people", copy: "Automation handles routine verification while relationship managers bring advice, context and valuable ecosystem connections.", proof: "Human judgment where it matters" },
  { no: "04", icon: "✦", eyebrow: "ALWAYS-RELEVANT SUPPORT", title: "Anticipate the next business need", copy: "Responsible intelligence turns real business signals into timely guidance, personalised offers and useful actions—under customer control.", proof: "Right moment, right relevance" },
];

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
      if (event.key === "ArrowRight") setSlide((s) => Math.min(slides.length - 1, s + 1));
      if (event.key === "ArrowLeft") setSlide((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pitchOpen]);
  const startPitch = () => { setSlide(0); setPitchOpen(true); };

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Next GEM home"><GemMark /><span><b>NEXT GEM</b><small>FUTURE BUSINESS BANKING</small></span></a>
        <div className="navlinks"><a href="#idea">Big idea</a><a href="#journey">Journey</a><a href="#future">Future bank</a><a href="#trust">Trust</a></div>
        <button className="navButton" onClick={startPitch}>Start 5-min pitch <span>↗</span></button>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroGlow" />
        <div className="heroCopy">
          <p className="eyebrow"><span /> FUTURE BUSINESS BANKING, BUILT AROUND PEOPLE</p>
          <h1>Start in minutes.<br /><em>Grow for a lifetime.</em></h1>
          <p className="lead">A business banking relationship that begins with momentum, adapts with every milestone and earns trust through every interaction.</p>
          <p className="heartline"><i>♡</i> Customer at the heart. Trust at every milestone.</p>
          <div className="heroActions"><button className="primary" onClick={startPitch}>Experience the pitch <span>→</span></button><a className="secondary" href="#idea">Explore the concept <span>↓</span></a></div>
        </div>
        <div className="heroVisual" aria-label="Account number in three minutes">
          <div className="orbit orbitOne" /><div className="orbit orbitTwo" />
          <div className="signalCard signalOne"><span className="tinyIcon">✓</span><p>Identity recognised</p><b>Secure & reusable</b></div>
          <div className="signalCard signalTwo"><span className="tinyIcon">✦</span><p>Your next milestone</p><b>Clear & personalised</b></div>
          <div className="timeRing"><span className="miniLabel">ACCOUNT NUMBER IN</span><strong>03<small>:00</small></strong><span className="ready"><i /> FIRST MILESTONE READY</span></div>
        </div>
        <div className="heroFoot"><span>PROJECT NEW GEM · PITCH DAY</span><span>28 AUGUST 2026</span></div>
      </section>

      <section className="waitSection" id="idea"><div className="shell">
        <div className="sectionHead"><p className="eyebrow dark"><span /> THE FIRST MOMENT</p><h2>One everyday wait.<br /><em>One extraordinary start.</em></h2><p>In the time it takes to do something ordinary, an eligible business can receive an account number—and see exactly what comes next.</p></div>
        <div className="waitGrid">
          <article><span className="waitIcon">☕</span><p>ORDER A COFFEE</p><b>4–6 min</b></article>
          <article><span className="waitIcon">⌁</span><p>WAIT FOR A LIFT</p><b>2–4 min</b></article>
          <article><span className="waitIcon">◉</span><p>BOOK A RIDE</p><b>3–5 min</b></article>
          <article className="featured"><span className="waitIcon">◆</span><p>RECEIVE ACCOUNT NUMBER</p><b>3 min</b><small>Our ambition for eligible businesses</small></article>
        </div>
        <div className="quote"><span>“</span><p>Don’t ask customers to pause their business<br />to begin a relationship with us.</p><span>”</span></div>
      </div></section>

      <section className="journey shell" id="journey">
        <div className="sectionHead compact"><p className="eyebrow"><span /> MILESTONE-BASED ONBOARDING</p><h2>Trust grows.<br /><em>Possibility unlocks.</em></h2><p>We separate what is essential now from what can follow later—opening value step by step, with a clear reason for every ask.</p></div>
        <div className="journeyTrack four">
          <article><div className="stepNo">01</div><div className="stepGlyph">◎</div><p className="stepTag">RECOGNISE</p><h3>Know me securely</h3><p>Verify identity, capture consent and retrieve trusted information once.</p><span className="duration">Customer in control</span></article>
          <article className="active"><div className="stepNo">02</div><div className="stepGlyph">⚡</div><p className="stepTag">BEGIN</p><h3>Start my business</h3><p>Complete essential checks and issue an account number with a visible status.</p><span className="duration">As little as 3 minutes</span></article>
          <article><div className="stepNo">03</div><div className="stepGlyph">↗</div><p className="stepTag">UNLOCK</p><h3>Match my needs</h3><p>Add payments, trade, cash and financing as readiness and assurance grow.</p><span className="duration">At the business’s pace</span></article>
          <article><div className="stepNo">04</div><div className="stepGlyph">∞</div><p className="stepTag">EVOLVE</p><h3>Grow with me</h3><p>Keep the profile current, anticipate needs and connect the wider ecosystem.</p><span className="duration">A lifetime relationship</span></article>
        </div>
      </section>

      <section className="futureSection" id="future"><div className="shell">
        <div className="sectionHead futureHead"><p className="eyebrow dark"><span /> BEYOND ONBOARDING</p><h2>A bank that evolves<br /><em>with the business.</em></h2><p>New GEM is not merely a faster application. It is a new relationship model where digital intelligence and human care work as one.</p></div>
        <div className="futureGrid">
          {futureLayers.map((item) => <article key={item.no}><span className="futureNo">{item.no}</span><div className="futureIcon">{item.icon}</div><p className="futureEyebrow">{item.eyebrow}</p><h3>{item.title}</h3><p>{item.copy}</p><b>{item.proof} →</b></article>)}
        </div>
      </div></section>

      <section className="momentum shell" aria-label="From friction to momentum">
        <div className="sectionHead"><p className="eyebrow"><span /> THE EXPERIENCE SHIFT</p><h2>Remove the interruption.<br /><em>Release the momentum.</em></h2></div>
        <div className="shiftGrid">
          <div className="shiftCol reduce"><p className="shiftLabel">LEAVE BEHIND</p><ul><li><span>×</span>Paper-heavy forms</li><li><span>×</span>Repeated signatures</li><li><span>×</span>Documents we can retrieve safely</li><li><span>×</span>Manual checks with no visible status</li></ul></div>
          <div className="shiftArrow">→</div>
          <div className="shiftCol enable"><p className="shiftLabel">MAKE POSSIBLE</p><ul><li><span>✓</span>Rapid account readiness</li><li><span>✓</span>Services unlocked around real needs</li><li><span>✓</span>Timely guidance and useful connections</li><li><span>✓</span>A relationship that deepens over time</li></ul></div>
        </div>
      </section>

      <section className="trustSection" id="trust"><div className="shell trustLayout">
        <div><p className="eyebrow dark"><span /> THE NEW TRUST CONTRACT</p><h2>Know me.<br />Show me.<br /><em>Grow with me.</em></h2><p className="trustLead">The future journey feels intelligent because customers always understand what we know, why we ask and what becomes possible next.</p></div>
        <div className="trustStack">
          <article><b>01</b><div><h3>My data, with my permission</h3><p>Consent is visible, purposeful and easy to understand.</p></div></article>
          <article><b>02</b><div><h3>My progress, never hidden</h3><p>Every status, action and milestone is clear in one journey.</p></div></article>
          <article><b>03</b><div><h3>My business, recognised over time</h3><p>We remember verified information and ask again only when it matters.</p></div></article>
          <article><b>04</b><div><h3>My relationship, human when needed</h3><p>Expert help is easy to reach, with full context already understood.</p></div></article>
        </div>
      </div></section>

      <section className="pilot shell"><div><p className="eyebrow"><span /> FROM VISION TO VALIDATION</p><h2>Start with one segment.<br /><em>Prove the relationship.</em></h2></div><div className="pilotMetrics"><div><b>01</b><p>Choose an eligible, lower-complexity segment</p></div><div><b>02</b><p>Prototype the 3-minute start and progressive milestones</p></div><div><b>03</b><p>Measure readiness, progression, confidence and relationship depth</p></div></div><button className="primary" onClick={startPitch}>Present New GEM <span>→</span></button></section>

      <footer className="shell"><a className="brand" href="#top"><GemMark /><span><b>NEXT GEM</b><small>FUTURE BUSINESS BANKING</small></span></a><p>Concept pitch · For internal discussion</p></footer>

      {pitchOpen && <div className="pitchOverlay" role="dialog" aria-modal="true" aria-label="Five-minute pitch mode">
        <button className="closePitch" onClick={() => setPitchOpen(false)} aria-label="Close pitch">×</button>
        <div className="pitchProgress">{slides.map((_, i) => <i key={i} className={i <= slide ? "done" : ""} />)}</div>
        <div className="pitchContent" key={slide}><p className="eyebrow"><span /> {slides[slide].kicker}</p><h2>{slides[slide].title}</h2><p className="pitchCopy">{slides[slide].copy}</p><div className="pitchStat"><strong>{slides[slide].stat}</strong><span>{slides[slide].label}</span></div></div>
        <div className="pitchNav"><span>{String(slide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><div><button onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}>←</button>{slide === slides.length - 1 ? <button className="finish" onClick={() => setPitchOpen(false)}>Finish</button> : <button onClick={() => setSlide((s) => s + 1)}>→</button>}</div></div>
      </div>}
    </main>
  );
}
