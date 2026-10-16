# Vrij Tracé on imported PDFs — design

Status: approved in conversation 2026-10-16. Source requirements: the client's frozen
prototype "In Zicht — Vrij Tracé v8.2" (ChatGPT share, 14 numbered requirements) and the
reviewed mockup `Sleuftracé op PDF` (claude.ai artifact W8uF6NP4zv5MeDjYz5gwNi, v2).

## Goal

Bring the v8.2 utility-trench planner into the whiteboard, working **only on imported PDF
pages**, measuring in metres from each page's ruler calibration, and usable by several
people at once. v8.2's controls and behaviour are kept; only PDF binding, calibration and
collaboration are added.

## Decisions

| Topic | Decision |
|---|---|
| Trees | Added per page (B1, B2, … numbered per page); moved with v8.2's Verplaats B*n* / Stop controls; v8.2's three trees are the example. |
| Networks | At most one network per PDF page. |
| Storage | One new element type `trench` with a `kind` (`network`, `node`, `segment`, `tree`); every part is its own element so collaborative edits merge per part. |
| Calibration | A page must be ruler-calibrated (`customData.pdfCmPerPx`) before Vrij Tracé draws on it. No 20 px/m fallback. |
| Geometry | Real polygons via `clipper-lib`, computed in metres relative to the page. |
| Export | Out of scope for v1. |
| Rollout | Behind app setting `vrijtrace_enabled` (default off). |

## 1. Data model

New element type in the fork: `type: "trench"`, with `pdfParentId` (required) and a
discriminated payload `trench`:

```ts
type TrenchData =
  | { kind: "network"; redSide: Side; workWidthM: number; workSide: Side; treeMinM: number;
      activation: { by: { uid: string; name: string }; at: number; fingerprint: string } | null }
  | { kind: "node" }                                   // position = element centre
  | { kind: "segment"; a: string; b: string; widthM: number } // a/b = node element ids
  | { kind: "tree"; label: string };                   // position = element centre
type Side = "beide" | "links" | "rechts";
```

- Exactly one `network` per page, id `vrijtrace-<pdf element id>`; not selectable; it renders
  the trench and zones for its page and its bounds follow the page.
- Widths and distances are metres; pixels = metres × 100 / `pdfCmPerPx` at render time.
- Damage-prevention distance is the constant 2.00 m (v8.2).
- **Zone activation fingerprint**: a hash of the valid geometry and zone settings, expressed
  in metres in the page's own unrotated frame (rounded to 1 cm). Zones are shown only while
  `activation.fingerprint === fingerprint(current)`. Any edit by anyone therefore shows
  "Zones niet geactiveerd" without writing to the network element; moving, resizing or
  rotating the page does not change the fingerprint; recalibrating does.
- Per-user, never synced (local app state): Vrij Tracé mode, active tree, snapping
  (90°/45°/vrij), drawing reference (midden/links/rechts — applied at draw time only, as
  v8.2), width for new segments, "PDF verbergen".
- Valid geometry (v8.2 req. 9): a segment counts only when both node elements exist, are not
  deleted, differ, and are ≥ 3 px apart; nodes without valid segments are hidden.

## 2. Interaction and UI

- Toolbar button **Vrij Tracé** (key S) next to the ruler/text bubble tools; hidden when
  `vrijtrace_enabled` is off or the board is read-only.
- Acts only over an imported PDF page (`isImageElement && customData.isPdf`). Elsewhere: cursor
  `not-allowed`; a click flashes the page edge and toasts "Sleuven teken je alleen op een
  geïmporteerde PDF-pagina". Uncalibrated page: toast "Kalibreer eerst de liniaal op deze
  pagina", nothing is drawn. The clicked page becomes the **current page**.
