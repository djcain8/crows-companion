"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { clampTravelCoordinate } from "@/domain/travel";

type MarkerPosition = { x: number; y: number };

function MapCanvas({ expanded = false, marker, markerVisible, onMarkerPreview, onMarkerCommit }: {
  expanded?: boolean;
  marker: MarkerPosition;
  markerVisible: boolean;
  onMarkerPreview: (position: MarkerPosition) => void;
  onMarkerCommit: (position: MarkerPosition) => void;
}) {
  const dragging = useRef(false);

  function pointerPosition(event: PointerEvent<HTMLButtonElement>): MarkerPosition | null {
    const map = event.currentTarget.closest<HTMLElement>(".travel-map");
    if (!map) return null;
    const bounds = map.getBoundingClientRect();
    return { x: clampTravelCoordinate((event.clientX - bounds.left) / bounds.width), y: clampTravelCoordinate((event.clientY - bounds.top) / bounds.height) };
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>) {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = pointerPosition(event);
    if (position) onMarkerPreview(position);
  }

  function moveMarker(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    const position = pointerPosition(event);
    if (position) onMarkerPreview(position);
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    const position = pointerPosition(event) ?? marker;
    onMarkerPreview(position);
    onMarkerCommit(position);
  }

  return (
    <div className={`travel-map ${expanded ? "expanded" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maps/travel/cornath.webp" alt="Regional hex map of Cornath with Gadwick and nearby points of interest" />
      {markerVisible && <button className="party-map-marker" style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }} type="button" aria-label="Move the party marker" title="Drag to move the party" onPointerDown={beginDrag} onPointerMove={moveMarker} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/crow-map-marker.svg" alt="" draggable={false} />
      </button>}
    </div>
  );
}

export function TravelMap({ markerX, markerY, markerVisible, onMarkerChange, onVisibilityChange }: {
  markerX: number;
  markerY: number;
  markerVisible: boolean;
  onMarkerChange: (x: number, y: number) => void;
  onVisibilityChange: (visible: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [marker, setMarker] = useState({ x: markerX, y: markerY });
  useEffect(() => setMarker({ x: markerX, y: markerY }), [markerX, markerY]);

  const canvas = (expanded = false) => <MapCanvas expanded={expanded} marker={marker} markerVisible={markerVisible} onMarkerPreview={setMarker} onMarkerCommit={(position) => onMarkerChange(position.x, position.y)} />;

  return (
    <>
      <div className="travel-map-frame">
        {canvas()}
        <div className="travel-map-controls"><button type="button" onClick={() => onVisibilityChange(!markerVisible)}>{markerVisible ? "Hide party" : "Show party"}</button><button type="button" onClick={() => dialogRef.current?.showModal()}>Expand map</button></div>
      </div>
      <p className="map-caption">Drag the shared crow marker to update the party&apos;s position. Hide it when the party becomes lost.</p>
      <dialog className="travel-map-dialog" ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <header><div><p>Known world</p><h2>Cornath</h2></div><div className="travel-map-controls"><button type="button" onClick={() => onVisibilityChange(!markerVisible)}>{markerVisible ? "Hide party" : "Show party"}</button><button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close expanded map">Close</button></div></header>
        <div className="travel-map-scroll">{canvas(true)}</div>
      </dialog>
    </>
  );
}
