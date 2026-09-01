import Link from "next/link";
import { startingTraitEntries } from "@/domain/compendium";
import { TraitBrowser } from "./trait-browser";

export default function StartingTraitsPage() {
  return (
    <main className="compendium-shell">
      <header className="compendium-header">
        <div><p className="eyebrow">Player quick reference</p><h1>Compendium</h1><p>Starting Traits granted by the 36 Backgrounds in the August–September 2026 public playtest.</p></div>
        <nav><Link href="/">Town</Link><Link href="/characters">Crows</Link><Link href="/expedition">Expedition</Link></nav>
      </header>
      <nav className="compendium-tabs" aria-label="Compendium categories">
        <Link href="/compendium">Backgrounds <small>36</small></Link>
        <Link className="active" href="/compendium/traits" aria-current="page">Starting Traits <small>36</small></Link>
        <span>Expertises <small>later</small></span>
        <Link href="/compendium/equipment">Equipment</Link>
      </nav>
      <TraitBrowser traits={startingTraitEntries} />
    </main>
  );
}
