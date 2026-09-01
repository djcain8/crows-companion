"use client";

import { deleteCharacter } from "./actions";

export function DeleteCharacterButton({ characterId, characterName }: { characterId: string; characterName: string }) {
  const action = deleteCharacter.bind(null, characterId);

  return (
    <form
      action={action}
      className="delete-character-form"
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${characterName}? This permanently removes their character sheet, inventory, and expedition marker.`)) {
          event.preventDefault();
        }
      }}
    >
      <div><strong>Delete character</strong><span>This cannot be undone.</span></div>
      <button type="submit">Delete {characterName}</button>
    </form>
  );
}
