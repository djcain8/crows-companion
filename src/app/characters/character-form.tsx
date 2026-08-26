import { characterStatuses, type CharacterRecord } from "@/domain/character";
import { createCharacter, updateCharacter } from "./actions";

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
  const expertiseText = character?.expertises.map((entry) => `${entry.name}: ${entry.uses}`).join("\n") ?? "";
  const traitText = character?.traits.map((entry) => entry.tree ? `${entry.tree}: ${entry.name}` : entry.name).join("\n") ?? "";

  return (
    <form action={action} className="character-form">
      <section className="form-section">
        <h3>Identity</h3>
        <div className="form-grid two-columns">
          <Field label="Crow name" name="name" required defaultValue={character?.name} />
          <Field label="Player" name="player_name" defaultValue={character?.playerName} />
          <Field label="Background" name="background" defaultValue={character?.background} hint="The rules use backgrounds, not classes." />
          <label className="registry-field">
            <span>Status</span>
            <select name="status" defaultValue={character?.status ?? "active"}>
              {characterStatuses.map((status) => <option value={status} key={status}>{status}</option>)}
            </select>
          </label>
        </div>
        <label className="registry-field">
          <span>Distinguishing feature</span>
          <input name="distinguishing_feature" defaultValue={character?.distinguishingFeature ?? ""} />
        </label>
        <label className="registry-field">
          <span>Notes</span>
          <textarea name="summary" rows={2} defaultValue={character?.summary ?? ""} />
        </label>
      </section>

      <section className="form-section">
        <h3>Statistics</h3>
        <div className="stat-form-grid">
          <Field label="Agility" name="agility" type="number" min={-1} max={4} defaultValue={character?.agility ?? 0} />
          <Field label="Mind" name="mind" type="number" min={-1} max={4} defaultValue={character?.mind ?? 0} />
          <Field label="Strength" name="strength" type="number" min={-1} max={4} defaultValue={character?.strength ?? 0} />
          <Field label="Current Stamina" name="stamina_current" type="number" min={0} defaultValue={character?.staminaCurrent ?? 0} />
          <Field label="Maximum Stamina" name="stamina_max" type="number" min={0} defaultValue={character?.staminaMax ?? 0} />
          <Field label="Base Speed" name="base_speed" type="number" min={0} defaultValue={character?.baseSpeed ?? 5} hint="Temporary effects and Wound penalties come later." />
          <Field label="Total XP (TXP)" name="txp" type="number" min={0} defaultValue={character?.txp ?? 0} />
          <Field label="Spent XP" name="spent_xp" type="number" min={0} defaultValue={character?.spentXp ?? 0} />
          <Field label="Gold (gc)" name="gold_gc" type="number" min={0} defaultValue={character?.goldGc ?? 0} />
        </div>
      </section>

      <section className="form-section split-section">
        <label className="registry-field">
          <span>Expertises</span>
          <textarea name="expertises" rows={6} defaultValue={expertiseText} placeholder={'Search: 2\nNavigate: 1'} />
          <small>One per line. Add uses after a colon; defaults to 1.</small>
        </label>
        <label className="registry-field">
          <span>Traits</span>
          <textarea name="traits" rows={6} defaultValue={traitText} placeholder={'Travel: Orienteering\nMidnight Oil'} />
          <small>One per line. Optionally prefix the trait tree.</small>
        </label>
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
        <button type="submit">{character ? "Save character" : "Add Crow to Gadwick"}</button>
      </div>
    </form>
  );
}
