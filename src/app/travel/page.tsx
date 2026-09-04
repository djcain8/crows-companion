import { PrimaryNav } from "@/components/primary-nav";
import { getTravelBoard } from "@/data/travel";
import { TravelBoard } from "./travel-board";

export const dynamic = "force-dynamic";

export default async function TravelPage() {
  const board = await getTravelBoard();
  return <main className="travel-shell"><header className="travel-header"><div><p className="eyebrow">Beyond Gadwick</p><h1>Overland Travel</h1><p>Plan the route, divide the work, and survive the night.</p></div><PrimaryNav current="travel" /></header><TravelBoard {...board} /></main>;
}
