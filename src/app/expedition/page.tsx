import Link from "next/link";
import { getExpeditionBoard } from "@/data/expedition";
import { ExpeditionBoard } from "./expedition-board";

export const dynamic = "force-dynamic";

export default async function ExpeditionPage() {
  const { maps, tokens, characters } = await getExpeditionBoard();

  return (
    <main className="expedition-shell">
      <header className="expedition-header">
        <div><p className="eyebrow">First expedition</p><h1>The Dungeon</h1><p>Shared battle maps for the Crows. Anyone at the table can place, move, or remove a marker.</p></div>
        <nav><Link href="/">Town</Link><Link href="/characters">Crows</Link><Link href="/compendium">Compendium</Link></nav>
      </header>
      <ExpeditionBoard maps={maps} initialTokens={tokens} characters={characters} />
    </main>
  );
}
