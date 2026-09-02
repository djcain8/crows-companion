"use client";

import { useEffect, useRef, useState } from "react";
import { weaponQualities, weaponQualityById, weaponQualityId, type WeaponQuality } from "@/domain/weapon-qualities";

function QualityContent({ quality, compact = false }: { quality: WeaponQuality; compact?: boolean }) {
  return (
    <>
      <p>{quality.description}</p>
      {quality.dismemberResults ? <div className="dismember-table">{quality.dismemberResults.map((row) => <div key={row.roll}><b>{row.roll}</b><span>{row.result}</span></div>)}</div> : null}
      {quality.note ? <small>{quality.note}</small> : null}
      {!compact ? <em>Characters Book for Playtest 2, page 37</em> : null}
    </>
  );
}

export function WeaponQualityPills({ labels }: { labels: string[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenId(null);
        if (rootRef.current?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenId(null);
        if (rootRef.current?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <div className="weapon-quality-pills" ref={rootRef}>
      {labels.map((label) => {
        const qualityId = weaponQualityId(label);
        const quality = qualityId ? weaponQualityById.get(qualityId) : null;
        if (!quality) return <span className="weapon-type-pill" key={label}>{label}</span>;
        const isOpen = openId === `${qualityId}:${label}`;
        const triggerId = `${qualityId}:${label}`;
        return <div className={`quality-popover ${isOpen ? "open" : ""} ${dismissedId === triggerId ? "dismissed" : ""}`} onPointerLeave={() => setDismissedId(null)} key={label}>
          <button type="button" aria-expanded={isOpen} aria-label={`${label}: show weapon quality`} onClick={(event) => {
            if (isOpen) {
              setOpenId(null);
              setDismissedId(triggerId);
              event.currentTarget.blur();
            } else {
              setDismissedId(null);
              setOpenId(triggerId);
            }
          }}>{label}</button>
          <div className="quality-popover-panel" role="tooltip"><strong>{qualityId === "parry" ? label : quality.name}</strong><QualityContent quality={quality} compact /></div>
        </div>;
      })}
    </div>
  );
}

export function WeaponQualityReference() {
  return (
    <section className="quality-reference" id="weapon-qualities">
      <header><div><p className="eyebrow">Combat reference</p><h2>Weapon Qualities</h2></div><p>Tap or focus a quality on any weapon card for a quick reminder. Full rules are collected here.</p></header>
      <div className="quality-reference-grid">
        {weaponQualities.map((quality) => <article id={`quality-${quality.id}`} key={quality.id}><h3>{quality.name}</h3><QualityContent quality={quality} /></article>)}
      </div>
    </section>
  );
}
