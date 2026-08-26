import Link from "next/link";
import { getCharacterRegistry } from "@/data/campaigns";
import { CharacterForm } from "./character-form";

export const dynamic = "force-dynamic";

export default async function CharactersPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const [characters, params] = await Promise.all([getCharacterRegistry(), searchParams]);
  const activeCount = characters.filter((character) => character.status === "active").length;

  return (
    <main className="registry-shell">
      <header className="registry-header">
        <div>
          <p className="eyebrow">Gadwick records</p>
          <h1>The Crows</h1>
          <p>Transcribe an existing character now. Rules-guided creation can use the same record later.</p>
        </div>
        <Link href="/">Return to town</Link>
      </header>

      {params.notice && <p className="notice" role="status">{params.notice}</p>}
      {params.error && <p className="notice error-notice" role="alert">{params.error}</p>}

      <section className="registry-summary" aria-label="Roster summary">
        <div><span>Active Crows</span><strong>{activeCount}</strong></div>
        <div><span>Recorded</span><strong>{characters.length}</strong></div>
        <div><span>Pooled gold</span><strong>{characters.filter((character) => character.status === "active").reduce((sum, character) => sum + character.goldGc, 0).toLocaleString()} gc</strong></div>
      </section>

      <section className="registry-list" aria-label="Character registry">
        {characters.map((character) => (
          <details className="character-editor" key={character.id}>
            <summary>
              <span className={`status-dot ${character.status}`} aria-hidden="true" />
              <div><strong>{character.name}</strong><span>{character.background ?? "Background not recorded"}</span></div>
              <dl>
                <div><dt>Stamina</dt><dd>{character.staminaCurrent} / {character.staminaMax}</dd></div>
                <div><dt>Speed</dt><dd>{character.baseSpeed} base</dd></div>
                <div><dt>TXP</dt><dd>{character.txp.toLocaleString()}</dd></div>
                <div><dt>Gold</dt><dd>{character.goldGc.toLocaleString()} gc</dd></div>
              </dl>
              <span className="edit-label">Edit</span>
            </summary>
            <CharacterForm character={character} />
          </details>
        ))}

        {characters.length === 0 && (
          <div className="registry-empty"><strong>No Crows recorded yet.</strong><span>Add the first existing character below.</span></div>
        )}
      </section>

      <details className="new-character" open={characters.length === 0}>
        <summary><span>+</span> Manually add a Crow</summary>
        <CharacterForm />
      </details>
    </main>
  );
}
