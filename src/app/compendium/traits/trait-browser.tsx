"use client";

import { useMemo, useState } from "react";
import { traitId, type StartingTraitEntry } from "@/domain/compendium";

export function TraitBrowser({ traits }: { traits: StartingTraitEntry[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return traits;
    return traits.filter((trait) => Object.values(trait).some((value) => String(value).toLocaleLowerCase().includes(needle)));
  }, [query, traits]);

  return (
    <>
      <div className="compendium-tools">
        <label><span>Search starting Traits</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘reaction’, ‘crafting’, ‘Armor’…" autoComplete="off" /></label>
        <p><strong>{results.length}</strong> of {traits.length} starting Traits</p>
      </div>
      <section className="trait-results" aria-live="polite" aria-label="Starting Trait search results">
        {results.map((trait) => (
          <article className="trait-card" id={traitId(trait.name)} key={trait.name}>
            <header><div><span>{trait.tree}</span><h2>{trait.name}</h2></div><b>Starting · 500 XP</b></header>
            <p>{trait.effect}</p>
            <small>Characters Book for Playtest 2, page {trait.page}</small>
          </article>
        ))}
        {results.length === 0 && <div className="compendium-empty"><strong>No matching starting Traits.</strong><span>Try a Trait name, tree, action, or rules term.</span></div>}
      </section>
    </>
  );
}