- Left panel while the tool is active — v8.2's six sections, v8.2 wording:
  1. Tekenmodus: Teken / Verplaats punt / Selecteer segment / Verwijder segment
  2. Magnetisch uitlijnen: 90° / 45° / Vrij
  3. Sleufinstellingen: width 0.30–2.30 m (applies to the selected segment in Selecteer
     mode, else to new segments); Tekenreferentie Middenlijn / Linker rand / Rechter rand
  4. Schadepreventiezone 2.00 m, Zijde
  5. Werkruimte 0.50–4.00 m, Zijde
  6. Bomen en afstandscontrole: minimum 0–15 m (default 5.00), one *Verplaats B*n* button
     per tree on the page, **Boom toevoegen**, Stop. Boom toevoegen enters a one-shot mode:
     the next click on the current page places a tree with the lowest free label (B1, B2, …)
     and switches to moving it, exactly like Verplaats B*n*.
- Bottom action island: Activeer / herbereken zones, Voltooi, Ongedaan maken, Verwijder
  segment (selected, else switch to delete mode), Voorbeeld, Wis tracé, PDF verbergen/tonen.
- Sidebar tab **Vrij Tracé** (next to Library): tree table (Boom, In sleuf, Afstand
  buitenrand, Min. eis, Toets, Rode zone, Werkruimte), legend, zone status ("Zones
  geactiveerd · door <naam>, <tijd>" / "Zones niet geactiveerd"), "<n> segmenten · <m>
  knooppunten", scale ("<pagina>: 1 m = <x> px"), v8.2 disclaimer.
- Trench parts are not selectable with the normal Selecteer tool or box selection; they are
  edited only through Vrij Tracé modes. Keys: Esc = Stop, Delete = delete selected segment,
  Ctrl+Z = undo.
- Drawing behaviour = v8.2: click-click or drag; start/end snap to nodes within 13 px; ending
  on a segment splits it (T-junction); a new segment crossing existing ones splits both at the
  crossings; dragged node dropped within 12 px of another merges; Voltooi ends the chain.
  Preview shows the live length in metres.

## 3. Geometry, zones and checks

Pure module (no Excalidraw imports), metres in page frame, `clipper-lib`, arc tolerance 1 cm:

- Trench = union of segment buffers (½ width, round ends/joins). The trench is drawn from
  this outline.
- Red = union of buffers (½ width + 2.00 m) − trench. Work = union (½ width + work width) −
  trench. Overlap = red ∩ work (hatched; widths never added).
- One-sided ("links"/"rechts"): each segment buffer is cut to that side of its own a→b
  direction before the union (v8.2 behaviour; ambiguity at junctions is an open question).
- Tree checks: in-trench = point in trench polygon; distance = distance to the trench outline
  (outside: nearest; inside: depth); red/work = point in polygon, only while zones are active,
  else "—"; Toets compares distance with the minimum (changing the minimum never changes the
  distance — v8.2 req. 11).
- Rendering: the network element draws trench, zones, overlap in the static canvas and in
  SVG/PNG export (zones only while active). The interactive canvas draws the drawing preview,
  move handles and collaborators' edit outlines.
- Results are cached by fingerprint; every client computes the same result from synced data.

## 4. Collaboration

- Parts sync through the existing scene sync; Excalidraw reconciles per element by version.
  No collaboration-server change (production runs the stock `whiteboard:stable` image).
- Soft hold: new client broadcast type `VRIJTRACE_EDITING` over the existing volatile
  broadcast, `{ elementIds, userId, name, color }`, sent when grabbing a node/tree or selecting
  a segment, repeated every 3 s while held, expiring after 8 s or on disconnect. Others see the
  part outlined in that person's colour with "<naam> bewerkt"; grabbing it toasts "<naam>
  bewerkt dit punt". Advisory only; a same-part collision falls back to newest-version-wins.
- Activation (who, when, fingerprint) lives on the network element; simultaneous activations
  write the same fingerprint.
- Races: fixed network id per page merges simultaneous first networks; duplicate tree labels
  display as "B4" / "B4b" in id order; segments with missing nodes are ignored and the next
  edit prunes leftovers.
- Old bundles drop unknown element types and could save a file without the trench. Mitigation:
  cache-buster bump on every deploy; the new bundle keeps unknown element types on restore;
  undo and Nextcloud versions as fallback.

## 5. Lifecycle

- Page move/resize/rotate carries all parts via `pdfParentId` (existing child handling).
  Resize also rescales the calibration (existing), so metres and the fingerprint are unchanged.
- Recalibration changes real geometry → zones show "niet geactiveerd" until reactivated.
- Multi-page PDFs: one network and tree set per page.
- Verwijder segment prunes nodes left without segments. Wis tracé removes the page's nodes and
  segments, keeps trees and settings (v8.2). Deleting the PDF page deletes its network,
  nodes, segments and trees.
- Voorbeeld replaces the current page's network and trees with v8.2's example, centred and
  scaled by the calibration; one undo step.
- Duplicating / copy-pasting a PDF page copies its network with all ids remapped (network id
  becomes `vrijtrace-<new pdf id>`, segment `a`/`b` follow their nodes).
- Undo: one step per action for the acting user (Excalidraw history).
- Restore: drop parts with unknown `kind`, segments without both nodes, trench parts without
  a PDF parent; clamp widths to 0.30–2.30 m and work width to 0.50–4.00 m.
- Read-only, public share and recording render everything; the tool is hidden.

## 6. Testing and rollout

- Fork unit tests: geometry module (buffers, unions, cut-out, one-sided, overlap, checks,
  fingerprint invariance under move/resize/rotate and change on recalibration).
- Fork app tests: gating (non-PDF, uncalibrated), drawing modes, splits and merges, width,
  delete/prune, Voltooi, Wis tracé, Voorbeeld, undo granularity, page move/resize/delete,
  duplicate remap, restore validation. Judged against the fork's existing failing baseline.
- Whiteboard integration test (real `ServerService`): two clients editing different parts
  both survive; `VRIJTRACE_EDITING` reaches the other client.
- Live acceptance on dev with two browser sessions against v8.2 requirements 1–14 plus PDF
  binding and collaboration; then a short production check.
- Rollout behind `vrijtrace_enabled` (app config → initial state → Excalidraw prop), default
  off; enable locally, enable on production after client acceptance. Normal deploy: build,
  commit, push, production pull, cache-buster bump.

## v8.2 requirement mapping

| # | Requirement | Where |
|---|---|---|
| 1 | B/W PDF background, no zones before activation | real imported PDF; fingerprint gating (§1) |
| 2 | Connected networks, shared nodes, T, branches, loops | node/segment elements, splits (§2) |
| 3 | Draw, move point, select, delete modes | §2 section 1 |
| 4 | 90° default / 45° / free | §2 section 2 |
| 5 | Width 0.30–2.30 m; centre/left/right reference | §2 section 3 |
| 6 | Red zone 2.00 m, left/right/both | §3 |
| 7 | Work area 0.50–4.00 m, left/right/both | §3 |
| 8 | Rounded unions, trench subtracted, overlap distinct | §3 |
| 9 | Zones from current valid geometry only | §1 valid geometry, fingerprint |
| 10 | Movable trees; in-trench, distance, minimum, red/work overlap | §2 section 6, §3 |
| 11 | Minimum changes only the verdict | §3 |
| 12 | Verplaats B*n* and Stop controls | §2 section 6 |
| 13 | Example network, activation, undo, delete, recalculation | §2 action island, §5 |
| 14 | Scale disclaimer, no survey-grade claim | page calibration instead of 20 px/m; disclaimer in sidebar |

## Out of scope (v1)

Export formats, tree crown/root radius, several networks per page.

## Open questions for the client

Tree radius; fixed vs. addable trees (decided: addable); networks per page (decided: one);
export formats; one-sided zones at junctions.
