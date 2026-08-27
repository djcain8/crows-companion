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

      <div className="compendium-tabs" role="tablist" aria-label="Compendium categories">
        <button className="active" role="tab" aria-selected="true">Backgrounds <small>36</small></button>
        <button disabled role="tab" aria-selected="false">Traits <small>later</small></button>
        <button disabled role="tab" aria-selected="false">Expertises <small>later</small></button>
        <button disabled role="tab" aria-selected="false">Equipment <small>later</small></button>
      </div>

      <aside className="universal-kit">
        <div><span>Every Crow begins with</span><strong>Coin purse · Knife · Rope · 6 rations · 3d6 gc</strong></div>
        <p>Background equipment is added to this universal starting kit.</p>
      </aside>

      <BackgroundBrowser backgrounds={backgroundEntries} />
    </main>
  );
}
