import { PrimaryNav } from "@/components/primary-nav";
import { TravelMap } from "./travel-map";

const phases = ["Plan", "Assign", "Resolve", "Travel", "Camp & Rest"];

export default function TravelPage() {
  return (
    <main className="travel-shell">
      <header className="travel-header">
        <div>
          <p className="eyebrow">Beyond Gadwick</p>
          <h1>Overland Travel</h1>
          <p>Plan the route, divide the work, and survive the night.</p>
        </div>
        <PrimaryNav current="travel" />
      </header>

      <section className="journey-console" aria-labelledby="journey-title">
        <header className="journey-heading">
          <div>
            <span className="prototype-badge">Visual preview</span>
            <p>Current journey</p>
            <h2 id="journey-title">No journey underway</h2>
          </div>
          <div className="journey-day"><span>Travel day</span><strong>—</strong></div>
        </header>

        <section className="journey-vitals" aria-label="Journey status">
          <article><span>Traveling</span><strong>0 Crows</strong><small>Choose today&apos;s party</small></article>
          <article className="ration-vital"><span>Rations</span><strong>—</strong><small>Party rests remaining</small></article>
          <article><span>Lowest speed</span><strong>—</strong><small>No travelers selected</small></article>
          <article className="day-en"><span>Day · Travel EN</span><strong>—</strong><small>Set today&apos;s pace</small></article>
          <article className="night-en"><span>Night · Rest EN</span><strong>—</strong><small>Set today&apos;s pace</small></article>
          <article><span>Position</span><strong>Gadwick</strong><small>Party marker visible</small></article>
        </section>

        <ol className="travel-stepper" aria-label="Travel day phases">
          {phases.map((phase, index) => <li className={index === 0 ? "active" : ""} aria-current={index === 0 ? "step" : undefined} key={phase}><b>{index + 1}</b><span>{phase}</span></li>)}
        </ol>

        <div className="travel-layout">
          <section className="phase-workspace" aria-labelledby="phase-title">
            <header><div><p>Phase 1 of 5</p><h2 id="phase-title">Plan the day</h2></div><span>Day · Travel</span></header>
            <div className="phase-section party-preview">
              <div><span className="section-number">01</span><div><h3>Who is traveling?</h3><p>Select attending Crows from the registry. Absent and test characters stay safely out of the day.</p></div></div>
              <button type="button" disabled>Choose party</button>
            </div>
            <div className="phase-section">
              <div><span className="section-number">02</span><div><h3>Choose a pace</h3><p>Pace establishes movement and both encounter numbers before the day&apos;s roles modify them.</p></div></div>
              <div className="pace-preview" aria-label="Travel pace options">
                <article><span>Slow</span><strong>1 hex</strong><small>EN 8 · Role tests gain an edge</small></article>
                <article className="suggested"><span>Normal</span><strong>2 hexes</strong><small>EN 7 · No pace modifier</small></article>
                <article><span>Fast</span><strong>3 hexes</strong><small>EN 6 · Role tests take a bane</small></article>
              </div>
            </div>
            <footer><p>Shared controls and persistence arrive in the next implementation slice.</p><button type="button" disabled>Continue to assignments <span>→</span></button></footer>
          </section>

          <aside className="travel-map-panel">
            <header><div><p>Known world</p><h2>Cornath</h2></div><span>Position known</span></header>
            <TravelMap />
          </aside>
        </div>

        <details className="travel-day-record">
          <summary><span>Today&apos;s record</span><small>No decisions recorded</small><i>⌄</i></summary>
          <div><p>Pace, roles, resolved tests, encounter checks, interruptions, and Ref notes will collect here as the day unfolds.</p></div>
        </details>
      </section>
    </main>
  );
}
