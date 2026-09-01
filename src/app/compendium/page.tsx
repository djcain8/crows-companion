import Link from "next/link";
import { backgroundEntries } from "@/domain/compendium";
import { BackgroundBrowser } from "./background-browser";

export default function CompendiumPage() {
  return (
    <main className="compendium-shell">
      <header className="compendium-header">
        <div><p className="eyebrow">Player quick reference</p><h1>Compendium</h1><p>Concise character-facing rules for the August–September 2026 public playtest.</p></div>
        <nav><Link href="/">Town</Link><Link href="/characters">Crows</Link><Link href="/expedition">Expedition</Link></nav>
      </header>

      <nav className="compendium-tabs" aria-label="Compendium categories">
        <Link className="active" href="/compendium" aria-current="page">Backgrounds <small>36</small></Link>
        <Link href="/compendium/traits">Starting Traits <small>36</small></Link>
        <span>Expertises <small>later</small></span>
        <Link href="/compendium/equipment">Equipment</Link>
      </nav>

      <aside className="universal-kit">
        <div><span>Every Crow begins with</span><strong>Coin purse · Knife · Rope · 6 rations · 3d6 gc</strong></div>
        <p>Background equipment is added to this universal starting kit.</p>
      </aside>

      <BackgroundBrowser backgrounds={backgroundEntries} />
    </main>
  );
}
