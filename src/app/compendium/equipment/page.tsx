import Link from "next/link";
import { equipmentEntries } from "@/domain/equipment";
import { EquipmentBrowser } from "./equipment-browser";
import { WeaponQualityReference } from "./weapon-quality-reference";

export default function EquipmentCompendiumPage() {
  return (
    <main className="compendium-shell">
      <header className="compendium-header">
        <div><p className="eyebrow">Player quick reference</p><h1>Equipment</h1><p>Starting gear, weapons, armor, alchemy items, and spellbooks from the public playtest inventory cards.</p></div>
        <nav><Link href="/">Town</Link><Link href="/characters">Crows</Link><Link href="/expedition">Expedition</Link></nav>
      </header>

      <nav className="compendium-tabs" aria-label="Compendium categories">
        <Link href="/compendium">Backgrounds <small>36</small></Link>
        <Link href="/compendium/traits">Starting Traits <small>36</small></Link>
        <span>Expertises <small>later</small></span>
        <Link className="active" href="/compendium/equipment" aria-current="page">Equipment <small>{equipmentEntries.length}</small></Link>
      </nav>

      <aside className="equipment-rules-note">
        <strong>Inventory at a glance</strong>
        <span>2 hands · 4 belt slots · 10 backpack slots</span>
        <p>Items larger than one slot must occupy adjacent slots in the same location. A stack shares one slot.</p>
      </aside>

      <EquipmentBrowser equipment={equipmentEntries} />
      <WeaponQualityReference />
    </main>
  );
}
