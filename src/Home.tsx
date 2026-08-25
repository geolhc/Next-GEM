"use client";

import { VisualIcon } from "./VisualIcon";

const pitch = [
  { number: "01", label: "ONE TAP", title: "Start with what is already trusted.", copy: "Tap an ID. Connect permissioned data. Let AI ask only what remains.", icon: "profile" },
  { number: "02", label: "ONE PROFILE", title: "Onboard once.", copy: "One verified profile carries identity, company context and progress forward.", icon: "link" },
  { number: "03", label: "ONE HSBC", title: "Grow without restarting.", copy: "An account in minutes—then the right services unlock as the relationship grows.", icon: "growth" },
];

export default function Home() {
  return (
    <main className="simpleLanding embeddedPitchLanding">
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand nextGemWordmark" href="#top" aria-label="Next GEM home"><img className="nextGemIcon" src="./next-gem-icon.png" alt="" /><span className="nextGemText"><b><span className="nextWord">Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span></a>
        <a className="navButton" href="#/demo">Customer demo <span>↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroGlow" />
        <div className="heroCopy">
          <p className="eyebrow"><span /> THE BUSINESS IDEA</p>
          <h1>From 30 days<br /><em>to three minutes.</em></h1>
          <p className="lead">Opening a business account should not feel like waiting 30 days for a reply.</p>
          <p className="pitchHook"><b>One Tap. One Profile. One HSBC.</b> Turn a 30-day heartbreak into a three-minute match.</p>
          <div className="heroActions"><a className="primary" href="#/demo">Experience the journey <span>→</span></a></div>
          <p className="pitchTiming"><b>Onboard once.</b> Grow everywhere.</p>
        </div>

        <div className="heroVisual brandHeroVisual" aria-label="Next GEM holographic project identity">
          <div className="brandHalo" />
          <img className="brandHeroImage brandHeroLockup" src="./next-gem-full.png" alt="Next GEM — Greater, Easier, More" />
          <div className="brandPromise"><span><VisualIcon name="account" /></span><p><b>ACCOUNT NUMBER GOAL</b><strong>3 MIN</strong></p><i>READY TO MOVE</i></div>
        </div>

        <div className="landingPitch" aria-label="Next GEM pitch">
          {pitch.map((item) => <article key={item.number}><div className="pitchIcon"><VisualIcon name={item.icon} /></div><p>{item.number} · {item.label}</p><h2>{item.title}</h2><span>{item.copy}</span></article>)}
        </div>
        <div className="landingClose"><strong>Win the first date.</strong><span>Build a trusted relationship customers want to keep.</span><a href="#/demo">Open customer demo →</a></div>
      </section>
    </main>
  );
}
