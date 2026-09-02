"use client";

import { useState } from "react";
import { backgrounds, characterStatuses, type CharacterRecord } from "@/domain/character";
import { backgroundGrantByName, backgroundGrants, type BackgroundGrant } from "@/domain/background-grants";
import { createCharacter, updateCharacter } from "./actions";
import { ExpertiseField, TraitField } from "./structured-list-field";

function Field({ label, name, defaultValue, type = "text", min, max, required, hint }: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  min?: number;
  max?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="registry-field">
      <span>{label}</span>
      <input name={name} type={type} min={min} max={max} required={required} defaultValue={defaultValue ?? ""} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function CharacterForm({ character }: { character?: CharacterRecord }) {
  const action = character ? updateCharacter.bind(null, character.id) : createCharacter;
  const backgroundListId = `backgrounds-${character?.id ?? "new"}`;
  const backgroundPattern = backgrounds.join("|");
  const [selectedBackground, setSelectedBackground] = useState(character?.background ?? "");
  const [primaryCharacteristic, setPrimaryCharacteristic] = useState<"Agility" | "Mind" | "Strength">("Agility");
  const [spread, setSpread] = useState<"1,0" | "2,-1">("1,0");
  const [higherRemaining, setHigherRemaining] = useState<"Agility" | "Mind" | "Strength">("Mind");
  const [applied, setApplied] = useState<{ background: string; agility: number; mind: number; strength: number; gold: number; grant: BackgroundGrant } | null>(null);
  const [revision, setRevision] = useState(0);
  const grant = backgroundGrantByName.get(selectedBackground);

  function chooseBackground(value: string) {
    const next = backgroundGrantByName.get(value);
    setSelectedBackground(value);
    setApplied(null);
    setRevision((current) => current + 1);
    if (next) {
      setPrimaryCharacteristic(next.characteristicOptions[0]);
      setHigherRemaining((["Agility", "Mind", "Strength"] as const).find((entry) => entry !== next.characteristicOptions[0]) ?? "Agility");
    }
  }

  function rollBackground() {
    const first = Math.floor(Math.random() * 6);
    const second = Math.floor(Math.random() * 6);
    chooseBackground(backgroundGrants[first * 6 + second].name);
  }

  function applyPackage() {
    if (!grant) return;
    const remaining = (["Agility", "Mind", "Strength"] as const).filter((entry) => entry !== primaryCharacteristic);
    const validHigher = remaining.includes(higherRemaining) ? higherRemaining : remaining[0];
    const [high, low] = spread.split(",").map(Number);
    const scores = { Agility:0, Mind:0, Strength:0 };
    scores[primaryCharacteristic] = 2;
    scores[validHigher] = high;
    scores[remaining.find((entry) => entry !== validHigher)!] = low;
    const rolledGold = Array.from({ length:3 }, () => Math.floor(Math.random() * 6) + 1).reduce((sum, die) => sum + die, 0);
    setApplied({ background:grant.name, agility:scores.Agility, mind:scores.Mind, strength:scores.Strength, gold:rolledGold + grant.extraGoldGc, grant });
    setRevision((current) => current + 1);
  }

  return (
    <form action={action} className="character-form">
      <section className="form-section">
        <h3>Identity</h3>
        <div className="form-grid two-columns">
          <Field label="Crow name" name="name" required defaultValue={character?.name} />
          <Field label="Player" name="player_name" defaultValue={character?.playerName} />
          <label className="registry-field">
            <span>Background</span>
            <input name="background" list={backgroundListId} pattern={backgroundPattern} title="Choose a background from the playtest list." value={selectedBackground} onChange={(event) => chooseBackground(event.target.value)} placeholder="Search backgrounds…" />
            <datalist id={backgroundListId}>{backgrounds.map((background) => <option value={background} key={background} />)}</datalist>
            <small>Choose one of the 36 playtest backgrounds.</small>
          </label>
          <label className="registry-field">
            <span>Status</span>
            <select name="status" defaultValue={character?.status ?? "active"}>
              {characterStatuses.map((status) => <option value={status} key={status}>{status}</option>)}
            </select>
          </label>
        </div>
        {!character && <div className="background-assistant">
          <header><div><span>Background assistant</span><strong>{grant?.name ?? "Choose or roll a background"}</strong></div><button type="button" onClick={rollBackground}>Roll 2d6</button></header>
          {grant ? <>
            <p>{grant.description}</p>
            <div className="background-build-options">
              <label><span>Characteristic at 2</span><select value={primaryCharacteristic} onChange={(event) => { const value = event.target.value as typeof primaryCharacteristic; setPrimaryCharacteristic(value); setHigherRemaining((["Agility", "Mind", "Strength"] as const).find((entry) => entry !== value) ?? "Agility"); }}>{grant.characteristicOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
              <label><span>Remaining scores</span><select value={spread} onChange={(event) => setSpread(event.target.value as typeof spread)}><option value="1,0">1 and 0</option><option value="2,-1">2 and −1</option></select></label>
              <label><span>Higher remaining score</span><select value={higherRemaining} onChange={(event) => setHigherRemaining(event.target.value as typeof higherRemaining)}>{(["Agility", "Mind", "Strength"] as const).filter((entry) => entry !== primaryCharacteristic).map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
            </div>
            <dl><div><dt>Stamina</dt><dd>{grant.stamina}</dd></div><div><dt>Trait</dt><dd>{grant.trait.tree}: {grant.trait.name}</dd></div><div><dt>Expertises</dt><dd>{grant.expertises.map((entry) => `${entry.name}${entry.uses > 1 ? ` (${entry.uses})` : ""}`).join(", ")}</dd></div><div><dt>Equipment</dt><dd>Universal kit plus {grant.equipment.map((item) => `${item.name}${item.quantity > 1 ? ` (${item.quantity})` : ""}`).join(", ")}{grant.extraGoldGc ? ` and ${grant.extraGoldGc} extra gc` : ""}</dd></div></dl>
            <button type="button" className="apply-background" onClick={applyPackage}>{applied?.background === grant.name ? "Re-roll gold and reapply" : "Apply starting package"}</button>
          </> : <p>Choose a background above or roll on the rules table. Nothing is applied until you review the package.</p>}
        </div>}
        <label className="registry-field">
          <span>Distinguishing feature</span>
          <input name="distinguishing_feature" defaultValue={character?.distinguishingFeature ?? ""} />
        </label>
        <label className="registry-field">
          <span>Notes</span>
          <textarea name="summary" rows={2} defaultValue={character?.summary ?? ""} />
        </label>
      </section>

      <section className="form-section" key={`statistics-${revision}`}>
        <h3>Statistics</h3>
        <div className="stat-form-grid">
          <Field label="Agility" name="agility" type="number" min={-1} max={4} defaultValue={applied?.agility ?? character?.agility ?? 0} />
          <Field label="Mind" name="mind" type="number" min={-1} max={4} defaultValue={applied?.mind ?? character?.mind ?? 0} />
          <Field label="Strength" name="strength" type="number" min={-1} max={4} defaultValue={applied?.strength ?? character?.strength ?? 0} />
          {character && <Field label="Current Stamina" name="stamina_current" type="number" min={0} defaultValue={character.staminaCurrent} />}
          <Field label="Maximum Stamina" name="stamina_max" type="number" min={0} defaultValue={applied?.grant.stamina ?? character?.staminaMax ?? 0} />
          <Field label="Base Speed" name="base_speed" type="number" min={0} defaultValue={character?.baseSpeed ?? 5} hint="Temporary effects and Wound penalties come later." />
          <Field label="Total XP (TXP)" name="txp" type="number" min={0} defaultValue={character?.txp ?? 0} />
          <Field label="Spent XP" name="spent_xp" type="number" min={0} defaultValue={character?.spentXp ?? 0} />
          <Field label="Gold (gc)" name="gold_gc" type="number" min={0} defaultValue={applied?.gold ?? character?.goldGc ?? 0} hint={!character ? "The assistant rolls the universal 3d6 and adds any background gold." : undefined} />
        </div>
      </section>

      <section className="form-section split-section" key={`grants-${revision}`}>
        <ExpertiseField initialEntries={applied?.grant.expertises ?? character?.expertises ?? []} />
        <TraitField initialEntries={applied ? [applied.grant.trait] : character?.traits ?? []} />
      </section>

      <section className="form-section">
        <h3>Village connection</h3>
        <div className="form-grid three-columns">
          <Field label="Connection name" name="connection_name" defaultValue={character?.connectionName} />
          <Field label="Relationship" name="connection_relationship" defaultValue={character?.connectionRelationship} />
          <Field label="Benefit" name="connection_benefit" defaultValue={character?.connectionBenefit} />
        </div>
      </section>

      <div className="form-actions">
        {!character && <input type="hidden" name="starting_inventory_background" value={applied?.background ?? ""} />}
        <button type="submit">{character ? "Save character" : "Add Crow to Gadwick"}</button>
      </div>
    </form>
  );
}
