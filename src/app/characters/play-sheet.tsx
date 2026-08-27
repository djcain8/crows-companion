import { inventorySlotCounts, type CharacterRecord, type InventorySlot } from "@/domain/character";
import { updatePlaySheet } from "./actions";

function Slot({ group, index, slot, wounds = false }: {
  group: "hands" | "belt" | "backpack";
  index: number;
  slot: InventorySlot;
  wounds?: boolean;
}) {
  return (
    <div className={`inventory-slot ${slot?.kind === "wound" ? "wound-slot" : ""}`}>
      <span className="slot-number">{index + 1}</span>
      <input aria-label={`${group} slot ${index + 1}`} name={`inventory_${group}_${index}`} defaultValue={slot?.name ?? ""} placeholder="Empty" />
      {wounds && (
        <select aria-label={`${group} slot ${index + 1} type`} name={`inventory_${group}_${index}_kind`} defaultValue={slot?.kind ?? "item"}>
          <option value="item">Item</option>
          <option value="wound">Wound</option>
        </select>
      )}
    </div>
  );
}

function SlotGroup({ title, group, slots, wounds = false }: {
  title: string;
  group: "hands" | "belt" | "backpack";
  slots: InventorySlot[];
  wounds?: boolean;
}) {
  return (
    <section className={`inventory-group ${group}`}>
      <div className="inventory-heading"><h3>{title}</h3><span>{inventorySlotCounts[group]} slots</span></div>
      <div className="inventory-slots">
        {slots.map((slot, index) => <Slot group={group} index={index} slot={slot} wounds={wounds} key={index} />)}
      </div>
    </section>
  );
}

export function PlaySheet({ character }: { character: CharacterRecord }) {
  const action = updatePlaySheet.bind(null, character.id, character.staminaMax);
  const wounds = character.inventory.backpack.filter((slot) => slot?.kind === "wound").length;

  return (
    <div className="play-sheet">
      <section className="play-vitals" aria-label={`${character.name} statistics`}>
        <div className="attribute-block"><span>Agility</span><strong>{character.agility}</strong></div>
        <div className="attribute-block"><span>Mind</span><strong>{character.mind}</strong></div>
        <div className="attribute-block"><span>Strength</span><strong>{character.strength}</strong></div>
        <div className="attribute-block"><span>Speed</span><strong>{character.baseSpeed}</strong><small>base</small></div>
        <div className="attribute-block"><span>Wounds</span><strong>{wounds}</strong><small>in pack</small></div>
      </section>

      <div className="play-reference-grid">
        <section><h3>Expertises</h3><div className="reference-pills">{character.expertises.length ? character.expertises.map((entry) => <span key={entry.name}>{entry.name} <b>{entry.uses}</b></span>) : <i>None recorded</i>}</div></section>
        <section><h3>Traits</h3><div className="reference-pills">{character.traits.length ? character.traits.map((entry) => <span key={`${entry.tree}:${entry.name}`}>{entry.name}{entry.tree && <small>{entry.tree}</small>}</span>) : <i>None recorded</i>}</div></section>
      </div>

      <form action={action} className="field-kit-form">
        <div className="field-kit-resources">
          <label><span>Current Stamina</span><div><input name="stamina_current" type="number" min={0} max={character.staminaMax} defaultValue={character.staminaCurrent} /><b>/ {character.staminaMax}</b></div></label>
          <label><span>Gold</span><div><input name="gold_gc" type="number" min={0} defaultValue={character.goldGc} /><b>gc</b></div></label>
        </div>
        <div className="inventory-grid">
          <div className="carried-slots">
            <SlotGroup title="Hands" group="hands" slots={character.inventory.hands} />
            <SlotGroup title="Belt" group="belt" slots={character.inventory.belt} />
          </div>
          <SlotGroup title="Backpack" group="backpack" slots={character.inventory.backpack} wounds />
        </div>
        <div className="field-kit-actions"><p>Wounds occupy backpack slots. Speed penalties from overlapping items are still tracked manually.</p><button type="submit">Save field kit</button></div>
      </form>
    </div>
  );
}
