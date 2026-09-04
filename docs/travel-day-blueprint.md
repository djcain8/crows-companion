# Travel Day Blueprint

Status: product and technical design for the first Travel implementation.

## Product goal

Make the normal overland-travel procedure unmistakable without making the app the authority over the fiction. The page should remember the group's shared state, expose only the rules relevant to the current decision, and allow the Ref to proceed through unusual situations without falsifying completed work.

The first version uses physical dice. It records final totals and outcomes but does not generate rolls or automate random-encounter tables.

## Navigation and terminology

Travel is a top-level section placed between Crows and Compendium in the primary navigation:

`Town · Crows · Travel · Compendium · Expedition`

Player-facing phase labels use the table's natural vocabulary while retaining the rulebook terms underneath:

- **Day - Travel** uses the Travel encounter EN.
- **Night - Camp & Rest** uses the Rest encounter EN.

An encounter occurs when a Ref's `d10` result is equal to or greater than its EN. Every EN display pairs the number with a plain-language risk label so that a higher number reads as safer rather than more dangerous.

## Page hierarchy

```text
┌ Journey: Gadwick → Blood Library ─ Day 3 ─────────────── ••• ┐
│ Party  4 Crows   Rations 19 / about 4.75 party rests         │
│ Speed  5         Day EN 7 (standard)   Night EN 8 (safer)    │
│ Location [visible/lost]                       [Open map]       │
├ 1 Plan ─ 2 Assign ─ 3 Resolve ─ 4 Travel ─ 5 Camp & Rest ───┤
│                                                              │
│                 Current-phase workspace                      │
│                                                              │
│                                        [Continue →]           │
├ Day record (collapsed) ──────────────────────────────────────┤
│ Pace · roles · resolved tests · EN changes · notes            │
└──────────────────────────────────────────────────────────────┘
```

On a wide screen the journey summary and current-phase workspace can sit beside the map. On a phone the summary becomes a compact sticky strip; selecting a value opens its breakdown. The map is available without forcing it above every decision.

### Always-visible journey summary

- Journey name or origin and destination
- Travel-day number and current phase
- Selected party count
- Lowest effective Speed and resulting movement adjustment
- Day/Travel EN and Night/Rest EN
- Total catalog rations carried by the selected characters
- Estimated party rests: `total rations / selected human party size`
- Marker visibility or Lost status
- One primary action for the current phase

Selecting Speed, either EN, or Rations reveals its calculation and sources. Full modifier ledgers do not remain expanded by default.

### Ration pressure

The initial version is read-only and derives rations from inventory items whose `catalogId` is `ration`. It does not guess that custom items are rations based on their names.

- Normal: more than 2 party rests
- Warning: at most 2 party rests
- Danger: at most 1 party rest
- Critical: insufficient rations for the selected party's next rest

The Rest phase displays the expected ration requirement but does not mutate inventories in the first slice. Confirmed consumption, special food, pets, hirelings, starvation, and characters who require extra rations come later.

## Party selection

The character registry is the available pool, not the traveling party.

- Only active characters are offered by default.
- No registered character is forced into the journey.
- Adding or removing a traveler never changes the character's registry status.
- Desktop supports dragging between Available and Traveling as an enhancement.
- Tap/click Add and Remove controls are the canonical interaction on every device.
- Party membership persists across travel days until deliberately changed.

Characters outside the selected party do not affect Speed, rations, role choices, or journey calculations.

## Guided phases

The five phases describe the ordinary path but are not hard gates. Completed step labels can be selected to revisit them. A single visible Continue action advances the normal procedure. Exceptional transitions live under a quiet overflow menu.

### 1. Plan

The group:

- confirms today's travelers;
- views its known position and proposed destination on the Cornath map;
- chooses Slow, Normal, or Fast pace;
- declares whether it follows a road for the entire day;
- reviews automatic Speed and terrain adjustments;
- records any Ref ruling that affects movement or both encounter numbers.

The header immediately previews planned hexes, Day EN, and Night EN.

### 2. Assign roles

Each attending character can be assigned to one of:

- Supporter
- Guide (maximum one)
- Scout (maximum three)
- Tracker (maximum three)
- Assist
- No role

After a role is chosen, only that role's tasks are displayed. Task choices remain editable until their resolution begins. The interface warns about limits but does not require every traveler to take a role.

