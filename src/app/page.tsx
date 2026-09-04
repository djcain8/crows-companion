import { getCampaignOverview } from "@/data/campaigns";
import { calculatePooledGold, type CampaignOverview, type InstitutionSummary } from "@/domain/campaign";
import { PrimaryNav } from "@/components/primary-nav";

export const dynamic = "force-dynamic";

const descriptions: Record<string, string> = {
  alchemist: "Alchemy, identification, tools, and a place to practice the craft.",
  auction_house: "Unusual valuables change hands here, for better or worse.",
  barracks: "Hirelings, provisions, and steel for dangerous work.",
  blacksmith: "Weapons, armor, repairs, and the ringing village forge.",
  bookseller: "Spellbooks and lore salvaged from the ruins of Cornath.",
  crypt: "The dead remain useful to the Crows who remember them.",
  enchanter: "Enchantments, wards, and stranger applications of wild magic.",
  general_store: "The mundane supplies that keep a delve from becoming a funeral.",
  stables: "Pets, vehicles, feed, and repairs for the road beyond the walls.",
  temple: "Craft, prayer, healing, and bargains with the Three.",
  inn: "Beds, food, rumors, and games of dubious wisdom.",
};

function InstitutionCard({ institution }: { institution: InstitutionSummary }) {
  const boons = Array.isArray(institution.details.boons)
    ? (institution.details.boons as Array<{ name: string; uses: number }>)
    : [];

  return (
    <details className="institution-card">
      <summary>
        <span className="institution-level">Level {institution.level}</span>
        <strong>{institution.name}</strong>
        <span>{institution.stewardName ? `Steward: ${institution.stewardName}` : "No steward"}</span>
      </summary>
      <div className="institution-details">
        <p>{descriptions[institution.kind]}</p>
        {boons.length > 0 && (
          <p className="boons">Available boons: {boons.map((boon) => `${boon.name} (${boon.uses})`).join(", ")}</p>
        )}
      </div>
    </details>
  );
}

function EmptyState() {
  return (
    <main className="empty-state">
      <p className="eyebrow">Campaign unavailable</p>
      <h1>Crows Companion</h1>
      <p>Connect Supabase and apply the Gadwick migration to load the village.</p>
    </main>
  );
}

function Town({ campaign }: { campaign: CampaignOverview }) {
  const pooledGold = calculatePooledGold(campaign.characters);

  return (
    <main className="town-shell">
      <header className="topbar">
        <div className="brand">
          <span className="crow-mark" aria-hidden="true">C</span>
          <div><p>Crows Companion</p><strong>Castle {campaign.villageName}</strong></div>
        </div>
        <PrimaryNav current="town" />
      </header>

      <section className="town-stage" id="town">
        <div className="ruin-silhouette" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="town-heading">
          <p className="eyebrow">A village within the ruin</p>
          <h1>{campaign.villageName}</h1>
          <p>Castle towers above. Crypts descend below. Between them, humanity persists.</p>
        </div>
        <section className="institution-grid" aria-label="Gadwick institutions">
          {campaign.institutions.map((institution) => <InstitutionCard institution={institution} key={institution.id} />)}
        </section>
      </section>

      <aside className="roster" aria-label="Active Crows">
        <div className="panel-heading"><span>Party roster</span><small>{campaign.characters.length} active</small></div>
        {campaign.characters.length === 0 ? (
          <div className="roster-empty"><span aria-hidden="true">+</span><p>No Crows have entered Gadwick yet.</p><small>Character management arrives with Inventory.</small></div>
        ) : campaign.characters.map((character) => (
          <article className="character-row" key={character.id}>
            <div className="portrait-placeholder">{character.name.charAt(0)}</div>
            <div><strong>{character.name}</strong><span>{character.wounds} wounds</span></div>
            <b>{character.goldGc} gc</b>
          </article>
        ))}
      </aside>

      <footer className="resource-rail">
        <div><span>Pooled gold</span><strong>{pooledGold.toLocaleString()} gc</strong></div>
        <div><span>Prosperity</span><strong>{campaign.prosperity > 0 ? `+${campaign.prosperity}` : campaign.prosperity}</strong></div>
        <div><span>Village cycle</span><strong>{campaign.cycle}</strong></div>
        <div><span>Day</span><strong>{campaign.day} / 10</strong></div>
        <div className="event"><span>Current event</span><strong>{campaign.currentEvent ?? "An uneasy calm"}</strong></div>
      </footer>
    </main>
  );
}

export default async function Home() {
  const campaign = await getCampaignOverview();
  return campaign ? <Town campaign={campaign} /> : <EmptyState />;
}
