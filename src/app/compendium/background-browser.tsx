"use client";

import { useMemo, useState } from "react";
import type { BackgroundEntry } from "@/domain/compendium";

function BackgroundCard({ background }: { background: BackgroundEntry }) {
  return (
    <details className="compendium-card">
      <summary>
        <div><h2>{background.name}</h2><p>{background.description}</p></div>
        <div className="background-at-a-glance"><span><small>Characteristic</small>{background.characteristic}</span><span><small>Stamina</small>{background.stamina}</span></div>
        <span className="compendium-expand">Open</span>
      </summary>
      <div className="background-details">
        <dl>
          <div><dt>Characteristic at 2</dt><dd>{background.characteristic}</dd></div>
          <div><dt>Stamina</dt><dd>{background.stamina}</dd></div>
          <div><dt>Starting Trait</dt><dd>{background.trait}</dd></div>
          <div><dt>Expertises</dt><dd>{background.expertises}</dd></div>
          <div><dt>Equipment</dt><dd>{background.equipment}</dd></div>
        </dl>
        <p className="source-note">Characters Book for Playtest 2, page {background.page}</p>
      </div>
    </details>
  );
}

export function BackgroundBrowser({ backgrounds }: { backgrounds: BackgroundEntry[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return backgrounds;
    return backgrounds.filter((background) => Object.values(background).some((value) => String(value).toLocaleLowerCase().includes(needle)));
  }, [backgrounds, query]);

  return (
    <>
      <div className="compendium-tools">
        <label><span>Search backgrounds</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘Mind’, ‘Bow’, ‘healing potion’…" autoComplete="off" /></label>
        <p><strong>{results.length}</strong> of {backgrounds.length} backgrounds</p>
      </div>
      <section className="compendium-results" aria-live="polite" aria-label="Background search results">
        {results.map((background) => <BackgroundCard background={background} key={background.name} />)}
        {results.length === 0 && <div className="compendium-empty"><strong>No matching backgrounds.</strong><span>Try a name, characteristic, Trait, Expertise, or piece of equipment.</span></div>}
      </section>
    </>
  );
}