Assists and Support Everyone targets are represented explicitly because they modify later tests.

### 3. Resolve roles

The app creates a queue in rules order:

1. Supporters
2. Guide
3. Scouts
4. Trackers

Only the current unresolved test is expanded. Each card shows:

- activity and short intent;
- attribute choice and `2d10 + attribute` expression;
- automatic modifiers with their sources;
- manual edge, bane, or numeric adjustment controls;
- three result tiers;
- final-total input;
- provisional tier;
- relevant expertises, with spending optional after the initial total is entered;
- any choice required by the result;
- the exact shared-state effect before confirmation.

Confirming a result records the outcome and applies deterministic movement or EN effects. A confirmed result can be reopened and corrected; derived totals are recalculated rather than incrementally patched.

### 4. Travel

The group sees:

- final hex movement and its calculation;
- final Day/Travel EN and risk label;
- a physical-die reminder such as `Travel encounter: 7+ on d10`;
- encounter check status: unchecked, no encounter, encounter occurred, or skipped;
- map and party marker.

The Ref can record an encounter or note without using a generated encounter table. The party marker is freely positioned; exact hex snapping can follow after the interaction is tested.

If the party becomes lost, Hide Party Position removes the shared marker while retaining its last known position. A private true location is intentionally not stored until there is authentication; the Ref can track it locally or on paper.

### 5. Camp & Rest

The page displays Night/Rest EN independently of Day EN. It guides:

- one rest-activity selection per participating character;
- Make Camp and Scout for Shelter effects already earned during the day;
- Seclude Camp's group-wide Rest EN effect and one-person limit;
- expected ration requirement and current supply;
- the Rest encounter check;
- rest outcome: completed, interrupted, or custom;
- Miasma resistance checklist if the rest completes in the Miasma.

The first version records activity selections and outcomes but does not automatically change Stamina, wounds, expertise uses, armor, or inventory.

Rules-as-written, a rest requires 6 uninterrupted hours in one place, including at least 4 hours of sleep, and strenuous interruption restarts it. The custom outcome exists so the Ref can support rulings such as partial sleep followed by a next-day bane without marking a normal rest complete.

## Flexible transitions without visible clutter

The ordinary screen exposes one primary Continue action. Exceptional actions appear in an overflow menu:

- Continue with unresolved work
- Pause at a point of interest
- End travel day here
- Start a new day
- Add a Ref note

Continue with unresolved work presents a compact confirmation and optional note; there is no permanent Skip button. Start New Day is always possible and warns about unresolved phases without blocking the transition.

Examples:

- **Run through the night:** mark rest Interrupted, add the persistent condition `Bane on today's travel-role tests - fled through the night`, then start the next day.
- **Stop at a POI:** pause the active day and return later, or end the day early at the current position.
- **No camp scene needed:** continue past Camp & Rest with a note.
- **Correct an earlier result:** reopen the completed step, edit it, and recalculate all derived movement and EN values.

## Calculation model

Derived values are always recalculated from facts plus active adjustments. The database does not treat a previously calculated total as the source of truth.

### Automatic in the first functional version

- Pace base movement and EN
- Lowest selected traveler's effective Speed
- Speed-based movement adjustment
- Road adjustment to movement, Day EN, and Night EN
- Confirmed travel-role results affecting movement or either EN
- Selected Seclude Camp activity
- Total catalog rations and estimated party rests
- Roll tier from the confirmed final total

### Suggested but editable

- Effective Speed derived from base Speed and existing backpack-wound penalty
- Applicable character expertises
- Known catalog equipment relevant to travel
- Rule-specified edge or bane from pace

### Manual in the first version

- Weather and unusual terrain
- Fictional positioning or preparation
- Fatigue and incomplete-rest rulings
- Custom equipment
- Traits not explicitly modeled
- Ref adjustments to movement, rolls, or encounter numbers
- Encounter occurrence and consequences

Manual adjustments require a short label and may optionally include a note. They are scoped to the entire journey, one travel day, one encounter number, or one character/test. Automatic suggestions can be disabled without deleting their source fact.

## Rules effect map

