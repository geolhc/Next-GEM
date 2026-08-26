"use client";

import { useState } from "react";
import { VisualIcon } from "./VisualIcon";

const dataSources = [
  { title: "HSBC", items: ["Existing profile", "Verified KYC", "Banking history"], icon: "account" },
  { title: "TRUSTED SOURCES", items: ["Company Registry", "iAM Smart", "CorpID"], icon: "permission" },
];

const futureCards = [
  { kicker: "RELEVANCE", title: "Right fit. Right moment.", copy: "Cards · deposits · sector-led solutions", icon: "growth" },
  { kicker: "ANTICIPATION", title: "Needs, before I ask.", copy: "Guidance shaped around my business", icon: "sparkle" },
  { kicker: "GUARDIAN", title: "Checks when it matters.", copy: "New supplier · overseas payment", icon: "privacy" },
];

const productSolutions: Array<{ label: string; icon?: string; image?: string }> = [
  { label: "Business Credit", image: "/business-credit-card.png" },
  { label: "Business Debit", image: "/business-debit-card.png" },
  { label: "Payments", icon: "account" },
  { label: "FX", icon: "global" },
  { label: "Trade", icon: "trade" },
  { label: "Financing", icon: "finance" },
  { label: "Deposits", icon: "wealth" },
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

  return (
    <main className={`pitchV2 scriptPitch ${brightMode ? "brightMode" : ""}`} id="top">
      <nav className="pitchNavBar" aria-label="Primary navigation">
        <a className="brand nextGemWordmark" href="#top" aria-label="Next GEM home">
          <img className="nextGemIcon" src="./next-gem-icon.png" alt="" />
          <span className="nextGemText"><b><span className="nextWord">Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span>
        </a>
        <div className="presentationControls">
          <button className="modeToggle" onClick={() => setBrightMode((value) => !value)} aria-label={`Switch to ${brightMode ? "dark" : "bright"} presentation mode`}><i>{brightMode ? "☾" : "☀"}</i><span>{brightMode ? "Dark" : "Bright"}</span></button>
          <a className="pitchDemoLink" href="#/demo">Experience Demo <span>↗</span></a>
        </div>
      </nav>

      <section className="pitchHero pitchShell" aria-labelledby="hero-title">
        <div className="pitchAura" />
        <div className="pitchHeroCopy">
          <p className="pitchKicker">A RELATIONSHIP STORY</p>
          <h1 id="hero-title"><span>30 DAYS</span><i>→</i><em>3 MINUTES</em></h1>
          <h2>From a painful first date<br />to a lifelong partnership.</h2>
          <div className="storySignal" aria-label="The relationship journey"><b>FIRST SPARK</b><i>→</i><b>DEEPER TRUST</b><i>→</i><b>FUTURE TOGETHER</b></div>
          <a className="pitchPrimary" href="#finding-the-one">Meet the coach <span>↓</span></a>
        </div>
        <div className="pitchGemStage" aria-label="Glowing Next GEM identity">
          <div className="gemOrbit orbitA" /><div className="gemOrbit orbitB" />
          <img src="./next-gem-icon.png" alt="Next GEM holographic gem" />
          <span className="gemSignal signalA">FIRST DATE</span><span className="gemSignal signalB">LIFETIME VALUE</span>
        </div>
        <div className="scrollCue">SCROLL THE STORY <span>↓</span></div>
      </section>

      <section className="audienceSection pitchShell" id="finding-the-one" aria-labelledby="audience-title">
        <p className="pitchKicker">QUICK QUESTION</p>
        <h2 id="audience-title">Was your current partner<br /><em>your first love?</em></h2>
        <strong>Not many, right?</strong>
        <p className="audienceAnswer">Finding “the one” is hard.</p>
        <div className="redFlags" aria-label="Traditional onboarding red flags">
          <article><span>↻</span><b>Again?</b><small>Same questions</small></article>
          <article><span>···</span><b>Silence</b><small>Weeks without an answer</small></article>
          <article><span>×</span><b>No commitment</b><small>No clear next step</small></article>
        </div>
      </section>

      <section className="relationshipCoach pitchShell" aria-labelledby="coach-title">
        <div className="coachVisual">
          <div className="coachOrbit"><span><VisualIcon name="profile" /></span><span><VisualIcon name="relationship" /></span><span><VisualIcon name="banking" /></span></div>
          <img src="./next-gem-icon.png" alt="" />
        </div>
        <div>
          <p className="pitchKicker">MEET NEXT GEM</p>
          <h2 id="coach-title">The ultimate<br /><em>Relationship Coach.</em></h2>
          <div className="coachPromises"><span>Removes friction</span><span>Builds trust</span><span>Connects for the long run</span></div>
        </div>
      </section>

      <section className="chapterOverview pitchShell" aria-labelledby="chapters-title">
        <p className="pitchKicker">OUR STORY</p>
        <h2 id="chapters-title">Three chapters.<br /><em>One relationship.</em></h2>
        <ChapterProgress active={3} />
      </section>

      <section className="chapter scriptChapter sparkChapter" aria-labelledby="spark-title">
        <div className="pitchShell">
          <ChapterProgress active={1} />
          <header className="scriptChapterHead"><span>01</span><div><p>THE FIRST SPARK</p><h2 id="spark-title">Instant chemistry.</h2><h3>One conversation. Everything starts moving.</h3></div></header>
          <div className="sparkJourney">
            <article className="customerHello"><i><VisualIcon name="chat" /></i><small>ENTER MY NAME</small><p>“Hi, I’m Jenny.”</p><span>That’s all AI needs to begin</span><em className="typingCursor">|</em></article>
            <div className="journeyLine"><i /><i /><i /></div>
            <article className="sparkStep"><i><VisualIcon name="banking" /></i><b>Company data</b><span>Retrieved</span></article>
            <article className="sparkStep"><i><VisualIcon name="sparkle" /></i><b>Information</b><span>Verified</span></article>
            <article className="sparkStep"><i><VisualIcon name="privacy" /></i><b>Screening</b><span>Completed</span></article>
            <article className="accountReady"><i>✓</i><p><b>3 MINUTES</b><span>Account ready</span></p></article>
          </div>
          <div className="sourceRail">{dataSources.map((source) => <article key={source.title}><i><VisualIcon name={source.icon} /></i><p><b>{source.title}</b><span>{source.items.join(" · ")}</span></p></article>)}</div>
          <div className="chapterClose"><b>No paper chase. No awkward re-asking.</b><span>Same standards. Smarter orchestration.</span></div>
        </div>
      </section>

      <section className="chapter scriptChapter trustChapter" aria-labelledby="trust-title">
        <div className="pitchShell">
          <ChapterProgress active={2} />
          <header className="scriptChapterHead"><span>02</span><div><p>DEEPENING OUR TRUST</p><h2 id="trust-title">See me as a whole customer.</h2><h3>What is already verified can move with me—securely.</h3></div></header>
          <div className="wholeCustomer">
            <article><i><VisualIcon name="profile" /></i><b>Personal relationship</b></article>
            <span className="connectionLine" />
            <div className="customerCore"><div className="profileRings" /><img src="./next-gem-icon.png" alt="" /><p>NEXT GEM<b>CONNECTED CUSTOMER VIEW</b><span>Permissioned · Orchestrated</span></p></div>
            <span className="connectionLine" />
            <article><i><VisualIcon name="banking" /></i><b>Commercial relationship</b></article>
          </div>
          <div className="trustOutcome"><span><VisualIcon name="unlock" /></span><p><b>Business account ready</b><small>Start placing orders →</small></p></div>
          <div className="connectExtend">
            <p><span>CONNECT</span><b>Jenny</b></p>
            <div className="extendLines"><i /><i /><i /></div>
            <div><article><VisualIcon name="profile" /><b>Personal</b></article><article><VisualIcon name="banking" /><b>Business</b></article><article><VisualIcon name="people" /><b>Employees</b></article></div>
            <strong>EXTEND</strong>
          </div>
          <div className="chapterClose"><b>No repeat checks. No restart.</b><span>Mutual history becomes deeper trust.</span></div>
        </div>
      </section>

      <section className="chapter scriptChapter growChapter" aria-labelledby="future-title">
        <div className="pitchShell">
          <ChapterProgress active={3} />
          <header className="scriptChapterHead"><span>03</span><div><p>BUILDING OUR FUTURE</p><h2 id="future-title">Strong. Safe. Rewarding.</h2><h3>The relationship keeps learning and growing.</h3></div></header>
          <div className="futureStage">
            <div className="futureCoach"><div /><img src="./next-gem-icon.png" alt="" /><p>NEXT GEM<b>RELATIONSHIP COACH</b></p></div>
            <div className="futureCards">{futureCards.map((item) => <article key={item.kicker}><i><VisualIcon name={item.icon} /></i><p>{item.kicker}</p><h3>{item.title}</h3><span>{item.copy}</span></article>)}</div>
          </div>
          <div className="contextCheck"><span><VisualIcon name="visibility" /></span><p><b>Monitor context, not calendars.</b><small>Intelligent checks at meaningful action points.</small></p><div><i>New supplier</i><i>Overseas payment</i></div></div>
        </div>
      </section>

      <section className="preferenceSection pitchShell" aria-labelledby="preference-title">
        <div className="preferenceHead"><p className="pitchKicker">PREFERENCE + SOLUTIONS</p><h2 id="preference-title">The right fit<br /><em>finds Jenny.</em></h2></div>
        <div className="solutionUniverse">
          <div className="movingLens"><span>⌕</span><small>AI FIT</small></div>
          {productSolutions.map((product) => <article className={product.image ? "productImageTile" : ""} key={product.label}>{product.image ? <img src={product.image} alt={`${product.label} card`} /> : <><i><VisualIcon name={product.icon!} /></i><b>{product.label}</b></>}</article>)}
        </div>
        <div className="solutionMatch"><i><VisualIcon name="sparkle" /></i><p><span>BEST MATCH</span><b>Business Credit + preferential deposit rate</b></p><strong>Ready to activate →</strong></div>
      </section>

      <section className="securitySection pitchShell" aria-labelledby="security-title">
        <div className="securityVisual">
          <div className="lockBackdrop" aria-hidden="true"><span><VisualIcon name="unlock" /></span><span><VisualIcon name="privacy" /></span><span><VisualIcon name="unlock" /></span><span><VisualIcon name="privacy" /></span></div>
          <div className="securityOrbit"><span /><span /><span /></div>
          <div className="trustBadgeOrbit" aria-label="Continuous security monitoring across years and value movements"><span className="trustBadge year2024">2024</span><span className="trustBadge year2025">2025</span><span className="trustBadge year2026">2026</span><span className="trustBadge dollarBadge">$</span></div>
          <img src="./next-gem-icon.png" alt="Next GEM protected by continuous security monitoring" />
          <i><VisualIcon name="privacy" /></i>
        </div>
        <div><p className="pitchKicker">THE GUARDIAN</p><h2 id="security-title">Trust stays<br /><em>green.</em></h2><h3>Intelligent checks—only when context changes.</h3><div className="greenSignals"><span>✓ Same standards</span><span>✓ Timely intervention</span></div></div>
      </section>

      <section className="finalPitch pitchShell" aria-labelledby="final-title">
        <div className="finalGem"><div /><img src="./next-gem-icon.png" alt="" /></div>
        <p>NEXT GEM</p>
        <h2 id="final-title">The Relationship Coach<br /><em>for the long run.</em></h2>
        <h3><span>The first spark.</span><span>Deeper trust.</span><span>A future together.</span></h3>
        <a className="pitchPrimary" href="#/demo">Experience the 3-Min Journey <span>→</span></a>
      </section>
    </main>
  );
}
