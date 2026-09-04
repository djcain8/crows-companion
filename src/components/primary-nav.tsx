import Link from "next/link";

type PrimarySection = "town" | "crows" | "compendium" | "expedition";

const destinations: { section: PrimarySection; href: string; label: string }[] = [
  { section: "town", href: "/", label: "Town" },
  { section: "crows", href: "/characters", label: "Crows" },
  { section: "compendium", href: "/compendium", label: "Compendium" },
  { section: "expedition", href: "/expedition", label: "Expedition" },
];

export function PrimaryNav({ current }: { current: PrimarySection }) {
  return (
    <nav aria-label="Primary navigation">
      {destinations.map((destination) => (
        <Link className={destination.section === current ? "active" : undefined} href={destination.href} aria-current={destination.section === current ? "page" : undefined} key={destination.section}>
          {destination.label}
        </Link>
      ))}
    </nav>
  );
}
