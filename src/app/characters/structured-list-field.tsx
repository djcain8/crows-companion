"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { expertiseNames, type ExpertiseEntry, type TraitEntry } from "@/domain/character";

export function ExpertiseField({ initialEntries }: { initialEntries: ExpertiseEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [name, setName] = useState("");
  const [uses, setUses] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const listId = useId();

  function addEntry() {
    const canonicalName = expertiseNames.find((candidate) => candidate.toLowerCase() === name.trim().toLowerCase());
    if (!canonicalName) {
      setError("Choose an expertise from the rules list.");
      return;
    }
    if (!Number.isInteger(uses) || uses < 0) {
      setError("Uses must be a non-negative whole number.");
      return;
    }

    setEntries((current) => [...current.filter((entry) => entry.name !== canonicalName), { name: canonicalName, uses }]);
    setName("");
    setUses(1);
    setError(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEntry();
    } else if (event.key === "Backspace" && name === "") {
      setEntries((current) => current.slice(0, -1));
    }
  }

  return (
    <div className="registry-field structured-field">
      <span>Expertises</span>
      <input type="hidden" name="expertises" value={entries.map((entry) => `${entry.name}: ${entry.uses}`).join("\n")} />
      <div className="pill-list" aria-live="polite">
        {entries.map((entry) => (
          <button type="button" className="entry-pill" key={entry.name} onClick={() => setEntries((current) => current.filter((item) => item.name !== entry.name))} aria-label={`Remove ${entry.name}`}>
            {entry.name} <b>×{entry.uses}</b><i aria-hidden="true">×</i>
          </button>
        ))}
      </div>
      <div className="entry-composer expertise-composer">
        <input aria-label="Expertise name" list={listId} value={name} onChange={(event) => { setName(event.target.value); setError(null); }} onKeyDown={handleKeyDown} placeholder="Search expertises…" />
        <datalist id={listId}>{expertiseNames.map((expertise) => <option value={expertise} key={expertise} />)}</datalist>
        <input aria-label="Expertise uses" className="uses-input" type="number" min={0} step={1} value={uses} onChange={(event) => setUses(event.target.valueAsNumber)} onKeyDown={handleKeyDown} />
        <button type="button" onClick={addEntry}>Add</button>
      </div>
      {error && <small className="field-error" role="alert">{error}</small>}
      <small>Select a rules expertise, enter its recorded uses, then press Enter or Add.</small>
    </div>
  );
}

export function TraitField({ initialEntries }: { initialEntries: TraitEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [value, setValue] = useState("");

  function addEntry() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const separator = trimmed.indexOf(":");
    const entry = separator === -1
      ? { name: trimmed, tree: null }
      : { tree: trimmed.slice(0, separator).trim() || null, name: trimmed.slice(separator + 1).trim() || trimmed };
    setEntries((current) => [...current.filter((item) => item.name !== entry.name || item.tree !== entry.tree), entry]);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEntry();
    } else if (event.key === "Backspace" && value === "") {
      setEntries((current) => current.slice(0, -1));
    }
  }

  return (
    <div className="registry-field structured-field">
      <span>Traits</span>
      <input type="hidden" name="traits" value={entries.map((entry) => entry.tree ? `${entry.tree}: ${entry.name}` : entry.name).join("\n")} />
      <div className="pill-list" aria-live="polite">
        {entries.map((entry) => {
          const label = entry.tree ? `${entry.tree}: ${entry.name}` : entry.name;
          return <button type="button" className="entry-pill" key={label} onClick={() => setEntries((current) => current.filter((item) => item.name !== entry.name || item.tree !== entry.tree))} aria-label={`Remove ${label}`}>{label}<i aria-hidden="true">×</i></button>;
        })}
      </div>
      <div className="entry-composer">
        <input aria-label="Trait" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleKeyDown} placeholder="Tree: Trait name" />
        <button type="button" onClick={addEntry}>Add</button>
      </div>
      <small>Structural capture only; trait-tree rules validation comes later.</small>
    </div>
  );
}
