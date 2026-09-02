"use client";

import { useMemo, useState } from "react";
import { equipmentEntries } from "@/domain/equipment";
import { inventoryItem, inventorySpeedPenalty, type CharacterInventory, type InventoryItem } from "@/domain/character";
import { canMergeItems, canPlaceItem, deleteInventoryItem, inventoryGroupColumns, mergeItems, placeItem, requiredSlots, splitItem, storeItem, swapItems } from "@/domain/inventory-placement";
import type { InventoryGroup } from "@/domain/inventory";

const groups: { key: InventoryGroup; title: string }[] = [
  { key: "hands", title: "Hands" }, { key: "belt", title: "Belt" }, { key: "backpack", title: "Backpack" },
];

function InventoryGroupView({ inventory, group, selected, onSelect, onPlace, onWound }: {
  inventory: CharacterInventory; group: InventoryGroup; selected: string | null;
  onSelect: (id: string) => void; onPlace: (index: number) => void; onWound: (index: number) => void;
}) {
  const columns = inventoryGroupColumns[group];
  return <section className={`inventory-board ${group}`}>
    <header><h3>{groups.find((entry) => entry.key === group)?.title}</h3><span>{inventory[group].length} slots</span></header>
    <div className="inventory-board-grid" style={{ "--inventory-columns": inventoryGroupColumns[group] } as React.CSSProperties}>
      {inventory[group].map((slot, index) => {
        const item = inventoryItem(inventory, slot.itemId);
        if (!item) return <button type="button" className={`inventory-empty ${selected && canPlaceItem(inventory, selected, group, index) ? "available" : ""}`} onClick={() => onPlace(index)} key={index}><small>{index + 1}</small><span>Empty</span></button>;
        const first = inventory[group].findIndex((entry) => entry.itemId === item.id);
        if (index !== first && index % columns !== 0) return null;
        const total = requiredSlots(item, group);
        const span = Math.min(total - (index - first), columns - (index % columns));
        const continuation = index !== first;
        return <button type="button" className={`inventory-item-tile ${continuation ? "continuation" : ""} ${selected === item.id ? "selected" : ""}`} style={{ gridColumn: `span ${span}` }} onClick={() => onSelect(item.id)} key={`${item.id}-${index}`}>
          <small>{index + 1}{span > 1 ? `–${index + span}` : ""}</small><strong>{continuation ? `↳ ${item.name}` : item.name}</strong>{!continuation && item.quantity > 1 && <b>×{item.quantity}</b>}
        </button>;
      })}
    </div>
    {group === "backpack" && <div className="wound-grid">
      {inventory.backpack.map((slot, index) => <button type="button" className={slot.wound ? "wounded" : ""} onClick={() => onWound(index)} key={index}><span>{index + 1}</span>{slot.wound ? "Wound" : "+ Wound"}</button>)}
    </div>}
  </section>;
}

function StoredItems({ title, ids, inventory, selected, onSelect }: { title: string; ids: string[]; inventory: CharacterInventory; selected: string | null; onSelect: (id: string) => void }) {
  return <section className="inventory-storage"><header><h3>{title}</h3><span>{ids.length}</span></header><div>
    {ids.length ? ids.map((id) => { const item = inventoryItem(inventory, id); return item && <button type="button" className={selected === id ? "selected" : ""} onClick={() => onSelect(id)} key={id}><strong>{item.name}</strong>{item.quantity > 1 && <span>×{item.quantity}</span>}</button>; }) : <p>Empty</p>}
  </div></section>;
}

