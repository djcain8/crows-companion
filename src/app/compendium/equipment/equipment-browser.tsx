"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { equipmentCategories, type EquipmentCategory, type EquipmentEntry } from "@/domain/equipment";

const categoryLabels: Record<EquipmentCategory, string> = {
  gear: "Gear",
  alchemy: "Alchemy",
  weapon: "Weapons",
  armor: "Armor",
  spellbook: "Spellbooks",
};

function EquipmentCard({ item }: { item: EquipmentEntry }) {
  return (
    <article className={`equipment-card category-${item.category}`}>
      <header>
        <div><span>{categoryLabels[item.category]}</span><h2>{item.name}</h2></div>
        {item.priceGc === null ? <strong>Currency</strong> : <strong className="equipment-price">{item.priceGc.toLocaleString()}<Image src="/icons/gold-coin.png" alt="gold coins" width={20} height={20} /></strong>}
      </header>
      <div className="equipment-card-stats">
        <span><small>Slots</small><b>{item.slots}</b></span>
        <span><small>Stack</small><b>{item.stack}</b></span>
      </div>
      {item.attack ? (
        <section className="weapon-attack" aria-label={`${item.name} attack`}>
          <div className="weapon-attack-heading"><i>{item.attack.range}</i><strong>Attack {item.attack.roll}</strong></div>
          <div className="weapon-tier-grid">
            <span><small>≤11</small><b>Miss</b></span>
            <span><small>12–16</small><b>{item.attack.tier2}</b></span>
            <span><small>17+</small><b>{item.attack.tier3}</b></span>
          </div>
          <p>{item.attack.qualities.join(", ")}</p>
        </section>
      ) : null}
      {item.tags?.length ? <div className="equipment-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
      {item.summary ? <p>{item.summary}</p> : null}
      {item.rules ? <small className="equipment-rules">{item.rules}</small> : null}
    </article>
  );
}

export function EquipmentBrowser({ equipment }: { equipment: EquipmentEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EquipmentCategory | "all">("all");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return equipment.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!needle) return true;
      return [item.name, item.category, item.summary, item.rules, item.attack?.roll, item.attack?.range, item.attack?.tier2, item.attack?.tier3, ...(item.attack?.qualities ?? []), ...(item.tags ?? [])]
        .some((value) => value?.toLocaleLowerCase().includes(needle));
    });
  }, [category, equipment, query]);

  return (
    <>
      <div className="compendium-tools equipment-tools">
        <label><span>Search equipment</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘healing’, ‘Parry’, ‘light’, or ‘UD’…" autoComplete="off" /></label>
        <label className="equipment-filter"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value as EquipmentCategory | "all")}><option value="all">All equipment</option>{equipmentCategories.map((value) => <option value={value} key={value}>{categoryLabels[value]}</option>)}</select></label>
        <p><strong>{results.length}</strong> of {equipment.length} cards</p>
      </div>
      <section className="equipment-results" aria-live="polite" aria-label="Equipment search results">
        {results.map((item) => <EquipmentCard item={item} key={item.id} />)}
        {results.length === 0 ? <div className="compendium-empty"><strong>No matching equipment.</strong><span>Try another name, category, property, or rule term.</span></div> : null}
      </section>
    </>
  );
}
