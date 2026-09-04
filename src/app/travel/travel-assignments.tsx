import { travelRoleLimits, travelRoleTasks, type TravelAssignment, type TravelCharacter, type TravelRole } from "@/domain/travel";

const roleNames: Record<TravelRole, string> = { supporter: "Supporter", guide: "Guide", scout: "Scout", tracker: "Tracker", sit_out: "Sit out" };
const fieldRoles = ["supporter", "guide", "scout", "tracker"] as const;

export function TravelAssignments({ travelers, assignments, onAssign }: {
  travelers: TravelCharacter[];
  assignments: TravelAssignment[];
  onAssign: (characterId: string, role: TravelRole, task?: string | null, targetId?: string | null) => void;
}) {
  const byCharacter = new Map(assignments.map((assignment) => [assignment.characterId, assignment]));
  const counts = Object.fromEntries(fieldRoles.map((role) => [role, assignments.filter((assignment) => assignment.role === role).length])) as Record<typeof fieldRoles[number], number>;

  return <div className="assignment-list">
    {travelers.map((character, index) => {
      const assignment = byCharacter.get(character.id);
      const isFieldRole = assignment && fieldRoles.includes(assignment.role as typeof fieldRoles[number]);
      const tasks = isFieldRole ? travelRoleTasks[assignment.role as typeof fieldRoles[number]] : [];
      return <article className="assignment-card" key={character.id}>
        <header><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{character.name}</h3><p>{character.playerName ?? "Player not recorded"}</p></div><b>{assignment ? roleNames[assignment.role] : "Unassigned"}</b></header>
        <div className="role-choices" aria-label={`Role for ${character.name}`}>
          {fieldRoles.map((role) => {
            const full = counts[role] >= travelRoleLimits[role] && assignment?.role !== role;
            return <button className={assignment?.role === role ? "selected" : ""} type="button" disabled={full} onClick={() => onAssign(character.id, role)} key={role}><span>{roleNames[role]}</span><small>{role === "guide" ? "Exactly 1" : "3 max"}{full ? " · Full" : ""}</small></button>;
          })}
          <button className={assignment?.role === "sit_out" ? "selected" : ""} type="button" onClick={() => onAssign(character.id, "sit_out")}><span>Sit out</span><small>No role test</small></button>
        </div>
        {isFieldRole && <div className="task-choices"><p>Choose a task</p>{tasks.map((task) => <button className={assignment.task === task.id ? "selected" : ""} type="button" onClick={() => onAssign(character.id, assignment.role, task.id)} key={task.id}><span><b>{task.name}</b><small>{task.intent}</small></span><em>{task.test}</em></button>)}</div>}
      </article>;
    })}
  </div>;
}