export function InventoryEditor({ initialInventory, baseSpeed }: { initialInventory: CharacterInventory; baseSpeed: number }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [selected, setSelected] = useState<string | null>(null);
  const [catalogName, setCatalogName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const selectedItem = inventoryItem(inventory, selected);
  const penalty = inventorySpeedPenalty(inventory);
  const errors = useMemo(() => inventory.items.length - new Set([...inventory.hands, ...inventory.belt, ...inventory.backpack].map((slot) => slot.itemId).filter(Boolean)).size - inventory.storage.townChest.length - inventory.storage.unassigned.length, [inventory]);

  function mutateItem(patch: Partial<InventoryItem>) {
    if (!selectedItem) return;
    let next = { ...inventory, items: inventory.items.map((item) => item.id === selectedItem.id ? { ...item, ...patch } : item) };
    const carried = groups.find(({ key }) => next[key].some((slot) => slot.itemId === selectedItem.id));
    if (carried) {
      const start = next[carried.key].findIndex((slot) => slot.itemId === selectedItem.id);
      const moved = placeItem(next, selectedItem.id, carried.key, start);
      next = moved ?? storeItem(next, selectedItem.id, "unassigned");
    }
    setInventory(next);
  }

  function addItem() {
    const catalog = equipmentEntries.find((entry) => entry.name.toLocaleLowerCase() === catalogName.trim().toLocaleLowerCase());
    const name = catalog?.name ?? catalogName.trim();
    if (!name) return;
    const item: InventoryItem = { id: crypto.randomUUID(), catalogId: catalog?.id ?? null, name, quantity: 1, slots: catalog?.slots ?? 1, stackLimit: catalog?.stack ?? 1, description: catalog?.summary ?? catalog?.rules ?? null, valueGc: catalog?.priceGc ?? null, contentsGc: null, notes: null };
    setInventory((current) => ({ ...current, items: [...current.items, item], storage: { ...current.storage, unassigned: [...current.storage.unassigned, item.id] } }));
    setSelected(item.id); setCatalogName("");
  }

  function place(group: InventoryGroup, index: number) { if (selected) { const next = placeItem(inventory, selected, group, index); if (next) { setInventory(next); setMessage(null); } } }
  function selectOrSwap(itemId: string) {
    if (!selected || selected === itemId) { setSelected(selected === itemId ? null : itemId); setMessage(null); return; }
    const source = inventoryItem(inventory, selected);
    const target = inventoryItem(inventory, itemId);
    if (source && target && canMergeItems(source, target)) {
      const merged = mergeItems(inventory, selected, itemId);
      if (merged) { setInventory(merged); setSelected(itemId); setMessage(`${source.name} stacks combined.`); }
      else setMessage("That stack needs more adjacent space before it can be combined.");
      return;
    }
    const next = swapItems(inventory, selected, itemId);
    if (next) { setInventory(next); setMessage("Items swapped."); }
    else setMessage("Those items cannot fit in each other’s spaces.");
  }
  function wound(index: number) { setInventory((current) => ({ ...current, backpack: current.backpack.map((slot, slotIndex) => slotIndex === index ? { ...slot, wound: !slot.wound } : slot) })); }

  return <div className="inventory-editor">
    <input type="hidden" name="inventory_json" value={JSON.stringify(inventory)} />
    <div className="inventory-status"><span>{selectedItem ? <>Moving <strong>{selectedItem.name}</strong> — choose a destination.</> : "Select an item to move or edit it."}</span><b className={penalty ? "penalized" : ""}>Speed {Math.max(0, baseSpeed - penalty)}{penalty ? ` (${baseSpeed} − ${penalty})` : ""}</b></div>
    <div className="inventory-layout">
      <div className="inventory-carried">{groups.map(({ key }) => <InventoryGroupView inventory={inventory} group={key} selected={selected} onSelect={selectOrSwap} onPlace={(index) => place(key, index)} onWound={wound} key={key} />)}</div>
      <aside className="inventory-sidebar">
        <StoredItems title="Town chest" ids={inventory.storage.townChest} inventory={inventory} selected={selected} onSelect={selectOrSwap} />
        <StoredItems title="Unassigned" ids={inventory.storage.unassigned} inventory={inventory} selected={selected} onSelect={selectOrSwap} />
        {selectedItem && <section className="inventory-inspector"><header><h3>Edit item</h3><button type="button" onClick={() => setSelected(null)}>×</button></header>
          <label>Name<input value={selectedItem.name} onChange={(event) => mutateItem({ name: event.target.value })} /></label>
          <div><label>Quantity<input type="number" min="1" value={selectedItem.quantity} onChange={(event) => mutateItem({ quantity: Math.max(1, Number(event.target.value) || 1) })} /></label><label>Per stack<input type="number" min="1" value={selectedItem.stackLimit} onChange={(event) => mutateItem({ stackLimit: Math.max(1, Number(event.target.value) || 1) })} /></label><label>Slots<input type="number" min="1" max="10" value={selectedItem.slots} onChange={(event) => mutateItem({ slots: Math.max(1, Number(event.target.value) || 1) })} /></label><label>Loot value (gc)<input type="number" min="0" value={selectedItem.valueGc ?? ""} placeholder="Unknown" onChange={(event) => mutateItem({ valueGc: event.target.value === "" ? null : Math.max(0, Number(event.target.value) || 0) })} /></label></div>
          <label>Description<textarea value={selectedItem.description ?? ""} onChange={(event) => mutateItem({ description: event.target.value || null })} /></label>
          <div className="inventory-item-actions">{selectedItem.quantity > 1 && <button type="button" onClick={() => { const id = crypto.randomUUID(); const next = splitItem(inventory, selectedItem.id, 1, id); if (next) { setInventory(next); setSelected(id); setMessage("Split one item into Unassigned."); } }}>Split 1</button>}<button type="button" onClick={() => setInventory(storeItem(inventory, selectedItem.id, "townChest"))}>Town chest</button><button type="button" onClick={() => setInventory(storeItem(inventory, selectedItem.id, "unassigned"))}>Unassign</button><button type="button" className="danger" onClick={() => { if (window.confirm(`Delete ${selectedItem.name}?`)) { setInventory(deleteInventoryItem(inventory, selectedItem.id)); setSelected(null); } }}>Delete</button></div>
        </section>}
        <section className="inventory-add"><h3>Add item</h3><div><input list="equipment-catalog" value={catalogName} onChange={(event) => setCatalogName(event.target.value)} placeholder="Catalog or custom name" /><button type="button" onClick={addItem}>Add</button></div><datalist id="equipment-catalog">{equipmentEntries.map((item) => <option value={item.name} key={item.id} />)}</datalist><p>Catalog matches fill in the rules; any other name creates a custom item.</p></section>
      </aside>
    </div>
    {errors > 0 && <p className="inventory-warning">{errors} item{errors === 1 ? " has" : "s have"} no location. Move them to a slot or storage before saving.</p>}
    {message && <p className="inventory-message">{message}</p>}
  </div>;
}
