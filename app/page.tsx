"use client";

import { useEffect, useState } from "react";
import { VisualIcon } from "./components/VisualIcon";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;
const route = (path: string) => `${basePath}${path}`;

const dataSources = [
  { title: "HSBC DATA", items: ["KYC", "History"], icon: "account" },
  { title: "TRUSTED DATA", items: ["Registry", "iAM Smart", "CorpID"], icon: "permission" },
];

const productSolutions: Array<{ label: string; icon?: string }> = [
  { label: "Deposits", icon: "wealth" },
  { label: "Business Debit Cards" },
  { label: "Credit Cards" },
  { label: "Payments", icon: "account" },
  { label: "FX", icon: "global" },
  { label: "Trade", icon: "trade" },
  { label: "Financing", icon: "finance" },
  { label: "Commercial Wealth", icon: "wealth" },
  { label: "GBA", icon: "global" },
];

function ChapterProgress({ active }: { active: 0 | 1 | 2 | 3 }) {
  const chapters = [
    { number: "01", title: "First Spark", icon: "lightning" },
    { number: "02", title: "Deepening Trust", icon: "relationship" },
    { number: "03", title: "Building Our Future", icon: "growth" },
  ];
  return <div className={`chapterProgress progress${active}`} aria-label={`${active} of 3 relationship chapters revealed`}>
    {chapters.map((chapter, index) => <article className={index < active ? "revealed" : "waiting"} key={chapter.number}><span>{chapter.number}</span><i><VisualIcon name={chapter.icon} /></i><b>{chapter.title}</b></article>)}
  </div>;
}

