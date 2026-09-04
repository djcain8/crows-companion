"use client";

import { useRef } from "react";

function MapCanvas({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={`travel-map ${expanded ? "expanded" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maps/travel/cornath.webp" alt="Regional hex map of Cornath with Gadwick and nearby points of interest" />
      <i className="party-map-marker" aria-label="Party at Gadwick">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/crow-map-marker.svg" alt="" />
      </i>
    </div>
  );
}

export function TravelMap() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="travel-map-frame">
        <MapCanvas />
        <button type="button" onClick={() => dialogRef.current?.showModal()}>Expand map</button>
      </div>
      <p className="map-caption">The shared marker begins at Gadwick. Later, the Ref can hide it when the party becomes lost.</p>

      <dialog className="travel-map-dialog" ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <header><div><p>Known world</p><h2>Cornath</h2></div><button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close expanded map">Close</button></header>
        <div className="travel-map-scroll"><MapCanvas expanded /></div>
      </dialog>
    </>
  );
}