| Source | Movement | Day EN | Night EN | Test |
|---|---:|---:|---:|---|
| Slow pace | 1 base | 8 base | 8 base | edge on travel-role tests |
| Normal pace | 2 base | 7 base | 7 base | none |
| Fast pace | 3 base | 6 base | 6 base | bane on travel-role tests |
| Lowest Speed 3 or less | -1 | - | - | - |
| Lowest Speed 7-9 | +1 | - | - | - |
| Lowest Speed 10+ | +2 | - | - | - |
| Follow road all day | +1 | -1 | -1 | - |
| Guide results | possible +/- | possible +/- | - | - |
| Scout for Danger | - | possible + | - | - |
| Scout for Shelter | - | - | possible + | - |
| Hunt tier 1 | - | -1 | - | - |
| Make Camp | - | - | possible + | possible crafting bonus |
| Seclude Camp | - | - | +1 | - |

Higher EN is safer. The UI describes `+ EN` as safer and `- EN` as more dangerous.

## Proposed persistent model

This is a design target, not yet a migration.

### `travel_journeys`

One ongoing trip or overland expedition.

- `id`, `campaign_id`, `name`
- `status`: active or completed
- `origin_label`, `destination_label`
- shared marker `x`, `y`, and `marker_visible`
- optional destination marker `x`, `y`
- `current_day_id`
- timestamps

### `travel_party_members`

Persistent journey roster.

- `journey_id`, `character_id`
- `is_traveling`
- unique journey/character pair

### `travel_days`

One resumable state machine per day.

- `id`, `journey_id`, `day_number`
- `phase`: plan, assign, resolve, travel, rest, complete
- `status`: active, paused, completed, ended_early
- `pace`: slow, normal, fast, or null
- `follows_road`
- travel-encounter and rest-encounter check statuses
- rest outcome: pending, completed, interrupted, custom, or skipped
- `end_reason`, `note`
- timestamps and unique journey/day number

### `travel_assignments`

One selected role/task and its resolution per character per day.

- `travel_day_id`, `character_id`
- `role`, `task`
- selected attribute
- roll status and initial/final total
- expertise spent and resulting tier
- structured result choice where a tier requires one
- unique day/character pair

### `travel_adjustments`

The flexible seam for rules, equipment, and Ref rulings.

- `travel_day_id`
- optional assignment or character target
- `scope`: movement, day_en, night_en, test, persistent_condition
- `kind`: numeric, edge, bane, note
- amount, label, optional note
- `source`: automatic, role_result, equipment, trait, ref_ruling
- `active`

### `travel_rest_activities`

- `travel_day_id`, `character_id`
- activity identifier or custom label
- status and note
- ration requirement snapshot for later confirmed consumption

### `travel_events`

Append-only human-readable history for material actions: phase changes, resolved rolls, encounter outcomes, rests, marker hiding, early endings, and corrections. It records what and when, not who, because anonymous free-for-all access cannot identify the human actor honestly.

All tables follow the current campaign-scoped anonymous RLS policy during the MVP and use realtime updates for shared travel state.

## Implementation slices and review points

1. **Visual shell:** top-level navigation, original Cornath map with all landmarks, static stepper, journey header, party/ration presentation, and phase placeholders. Review information density on laptop and phone.
2. **Persistence:** journey, party membership, current day/phase, marker visibility and position, adjustments, and history.
3. **Plan and Assign:** pace/Speed/road calculations, party selection, role/task assignment, touch controls plus desktop dragging. Review coordination flow.
4. **Resolve and Travel:** ordered queue, physical-roll entry, expertise decision point, derived effects, Day encounter status, and map progression.
5. **Camp & Rest:** activities, Night EN, ration reminder, encounter status, interrupted/custom rest, Miasma checklist, and New Day transition. Review during a simulated full travel day.
6. **Post-playtest integration:** confirmed ration consumption, character recovery, pets/hirelings, equipment capabilities, weather assistance, and encounter-table tools.

## Explicitly deferred

- Authentication or a privileged GM mode
- In-app dice
- Automated random-encounter selection
- Private synchronized GM position while lost
- Automatic inventory consumption or character healing
- Route drawing, hex snapping, and automatic pathfinding
- Full weather simulation
- Pet and hireling ration accounting
- Generic parsing of arbitrary custom-item rules text

These can be added without changing the five-phase workflow or replacing the flexible adjustment model.