export default function Home() {
  const [brightMode, setBrightMode] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [coachReveal, setCoachReveal] = useState<0 | 1 | 2 | 3>(0);
  const slideLabels = ["Opening", "Meet Next GEM", "First Spark", "Deeper Trust", "Building Our Future", "Guardian", "Next GEM"];
  const lastSlide = slideLabels.length - 1;
  const goToSlide = (index: number) => setActiveSlide(Math.max(0, Math.min(lastSlide, index)));
  const slideState = (index: number) => index === activeSlide ? "activeSlide" : index < activeSlide ? "slideBefore" : "slideAfter";

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); goToSlide(activeSlide + 1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); goToSlide(activeSlide - 1); }
      if (event.key === "Home") { event.preventDefault(); goToSlide(0); }
      if (event.key === "End") { event.preventDefault(); goToSlide(lastSlide); }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [activeSlide, lastSlide]);

  useEffect(() => {
    document.querySelector<HTMLElement>(".pitchSlides > .activeSlide")?.scrollTo({ top: 0 });
  }, [activeSlide]);

  useEffect(() => {
    if (activeSlide !== 1 || coachReveal === 0 || coachReveal === 3) return;
    const timer = window.setTimeout(() => setCoachReveal((current) => Math.min(3, current + 1) as 0 | 1 | 2 | 3), 3000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, coachReveal]);

  return (
    <main className={`pitchV2 scriptPitch ${brightMode ? "brightMode" : ""}`} id="top">
      <nav className="pitchNavBar" aria-label="Primary navigation">
        <a className="brand nextGemWordmark" href="#top" aria-label="Next GEM home">
          <img className="nextGemIcon" src={asset("/next-gem-icon.png")} alt="" />
          <span className="nextGemText"><b><span className="nextWord">Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span>
        </a>
        <div className="presentationControls">
          <button className="modeToggle" onClick={() => setBrightMode((value) => !value)} aria-label={`Switch to ${brightMode ? "dark" : "bright"} presentation mode`}><i>{brightMode ? "☾" : "☀"}</i><span>{brightMode ? "Dark" : "Bright"}</span></button>
          <a className="pitchDemoLink" href={route("/demo/")}>Experience Demo <span>↗</span></a>
        </div>
      </nav>

      <div className="pitchSlides" aria-live="polite">
      <section className={`pitchHero minimalOpening gemOnlyOpening pitchShell ${slideState(0)}`} aria-hidden={activeSlide !== 0} aria-label="Next GEM opening">
        <div className="pitchAura" />
        <div className="pitchGemStage" aria-label="Glowing Next GEM identity">
          <div className="gemOrbit orbitA" /><div className="gemOrbit orbitB" />
          <img src={asset("/next-gem-icon.png")} alt="Next GEM holographic gem" />
        </div>
      </section>

      <section className={`relationshipCoach combinedCoach pitchShell reveal${coachReveal} ${slideState(1)}`} aria-hidden={activeSlide !== 1} aria-labelledby="coach-title">
        <div className="coachVisual">
          <div className="coachOrbit"><span><VisualIcon name="profile" /></span><span><VisualIcon name="relationship" /></span><span><VisualIcon name="banking" /></span></div>
          <img src={asset("/next-gem-icon.png")} alt="" />
        </div>
        <div className="coachStatement">
          <p className="pitchKicker">MEET NEXT GEM</p>
          <h2 id="coach-title">The Ultimate<br /><em>Relationship Coach</em></h2>
          <button className="chapterRevealButton" onClick={() => setCoachReveal(coachReveal === 3 ? 1 : Math.max(1, coachReveal) as 0 | 1 | 2 | 3)}>
            {coachReveal === 0 ? "Reveal the relationship →" : coachReveal === 3 ? "Replay chapters ↻" : "Story unfolding…"}
          </button>
        </div>
        <ChapterProgress active={coachReveal} />
      </section>

      <section className={`chapter scriptChapter sparkChapter restoredChapter ${slideState(2)}`} aria-hidden={activeSlide !== 2} aria-labelledby="spark-title">
        <div className="pitchShell">
          <header className="scriptChapterHead"><span>01</span><div><h2 className="chapterHeadline" id="spark-title">THE FIRST SPARK</h2><h3>Instant chemistry</h3></div></header>
          <div className="sparkJourney">
            <article className="customerHello"><i><VisualIcon name="chat" /></i><small>JENNY</small><p>“Hi, I’m Jenny.”</p><em className="typingCursor">|</em></article>
            <div className="journeyLine"><i /><i /><i /></div>
            <article className="sparkStep"><i><VisualIcon name="banking" /></i><b>DATA</b><strong>✓</strong></article>
            <article className="sparkStep"><i><VisualIcon name="sparkle" /></i><b>VERIFY</b><strong>✓</strong></article>
            <article className="sparkStep"><i><VisualIcon name="privacy" /></i><b>SCREEN</b><strong>✓</strong></article>
            <article className="accountReady"><i>✓</i><p><span>ACCOUNT READY</span><b>3 MINUTES</b></p></article>
          </div>
          <div className="sourceRail">{dataSources.map((source) => <article key={source.title}><i><VisualIcon name={source.icon} /></i><p><b>{source.title}</b><span>{source.items.join(" · ")}</span></p></article>)}</div>
        </div>
      </section>

      <section className={`chapter scriptChapter trustChapter restoredChapter ${slideState(3)}`} aria-hidden={activeSlide !== 3} aria-labelledby="trust-title">
        <div className="pitchShell">
          <header className="scriptChapterHead"><span>02</span><div><h2 className="chapterHeadline" id="trust-title">DEEPENING OUR TRUST</h2><h3>One connected customer</h3></div></header>
          <div className="wholeCustomer">
            <article className="identityNode personalNode" aria-label="Personal relationship"><i><VisualIcon name="profile" /></i></article>
            <span className="connectionLine" />
            <div className="customerCore"><div className="profileRings" /><img src={asset("/next-gem-icon.png")} alt="" /><p>NEXT GEM<b>ONE CONNECTED VIEW</b></p></div>
            <span className="connectionLine" />
            <article className="identityNode businessNode" aria-label="Business relationship"><i><VisualIcon name="banking" /></i></article>
          </div>
          <div className="trustOutcome"><span><VisualIcon name="unlock" /></span><p><b>ACCOUNT READY</b></p></div>
          <div className="relationshipNetwork">
            <p><b>Jenny</b></p><span className="networkArrow">→</span>
            <div><article><VisualIcon name="profile" /><b>Personal</b></article><article><VisualIcon name="banking" /><b>Business</b></article><article><VisualIcon name="people" /><b>Employees</b></article></div>
          </div>
        </div>
      </section>

      <section className={`preferenceSection futureSolutions pitchShell ${slideState(4)}`} aria-hidden={activeSlide !== 4} aria-labelledby="future-title">
        <header className="futureSolutionsHead scriptChapterHead"><span>03</span><div><h2 className="chapterHeadline" id="future-title">BUILDING OUR FUTURE</h2><h3>Preference + solutions</h3></div></header>
        <div className="solutionUniverse">
          <div className="movingLens"><img src={asset("/next-gem-icon.png")} alt="Next GEM" /><small>AI FIT</small></div>
          {productSolutions.map((product) => <article className={!product.icon ? "wordOnlySolution" : ""} key={product.label}>{product.icon && <i><VisualIcon name={product.icon} /></i>}<b>{product.label}</b></article>)}
        </div>
        <div className="solutionMatch"><i><VisualIcon name="sparkle" /></i><p><span>BEST MATCH</span><b>Credit Cards + preferential deposit rate</b></p><strong>Ready to activate →</strong></div>
      </section>

      <section className={`securitySection pitchShell ${slideState(5)}`} aria-hidden={activeSlide !== 5} aria-labelledby="security-title">
        <div className="securityVisual">
          <div className="lockBackdrop" aria-hidden="true"><span><VisualIcon name="unlock" /></span><span><VisualIcon name="privacy" /></span><span><VisualIcon name="unlock" /></span><span><VisualIcon name="privacy" /></span></div>
          <div className="defenseShields" aria-hidden="true"><span><VisualIcon name="privacy" /></span><span><VisualIcon name="privacy" /></span><span><VisualIcon name="privacy" /></span></div>
          <div className="securityOrbit"><span /><span /><span /></div>
          <div className="trustBadgeOrbit" aria-label="Continuous security monitoring across years and value movements"><span className="trustBadge year2024">2024</span><span className="trustBadge year2025">2025</span><span className="trustBadge year2026">2026</span><span className="trustBadge dollarBadge">$</span></div>
          <img src={asset("/next-gem-icon.png")} alt="Next GEM protected by continuous security monitoring" />
          <i><VisualIcon name="privacy" /></i>
        </div>
        <div className="guardianCopy"><h2 id="security-title">THE<br /><em>GUARDIAN</em></h2><h3>ALWAYS ON</h3></div>
      </section>

      <section className={`finalPitch pitchShell ${slideState(6)}`} aria-hidden={activeSlide !== 6} aria-labelledby="final-title">
        <div className="finalGem"><div /><img src={asset("/next-gem-icon.png")} alt="" /></div>
        <p>NEXT GEM</p>
        <h2 id="final-title">The Relationship Coach<br /><em>for the long run</em></h2>
        <h3><span>The first spark</span><span>Deeper trust</span><span>A future together</span></h3>
        <a className="pitchPrimary" href={route("/demo/")}>Experience the 3-Min Journey <span>→</span></a>
      </section>
      </div>

      <nav className="slideControls" aria-label="Pitch slide controls">
        <button className="slideArrow" onClick={() => goToSlide(activeSlide - 1)} disabled={activeSlide === 0} aria-label="Previous slide">← <span>Back</span></button>
        <div className="slidePosition">
          <p><b>{String(activeSlide + 1).padStart(2, "0")}</b><span>/ {String(slideLabels.length).padStart(2, "0")}</span><em>{slideLabels[activeSlide]}</em></p>
          <div>{slideLabels.map((label, index) => <button key={label} className={activeSlide === index ? "active" : ""} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}: ${label}`} aria-current={activeSlide === index ? "step" : undefined} />)}</div>
        </div>
        {activeSlide < lastSlide ? <button className="slideArrow next" onClick={() => goToSlide(activeSlide + 1)}><span>Next</span> →</button> : <a className="slideArrow next openDemo" href={route("/demo/")}><span>Open Demo</span> ↗</a>}
      </nav>
    </main>
  );
}
