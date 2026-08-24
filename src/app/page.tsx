const foundations = [
  ["Town", "Interactive village and institution management"],
  ["Inventory", "Shared equipment, treasure, and supplies"],
  ["Expedition", "Future maps, tokens, and party movement"],
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--ember)]">Foundation online</p>
      <h1 className="max-w-3xl text-5xl leading-tight sm:text-7xl">Crows Companion</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        The campaign shell is ready. The village survives; individual Crows are less fortunate.
      </p>
      <section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="Planned screens">
        {foundations.map(([name, description]) => (
          <article key={name} className="rounded-sm border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-xl">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

