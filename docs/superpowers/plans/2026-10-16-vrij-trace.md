# Vrij Tracé on imported PDFs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the frozen v8.2 "Vrij Tracé" utility-trench planner to the whiteboard, working only on imported, ruler-calibrated PDF pages and safe for several simultaneous editors.

**Architecture:** One new Excalidraw element type `trench` (kinds `network`, `node`, `segment`, `tree`), each part its own locked element tied to its page through `customData.pdfParentId`, so existing PDF-child code moves/resizes/deletes them and Excalidraw's per-element reconcile merges concurrent edits. A pure geometry module (Clipper) computes trench outline, zones and tree checks in metres from the page calibration; the page's `network` element draws them. A controller in the fork handles the custom tool; the whiteboard host only adds a feature flag, the current user and a soft "editing" broadcast.

**Tech Stack:** Excalidraw fork (`custom_apps/excalidraw`, TypeScript, React, Vitest), `clipper-lib` 6.4.2 + `@types/clipper-lib` 6.4.0, Nextcloud whiteboard app (`custom_apps/whiteboard`, PHP 8.4, React, Socket.IO, Vitest).

**Spec:** `docs/superpowers/specs/2026-10-16-vrij-trace-design.md` (whiteboard repo). Read it before starting; this plan argues from it.

## Global Constraints

- Repos: fork `~/src/inzicht-stack/nextcloud/custom_apps/excalidraw` (branch `nc-master`, remote `nc`), whiteboard `~/src/inzicht-stack/nextcloud/custom_apps/whiteboard` (branch `master`). Work on a branch `feat/vrij-trace` in **both** repos; merge to the main branches only in Task 12.
- No host Node. Fork commands run from `custom_apps/`:
  `docker run --rm -v "$PWD":/apps -w /apps/excalidraw --user 1000:1000 -e HOME=/tmp -e YARN_CACHE_FOLDER=/tmp/.yarncache node:22 <cmd>`
  Below this is written `FORK <cmd>`, e.g. `FORK yarn -s vitest run packages/excalidraw/vrijtrace/geometry.test.ts`.
  Whiteboard commands: same with `-w /apps/whiteboard` and `node:24`, written `WB <cmd>`.
- The whiteboard tree is owned by `www-data`: `sudo chown -R payboy:payboy whiteboard` before editing/committing, `sudo chown -R www-data:www-data whiteboard` when done.
- The fork's test suite, `tsc` and eslint are already red at baseline (≈293 failing tests, 60 tsc errors). Judge every task by **diff against the baseline**, never by "all green": before the first task run `FORK yarn -s vitest run 2>&1 | grep -E '^ FAIL' | sort -u > /tmp/vt-fail-base.txt` and `FORK yarn -s tsc 2>&1 | grep -E 'error TS' | sed -E 's/\([0-9]+,[0-9]+\)//' | sort > /tmp/vt-tsc-base.txt` (paths inside the scratchpad are fine too).
- Fork code style: 2-space indent, semicolons, double quotes (Excalidraw). Whiteboard code style: tabs, no semicolons, single quotes (see whiteboard CLAUDE.md). Frontend logging in the whiteboard uses `src/utils/logger.ts`, never `console.*`.
- UI language is Dutch, wording verbatim from v8.2 (collected in `vrijtrace/strings.ts`, Task 8). Do not run it through `t()`.
- Ranges and defaults (spec §2/§3): trench width 0.30–2.30 m (default 1.00), damage-prevention zone fixed **2.00 m**, working area 0.50–4.00 m (default 1.50), minimum tree distance 0–15 m (default 5.00), sides `beide | links | rechts` (default `beide`), snapping `90 | 45 | vrij` (default `90`), reference `midden | links | rechts` (default `midden`).
- "Left" of a segment a→b is the side of normal **n = (uy, −ux)** in the y-down scene/page frame (v8.2 convention: reference `links` offsets the drawn line by −½·width·n; zone side `links` keeps +n).
- Elements are never 0×0: node, tree and segment elements use a 1×1 box whose **centre** is the point (`restoreElements` drops invisibly small elements).
- Network element id is `vrijtrace-<pdf element id>`; all parts carry `customData.pdfParentId`; all parts are `locked: true`.
- Shortcut: **U** opens Vrij Tracé (the spec's `S` is taken by the stroke-colour picker, `App.tsx:4700`).
- Feature flag: app config `vrijtrace_enabled` (bool, default false) → initial state `vrijTraceEnabled` → Excalidraw prop `vrijTraceEnabled`. Rendering of existing trench data does not depend on the flag; only the tool, panel and sidebar tab do.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Fingerprint stability under page resize/rotate.** People resize pages after activating zones; zones must stay "geactiveerd". Pinned by the invariance tests in Task 4 (non-round resize factor 1.37, rotation 0.4 rad).
2. **Degenerate edits** — dropping a node onto the other end of its own segment, drawing a segment back onto its start, merging two nodes of a triangle. Expectation: the bad segment disappears, nothing throws, other segments stay. Pinned in Task 5.
3. **The page disappears mid-edit** (a collaborator deletes the PDF page, or undo removes it, while a draft or drag is in progress). Expectation: the draft/drag is dropped silently and nothing is created without a page. Pinned in Task 6.
4. **Partial collaboration updates** — remote scene updates contain only changed elements, so a segment can arrive before its nodes. Expectation: it is kept and simply not drawn until its nodes arrive. Restore therefore validates per element only (deliberate deviation from spec §5 "drop segments without both nodes", which would delete data on partial updates). Pinned in Task 1 and Task 4.
5. **Two people creating the first network on the same page** — both insert `vrijtrace-<pdf>`. Expectation: one network, no duplicate drawing. Pinned in Task 6 (insert-twice test) and exercised live in Task 12.

---

## File structure

Fork (`custom_apps/excalidraw/packages/…`):

| File | Responsibility |
|---|---|
| `element/src/types.ts` (modify) | `ExcalidrawTrenchElement`, `VrijTraceData` and friends; add to `ExcalidrawElement` union |
| `element/src/typeChecks.ts` (modify) | `isTrenchElement`, `isExcalidrawElement` case |
| `element/src/newElement.ts` (modify) | `newTrenchElement` factory |
| `element/src/{Shape,shapes,collision,distance,renderElement,bounds}.ts` (modify) | `case "trench"` no-ops (generic code never draws or hits trench parts) |
| `excalidraw/data/restore.ts` (modify) | per-element validation of `trench`; keep unknown types |
| `excalidraw/vrijtrace/geometry.ts` (create) | pure Clipper geometry in metres: trench, zones, tree checks, fingerprint |
| `excalidraw/vrijtrace/model.ts` (create) | page frame ⇄ metres, collecting a page's parts, valid geometry, labels, zone cache |
| `excalidraw/vrijtrace/editing.ts` (create) | v8.2 drawing rules on a plain working copy + diff; example network |
| `excalidraw/vrijtrace/controller.ts` (create) | the custom tool: pointer/keys, applying edits to the scene, settings, activation, holds |
| `excalidraw/vrijtrace/render.ts` (create) | static overlay, SVG export, interactive layer |
| `excalidraw/vrijtrace/strings.ts` (create) | Dutch UI strings |
| `excalidraw/vrijtrace/VrijTracePanel.tsx`, `VrijTraceActions.tsx`, `VrijTraceSidebar.tsx`, `vrijtrace.scss` (create) | left panel, bottom action island, sidebar tab |
| `excalidraw/types.ts`, `appState.ts`, `index.tsx` (modify) | app state, props |
| `excalidraw/components/{App,Actions,LayerUI,DefaultSidebar}.tsx` (modify) | wiring |
| `excalidraw/renderer/{staticScene,staticSvgScene,interactiveScene}.ts` (modify) | call the renderers |
| `excalidraw/actions/{actionDuplicateSelection,actionElementLock}.tsx` (modify) | duplicate remap, never unlock trench |
| tests: `excalidraw/vrijtrace/*.test.ts`, `excalidraw/tests/vrijtrace*.test.tsx` (create) | |

Whiteboard (`custom_apps/whiteboard/…`): `lib/Service/ConfigService.php`, `lib/Listener/LoadViewerListener.php`, `lib/Listener/BeforeTemplateRenderedListener.php`, `src/App.tsx`, `src/hooks/useSync.ts`, `src/hooks/useCollaboration.ts`, `tests/integration/vrijtrace.spec.mjs`.

---

### Task 1: The `trench` element type

**Files:**
- Modify: `packages/element/src/types.ts` (after `ExcalidrawTextBubbleElement`, and the `ExcalidrawElement` union)
- Modify: `packages/element/src/typeChecks.ts` (`isExcalidrawElement`, new guard)
- Modify: `packages/element/src/newElement.ts` (after `newTextBubbleElement`)
- Modify: every exhaustive `switch (element.type)` that `tsc` reports (expected: `Shape.ts`, `shapes.ts`, `collision.ts`, `distance.ts`, `renderElement.ts` ×2, `staticSvgScene.ts`, possibly `bounds.ts`)
- Modify: `packages/excalidraw/data/restore.ts` (`restoreElement` switch, before `case "magicframe"`)
- Test: `packages/excalidraw/tests/vrijtraceRestore.test.ts` (create)

**Interfaces:**
- Produces:
  ```ts
  // @excalidraw/element/types
  export type VrijTraceSide = "beide" | "links" | "rechts";
  export type VrijTraceActivation = { by: { uid: string; name: string }; at: number; fingerprint: string };
  export type VrijTraceNetworkData = { kind: "network"; redSide: VrijTraceSide; workWidthM: number; workSide: VrijTraceSide; treeMinM: number; activation: VrijTraceActivation | null };
  export type VrijTraceSegmentData = { kind: "segment"; a: string; b: string; widthM: number };
  export type VrijTraceData = VrijTraceNetworkData | { kind: "node" } | VrijTraceSegmentData | { kind: "tree"; label: string };
  export type ExcalidrawTrenchElement = _ExcalidrawElementBase & { type: "trench"; trench: VrijTraceData };
  // @excalidraw/element
  export const isTrenchElement: (el?: ExcalidrawElement | null) => el is ExcalidrawTrenchElement;
  export const newTrenchElement: (opts: { trench: VrijTraceData; pdfParentId: string; id?: string } & ElementConstructorOpts) => NonDeleted<ExcalidrawTrenchElement>;
  ```

- [ ] **Step 1: Create the branch in the fork**

```bash
cd ~/src/inzicht-stack/nextcloud/custom_apps/excalidraw && git checkout -b feat/vrij-trace
```

- [ ] **Step 2: Write the failing restore tests**

`packages/excalidraw/tests/vrijtraceRestore.test.ts`:

```ts
import { restoreElements } from "../data/restore";

const base = {
  x: 10, y: 20, width: 1, height: 1, angle: 0, strokeColor: "#000", backgroundColor: "transparent",
  fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid", roughness: 0, opacity: 100,
  groupIds: [], frameId: null, roundness: null, seed: 1, version: 1, versionNonce: 1,
  isDeleted: false, boundElements: null, updated: 1, link: null, locked: false,
};
const trench = (id: string, data: any, customData: any = { pdfParentId: "pdf1" }) =>
  ({ ...base, id, type: "trench", trench: data, customData }) as any;

describe("restoring trench elements", () => {
  it("keeps valid parts and forces them locked", () => {
    const [n] = restoreElements([trench("n1", { kind: "node" })], null);
    expect(n).toMatchObject({ id: "n1", type: "trench", locked: true, trench: { kind: "node" } });
  });

  it("clamps widths and normalises settings", () => {
    const out = restoreElements([
      trench("s1", { kind: "segment", a: "n1", b: "n2", widthM: 9 }),
      trench("net", { kind: "network", redSide: "nope", workWidthM: 0.1, workSide: "links", treeMinM: 99, activation: null }),
    ], null);
    expect(out[0]).toMatchObject({ trench: { kind: "segment", a: "n1", b: "n2", widthM: 2.3 } });
    expect(out[1]).toMatchObject({ trench: { kind: "network", redSide: "beide", workWidthM: 0.5, workSide: "links", treeMinM: 15, activation: null } });
  });

  it("drops parts without a page or with an unknown kind", () => {
    const out = restoreElements([
      trench("x1", { kind: "node" }, {}),
      trench("x2", { kind: "lamppost" }),
      trench("x3", { kind: "segment", a: "n1" }),
    ], null);
    expect(out).toEqual([]);
  });

  it("keeps a segment whose nodes are not in the same batch (partial collab update)", () => {
    const out = restoreElements([trench("s9", { kind: "segment", a: "elsewhere1", b: "elsewhere2", widthM: 1 })], null);
    expect(out.map((e) => e.id)).toEqual(["s9"]);
  });
});
```

- [ ] **Step 3: Run it — it fails**

Run: `FORK yarn -s vitest run packages/excalidraw/tests/vrijtraceRestore.test.ts`
Expected: FAIL — restored arrays are empty (unknown type `trench` is dropped).

- [ ] **Step 4: Add the types**

In `packages/element/src/types.ts`, after the `ExcalidrawTextBubbleElement` type:

```ts
export type VrijTraceSide = "beide" | "links" | "rechts";

export type VrijTraceActivation = {
  by: { uid: string; name: string };
  at: number;
  /** fingerprint of the geometry + zone settings the zones were activated for */
  fingerprint: string;
};

export type VrijTraceNetworkData = {
  kind: "network";
  redSide: VrijTraceSide;
  workWidthM: number;
  workSide: VrijTraceSide;
  treeMinM: number;
  activation: VrijTraceActivation | null;
};

export type VrijTraceSegmentData = {
  kind: "segment";
  /** element ids of the two node elements */
  a: string;
  b: string;
  widthM: number;
};

export type VrijTraceData =
  | VrijTraceNetworkData
  | { kind: "node" }
  | VrijTraceSegmentData
  | { kind: "tree"; label: string };

/**
 * One part of a Vrij Tracé trench network on a PDF page
 * (customData.pdfParentId). Always locked. Drawn by the page's `network`
 * element (vrijtrace/render.ts), never by the generic element renderer.
 * node/tree/segment use a 1×1 box whose centre is the point.
 */
export type ExcalidrawTrenchElement = _ExcalidrawElementBase & {
  type: "trench";
  trench: VrijTraceData;
};
```

and add `| ExcalidrawTrenchElement` to the `export type ExcalidrawElement =` union (next to `| ExcalidrawTextBubbleElement`).

- [ ] **Step 5: Add the guard and factory**

In `packages/element/src/typeChecks.ts`: add `ExcalidrawTrenchElement` to the type import, add `case "trench":` to the `isExcalidrawElement` switch next to `case "textbubble":`, and append:

```ts
export const isTrenchElement = (
  element?: ExcalidrawElement | null,
): element is ExcalidrawTrenchElement => {
  return element != null && element.type === "trench";
};
```

In `packages/element/src/newElement.ts` (import `ExcalidrawTrenchElement`, `VrijTraceData` from `./types`), after `newTextBubbleElement`:

```ts
export const newTrenchElement = (
  opts: {
    trench: VrijTraceData;
    pdfParentId: string;
    id?: string;
  } & ElementConstructorOpts,
): NonDeleted<ExcalidrawTrenchElement> => {
  const { trench, pdfParentId, id, ...rest } = opts;
  const element = {
    ..._newElementBase<ExcalidrawTrenchElement>("trench", {
      width: 1,
      height: 1,
      ...rest,
      locked: true,
      customData: { ...(rest.customData ?? {}), pdfParentId },
    }),
    trench,
  };
  return id ? { ...element, id } : element;
};
```

- [ ] **Step 6: Make every exhaustive switch compile**

Run: `FORK yarn -s tsc 2>&1 | grep -E 'error TS' | sed -E 's/\([0-9]+,[0-9]+\)//' | sort > /tmp/vt-tsc.txt; diff /tmp/vt-tsc-base.txt /tmp/vt-tsc.txt`
For each new error caused by `"trench"` not being handled, add a case with the neutral result. Rule: **generic code never draws, hits, snaps to or measures a trench part.**

| File / function | Add |
|---|---|
| `Shape.ts` both switches (`generateElementShape` / roughjs options) | `case "trench": return null;` (options switch: put it with the cases that need no fill options and `break`) |
| `shapes.ts` (`getElementShape`) | `case "trench":` return the same shape object the function returns for a `rectangle` whose width/height are 0 — copy the `rectangle` branch's call with `{ ...element, width: 0, height: 0 }` |
| `collision.ts` (`hitElementItself` switch) | `case "trench": return false;` |
| `distance.ts` (`distanceToElement`) | `case "trench": return Infinity;` |
| `renderElement.ts` (`drawElementOnCanvas`, `renderElement`) | `case "trench": break;` |
| `staticSvgScene.ts` (`renderElementToSvg`) | `case "trench": break;` (Task 7 fills it in) |
| any other site | the value that means "nothing here" for that function |

Re-run the diff until no new `tsc` errors remain.

- [ ] **Step 7: Restore validation**

In `packages/excalidraw/data/restore.ts`, inside `restoreElement`'s switch, before `case "magicframe":`:

```ts
    case "trench": {
      const data = (element as any).trench;
      const pdfParentId = element.customData?.pdfParentId;
      if (!data || typeof pdfParentId !== "string") {
        return null;
      }
      const num = (v: unknown, lo: number, hi: number, d: number) =>
        typeof v === "number" && Number.isFinite(v)
          ? Math.min(hi, Math.max(lo, v))
          : d;
      const side = (v: unknown) => (v === "links" || v === "rechts" ? v : "beide");
      let trench;
      switch (data.kind) {
        case "network":
          trench = {
            kind: "network",
            redSide: side(data.redSide),
            workWidthM: num(data.workWidthM, 0.5, 4, 1.5),
            workSide: side(data.workSide),
            treeMinM: num(data.treeMinM, 0, 15, 5),
            activation:
              data.activation && typeof data.activation.fingerprint === "string"
                ? data.activation
                : null,
          };
          break;
        case "node":
          trench = { kind: "node" };
          break;
        case "segment":
          if (typeof data.a !== "string" || typeof data.b !== "string") {
            return null;
          }
          trench = { kind: "segment", a: data.a, b: data.b, widthM: num(data.widthM, 0.3, 2.3, 1) };
          break;
        case "tree":
          trench = { kind: "tree", label: typeof data.label === "string" && data.label ? data.label : "B?" };
          break;
        default:
          return null;
      }
      return restoreElementWithProperties(element as any, { trench, locked: true } as any);
    }
```

(Per-element validation only — restore also runs on partial collaboration updates; see Review Focus 4.)

- [ ] **Step 8: Run the tests — they pass**

Run: `FORK yarn -s vitest run packages/excalidraw/tests/vrijtraceRestore.test.ts`
Expected: 4 passed.

- [ ] **Step 9: Baseline diff and commit**

Run the baseline test and tsc diffs from Global Constraints; expected: no new failures, no new tsc errors.

```bash
git add packages/element/src packages/excalidraw/data/restore.ts packages/excalidraw/renderer/staticSvgScene.ts packages/excalidraw/tests/vrijtraceRestore.test.ts
git commit -m "feat(vrijtrace): add the trench element type

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Keep unknown element types on load

Spec §4 mitigation: a newer bundle must not delete element types it does not know.

**Files:**
- Modify: `packages/excalidraw/data/restore.ts` (end of `restoreElement`)
- Modify: `packages/element/src/Shape.ts` (`ShapeCache.generateElementShape` entry), `packages/excalidraw/renderer/staticScene.ts` (paint loop), `packages/excalidraw/renderer/staticSvgScene.ts` (`renderSceneToSvg` loop), `packages/excalidraw/components/App.tsx` (`getElementsAtPosition` filter)
- Test: `packages/excalidraw/tests/unknownElementTypes.test.tsx` (create)

**Interfaces:** Produces: unknown-type elements survive `restoreElements` with `locked: true`; `isExcalidrawElement(el) === false` for them and every renderer/hit-test skips them.

- [ ] **Step 1: Write the failing tests**

```tsx
import React from "react";
import { restoreElements } from "../data/restore";
import { exportToSvg } from "../scene/export";
import { Excalidraw } from "../index";
import { API } from "./helpers/api";
import { render } from "./test-utils";

const { h } = window;
const future = {
  id: "f1", type: "hologram", x: 0, y: 0, width: 100, height: 100, angle: 0, strokeColor: "#000",
  backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid", roughness: 0,
  opacity: 100, groupIds: [], frameId: null, roundness: null, seed: 1, version: 3, versionNonce: 1,
  isDeleted: false, boundElements: null, updated: 1, link: null, locked: false,
} as any;

describe("unknown element types", () => {
  it("are kept on restore, locked", () => {
    const [el] = restoreElements([future], null);
    expect(el).toMatchObject({ id: "f1", type: "hologram", locked: true, version: 3 });
  });

  it("do not break rendering, export or hit testing", async () => {
    await render(<Excalidraw />);
    API.setElements(restoreElements([future, API.createElement({ id: "r1", type: "rectangle", x: 200, y: 0 })], null));
    const svg = await exportToSvg({ elements: h.elements, appState: h.state, files: {} });
    expect(svg.querySelectorAll("path").length).toBeGreaterThan(0);
    expect((h.app as any).getElementAtPosition(50, 50)).toBeNull();
  });
});
```

- [ ] **Step 2: Run — fails** (`FORK yarn -s vitest run packages/excalidraw/tests/unknownElementTypes.test.tsx`; expected: first test gets `undefined`).

- [ ] **Step 3: Implement**

`restore.ts`, replace the final `return null;` of `restoreElement` with:

```ts
  // An element type this build does not know (saved by a newer client):
  // keep it untouched and locked so saving can never drop it.
  if (typeof (element as any).type === "string" && typeof element.id === "string") {
    return { ...element, locked: true };
  }
  return null;
```

Guards (each one line, at the top of the per-element work):
- `Shape.ts` `generateElementShape`: `if (!isExcalidrawElement(element)) { return null; }`
- `staticScene.ts` paint loop (inside `.forEach((element) => {` before `try`): `if (!isExcalidrawElement(element)) { return; }`
- `staticSvgScene.ts` `renderSceneToSvg` element loop: `if (!isExcalidrawElement(element)) { continue; }` (or `return` inside forEach)
- `App.tsx` `getElementsAtPosition`: add `isExcalidrawElement(element) &&` to the element filter.

- [ ] **Step 4: Run — passes**, then baseline diff (no new failures/tsc errors).

- [ ] **Step 5: Commit** — `fix: keep element types this build does not know instead of dropping them`.

---

### Task 3: Geometry module

**Files:**
- Modify: `packages/excalidraw/package.json` (dependency), root `package.json` (dev dependency), `yarn.lock`
- Create: `packages/excalidraw/vrijtrace/geometry.ts`
- Test: `packages/excalidraw/vrijtrace/geometry.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Pt = { x: number; y: number };
  export type Polygons = Pt[][];               // rings, even-odd (holes included)
  export type GeoNode = { id: string; x: number; y: number };        // metres, page frame
  export type GeoSegment = { id: string; a: string; b: string; widthM: number };
  export type NetworkGeometry = { nodes: GeoNode[]; segments: GeoSegment[] };
  export type ZoneSettings = { redSide: VrijTraceSide; workWidthM: number; workSide: VrijTraceSide };
  export type Zones = { trench: Polygons; red: Polygons; work: Polygons; overlap: Polygons };
  export type TreeCheck = { inside: boolean; distanceM: number | null; pass: boolean | null; red: boolean | null; work: boolean | null };
  export const RED_ZONE_M = 2;
  export const computeZones: (g: NetworkGeometry, s: ZoneSettings) => Zones;
  export const pointInPolygons: (p: Pt, polys: Polygons) => boolean;
  export const distanceToPolygons: (p: Pt, polys: Polygons) => number;   // Infinity if empty
  export const checkTree: (p: Pt, zones: Zones, active: boolean, treeMinM: number) => TreeCheck;
  export const fingerprint: (g: NetworkGeometry, s: ZoneSettings) => string;
  ```

- [ ] **Step 1: Add the dependency**

```bash
cd ~/src/inzicht-stack/nextcloud/custom_apps
FORK yarn workspace @excalidraw/excalidraw add clipper-lib@6.4.2
FORK yarn add -W -D @types/clipper-lib@6.4.0
```
Expected: `packages/excalidraw/package.json` lists `"clipper-lib": "6.4.2"`; `yarn.lock` updated.

- [ ] **Step 2: Write the failing tests**

`packages/excalidraw/vrijtrace/geometry.test.ts`:

```ts
import { checkTree, computeZones, distanceToPolygons, fingerprint, pointInPolygons } from "./geometry";
import type { NetworkGeometry, Polygons, ZoneSettings } from "./geometry";

const area = (polys: Polygons) =>
  Math.abs(polys.reduce((sum, ring) => sum + ring.reduce((s, p, i) => {
    const q = ring[(i + 1) % ring.length];
    return s + p.x * q.y - q.x * p.y;
  }, 0) / 2, 0));

const line: NetworkGeometry = {
  nodes: [{ id: "a", x: 0, y: 0 }, { id: "b", x: 10, y: 0 }],
  segments: [{ id: "s", a: "a", b: "b", widthM: 1 }],
};
const both: ZoneSettings = { redSide: "beide", workWidthM: 1.5, workSide: "beide" };

describe("computeZones", () => {
  it("buffers the trench with round ends", () => {
    expect(area(computeZones(line, both).trench)).toBeCloseTo(10 + Math.PI * 0.25, 1);
  });

  it("cuts the trench out of the red zone (2.00 m beyond the edge)", () => {
    const z = computeZones(line, both);
    const capsule = 10 * 5 + Math.PI * 2.5 * 2.5;
    expect(area(z.red)).toBeCloseTo(capsule - (10 + Math.PI * 0.25), 0);
    expect(pointInPolygons({ x: 5, y: 0 }, z.red)).toBe(false);
    expect(pointInPolygons({ x: 5, y: 2.4 }, z.red)).toBe(true);
    expect(pointInPolygons({ x: 5, y: 2.6 }, z.red)).toBe(false);
  });

  it("keeps one side only — left is n = (uy, -ux), i.e. negative y for a→b eastwards", () => {
    const z = computeZones(line, { ...both, redSide: "links" });
    expect(pointInPolygons({ x: 5, y: -1.5 }, z.red)).toBe(true);
    expect(pointInPolygons({ x: 5, y: 1.5 }, z.red)).toBe(false);
  });

  it("shows overlap without adding widths", () => {
    const z = computeZones(line, { ...both, workWidthM: 4 });
    expect(area(z.overlap)).toBeCloseTo(area(z.red), 0);
    expect(pointInPolygons({ x: 5, y: 3.5 }, z.red)).toBe(false);
    expect(pointInPolygons({ x: 5, y: 3.5 }, z.work)).toBe(true);
  });

  it("joins a T-junction into one outline", () => {
    const t: NetworkGeometry = {
      nodes: [...line.nodes, { id: "c", x: 5, y: 0 }, { id: "d", x: 5, y: 6 }],
      segments: [...line.segments, { id: "t", a: "c", b: "d", widthM: 1 }],
    };
    expect(computeZones(t, both).trench).toHaveLength(1);
  });
});

describe("checkTree", () => {
  const z = computeZones(line, both);
  it("measures to the trench edge from outside and inside", () => {
    expect(distanceToPolygons({ x: 5, y: 4 }, z.trench)).toBeCloseTo(3.5, 1);
    const inside = checkTree({ x: 5, y: 0.2 }, z, true, 5);
    expect(inside).toMatchObject({ inside: true, pass: false });
    expect(inside.distanceM).toBeCloseTo(0.3, 1);
  });
  it("changing the minimum changes only the verdict", () => {
    const a = checkTree({ x: 5, y: 4 }, z, true, 5);
    const b = checkTree({ x: 5, y: 4 }, z, true, 3);
    expect(a.distanceM).toBe(b.distanceM);
    expect([a.pass, b.pass]).toEqual([false, true]);
  });
  it("reports zones only while active", () => {
    expect(checkTree({ x: 5, y: 2 }, z, false, 5)).toMatchObject({ red: null, work: null });
    expect(checkTree({ x: 5, y: 2 }, z, true, 5)).toMatchObject({ red: true, work: false });
  });
  it("has no answer without a trench", () => {
    const empty = computeZones({ nodes: [], segments: [] }, both);
    expect(checkTree({ x: 1, y: 1 }, empty, true, 5)).toEqual({ inside: false, distanceM: null, pass: null, red: null, work: null });
  });
});

describe("fingerprint", () => {
  it("is stable for the same input and changes with geometry or settings", () => {
    const f = fingerprint(line, both);
    expect(fingerprint(JSON.parse(JSON.stringify(line)), both)).toBe(f);
    expect(fingerprint({ ...line, nodes: [line.nodes[0], { id: "b", x: 10.05, y: 0 }] }, both)).not.toBe(f);
    expect(fingerprint(line, { ...both, workSide: "rechts" })).not.toBe(f);
  });
  it("ignores segment and node order", () => {
    const shuffled = { nodes: [...line.nodes].reverse(), segments: line.segments };
    expect(fingerprint(shuffled, both)).toBe(fingerprint(line, both));
  });
});
```

- [ ] **Step 3: Run — fails** (`FORK yarn -s vitest run packages/excalidraw/vrijtrace/geometry.test.ts`; expected: cannot resolve `./geometry`).

- [ ] **Step 4: Implement `geometry.ts`**

```ts
import ClipperLib from "clipper-lib";

import type { VrijTraceSide } from "@excalidraw/element/types";

export type Pt = { x: number; y: number };
export type Polygons = Pt[][];
export type GeoNode = { id: string; x: number; y: number };
export type GeoSegment = { id: string; a: string; b: string; widthM: number };
export type NetworkGeometry = { nodes: GeoNode[]; segments: GeoSegment[] };
export type ZoneSettings = { redSide: VrijTraceSide; workWidthM: number; workSide: VrijTraceSide };
export type Zones = { trench: Polygons; red: Polygons; work: Polygons; overlap: Polygons };
export type TreeCheck = {
  inside: boolean;
  distanceM: number | null;
  pass: boolean | null;
  red: boolean | null;
  work: boolean | null;
};

/** v8.2: the damage-prevention zone is always 2.00 m beyond the trench edge */
export const RED_ZONE_M = 2;

// Clipper works on integers: 1 unit = 1 mm. Arc tolerance 1 cm.
const SCALE = 1000;
const ARC_TOLERANCE = 10;

type CPath = { X: number; Y: number }[];
const toC = (p: Pt) => ({ X: Math.round(p.x * SCALE), Y: Math.round(p.y * SCALE) });
const fromC = (paths: CPath[]): Polygons =>
  paths.map((path) => path.map((q) => ({ x: q.X / SCALE, y: q.Y / SCALE })));

const clip = (subject: CPath[], clipPaths: CPath[], type: number): CPath[] => {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  if (clipPaths.length) {
    c.AddPaths(clipPaths, ClipperLib.PolyType.ptClip, true);
  }
  const out: CPath[] = [];
  c.Execute(type, out, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return out;
};
const union = (paths: CPath[]) => clip(paths, [], ClipperLib.ClipType.ctUnion);

const capsule = (a: Pt, b: Pt, r: number): CPath[] => {
  const co = new ClipperLib.ClipperOffset(2, ARC_TOLERANCE);
  co.AddPath([toC(a), toC(b)], ClipperLib.JoinType.jtRound, ClipperLib.EndType.etOpenRound);
  const out: CPath[] = [];
  co.Execute(out, r * SCALE);
  return out;
};

/** The side of a→b to keep: "links" is +n with n = (uy, -ux) (y-down frame). */
const sideStrip = (a: Pt, b: Pt, r: number, side: "links" | "rechts"): CPath[] => {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const s = side === "links" ? 1 : -1;
  const nx = uy * s;
  const ny = -ux * s;
  const e = 2 * r;
  const p1 = { x: a.x - ux * e, y: a.y - uy * e };
  const p2 = { x: b.x + ux * e, y: b.y + uy * e };
  return [[p1, p2, { x: p2.x + nx * e, y: p2.y + ny * e }, { x: p1.x + nx * e, y: p1.y + ny * e }].map(toC)];
};

const ends = (g: NetworkGeometry) => {
  const byId = new Map(g.nodes.map((n) => [n.id, n]));
  return g.segments
    .map((s) => ({ s, a: byId.get(s.a), b: byId.get(s.b) }))
    .filter((x): x is { s: GeoSegment; a: GeoNode; b: GeoNode } => !!x.a && !!x.b);
};

const buffered = (g: NetworkGeometry, extraM: number, side: VrijTraceSide): CPath[] => {
  const parts: CPath[] = [];
  for (const { s, a, b } of ends(g)) {
    const r = s.widthM / 2 + extraM;
    const cap = capsule(a, b, r);
    parts.push(
      ...(side === "beide"
        ? cap
        : clip(cap, sideStrip(a, b, r, side), ClipperLib.ClipType.ctIntersection)),
    );
  }
  return parts.length ? union(parts) : [];
};

export const computeZones = (g: NetworkGeometry, s: ZoneSettings): Zones => {
  const trench = buffered(g, 0, "beide");
  const red = clip(buffered(g, RED_ZONE_M, s.redSide), trench, ClipperLib.ClipType.ctDifference);
  const work = clip(buffered(g, s.workWidthM, s.workSide), trench, ClipperLib.ClipType.ctDifference);
  const overlap = red.length && work.length ? clip(red, work, ClipperLib.ClipType.ctIntersection) : [];
  return { trench: fromC(trench), red: fromC(red), work: fromC(work), overlap: fromC(overlap) };
};

export const pointInPolygons = (p: Pt, polys: Polygons): boolean => {
  let inside = false;
  for (const ring of polys) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i];
      const b = ring[j];
      if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
        inside = !inside;
      }
    }
  }
  return inside;
};

const pointSegment = (p: Pt, a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};

export const distanceToPolygons = (p: Pt, polys: Polygons): number => {
  let best = Infinity;
  for (const ring of polys) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      best = Math.min(best, pointSegment(p, ring[j], ring[i]));
    }
  }
  return best;
};

export const checkTree = (p: Pt, zones: Zones, active: boolean, treeMinM: number): TreeCheck => {
  if (!zones.trench.length) {
    return { inside: false, distanceM: null, pass: null, red: null, work: null };
  }
  const inside = pointInPolygons(p, zones.trench);
  const distanceM = distanceToPolygons(p, zones.trench);
  return {
    inside,
    distanceM,
    pass: !inside && distanceM + 1e-9 >= treeMinM,
    red: active ? pointInPolygons(p, zones.red) : null,
    work: active ? pointInPolygons(p, zones.work) : null,
  };
};

const hash = (text: string) => {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
};

/** Geometry + zone settings, in centimetres in the page frame. */
export const fingerprint = (g: NetworkGeometry, s: ZoneSettings): string => {
  const cm = (n: number) => Math.round(n * 100);
  const byId = <T extends { id: string }>(x: T, y: T) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0);
  const nodes = [...g.nodes].sort(byId).map((n) => `${n.id}:${cm(n.x)},${cm(n.y)}`).join(";");
  const segs = [...g.segments].sort(byId).map((x) => `${x.id}:${x.a}-${x.b}:${cm(x.widthM)}`).join(";");
  return hash(`${nodes}|${segs}|${s.redSide}|${cm(s.workWidthM)}|${s.workSide}`);
};
```

- [ ] **Step 5: Run — passes** (expected: all tests in the file pass). If `import ClipperLib from "clipper-lib"` fails under the bundler, use `import * as ClipperLib from "clipper-lib";`.

- [ ] **Step 6: Commit** — `feat(vrijtrace): trench, zone and tree-check geometry` (add `package.json`s, `yarn.lock`, `vrijtrace/geometry*`).

---

### Task 4: Page model

**Files:**
- Create: `packages/excalidraw/vrijtrace/model.ts`
- Test: `packages/excalidraw/vrijtrace/model.test.ts`

**Interfaces:**
- Consumes: Task 1 types/guards; Task 3 `NetworkGeometry`, `ZoneSettings`, `Zones`, `computeZones`, `fingerprint`; `isValidCmPerPx` from `../data/library`.
- Produces:
  ```ts
  export const networkIdForPage: (pdfId: string) => string;            // "vrijtrace-<pdfId>"
  export const isPdfPage: (el: ExcalidrawElement | null | undefined) => el is ExcalidrawImageElement;
  export type PageFrame = { id: string; x: number; y: number; width: number; height: number; angle: number; cmPerPx: number | null };
  export const getPageFrame: (page: ExcalidrawImageElement) => PageFrame;
  export const sceneToPage: (f: PageFrame, p: Pt) => Pt;   // metres, page's own unrotated frame, origin top-left
  export const pageToScene: (f: PageFrame, m: Pt) => Pt;
  export const pxPerMetre: (f: PageFrame) => number;
  export const centreOf: (el: { x: number; y: number; width: number; height: number }) => Pt;
  export type PageParts = { network: ExcalidrawTrenchElement | null; nodes: ExcalidrawTrenchElement[]; segments: ExcalidrawTrenchElement[]; trees: ExcalidrawTrenchElement[] };
  export const getPageParts: (elements: readonly ExcalidrawElement[], pdfId: string) => PageParts;
  export const DEFAULT_SETTINGS: { redSide: "beide"; workWidthM: 1.5; workSide: "beide"; treeMinM: 5 };
  export const settingsOf: (network: ExcalidrawTrenchElement | null) => ZoneSettings & { treeMinM: number };
  export const MIN_SEGMENT_PX = 3;
  export const toGeometry: (parts: PageParts, frame: PageFrame) => NetworkGeometry;
  export const displayLabels: (trees: ExcalidrawTrenchElement[]) => Map<string, string>;
  export const nextTreeLabel: (trees: ExcalidrawTrenchElement[]) => string;
  export type PageState = { frame: PageFrame; parts: PageParts; geometry: NetworkGeometry; settings: ZoneSettings & { treeMinM: number }; zones: Zones; fingerprint: string; active: boolean };
  export const pageState: (elements: readonly ExcalidrawElement[], page: ExcalidrawImageElement) => PageState | null; // null when uncalibrated
  ```

- [ ] **Step 1: Write the failing tests**

```ts
import { newTrenchElement, newImageElement } from "@excalidraw/element";

import {
  displayLabels, getPageFrame, getPageParts, nextTreeLabel, pageState,
  pageToScene, sceneToPage, toGeometry,
} from "./model";

const page = (over: any = {}) => ({
  ...newImageElement({ type: "image", x: 100, y: 50, width: 1000, height: 700, fileId: "f" as any }),
  id: "pdf1", customData: { isPdf: true, pdfCmPerPx: 5 }, ...over,
}) as any;
const node = (id: string, x: number, y: number) => newTrenchElement({ id, trench: { kind: "node" }, pdfParentId: "pdf1", x: x - 0.5, y: y - 0.5 });
const seg = (id: string, a: string, b: string) => newTrenchElement({ id, trench: { kind: "segment", a, b, widthM: 1 }, pdfParentId: "pdf1", x: 0, y: 0 });
const tree = (id: string, label: string) => newTrenchElement({ id, trench: { kind: "tree", label }, pdfParentId: "pdf1", x: 0, y: 0 });

describe("page frame", () => {
  it("round-trips scene ⇄ metres, also when rotated", () => {
    const f = getPageFrame(page({ angle: 0.4 }));
    const p = { x: 420.5, y: 333.25 };
    const back = pageToScene(f, sceneToPage(f, p));
    expect(back.x).toBeCloseTo(p.x, 6);
    expect(back.y).toBeCloseTo(p.y, 6);
    expect(sceneToPage(getPageFrame(page()), { x: 120, y: 50 })).toEqual({ x: 1, y: 0 }); // 20 px * 5 cm
  });
});

describe("valid geometry", () => {
  it("keeps only segments with two existing, distinct, separated nodes", () => {
    const els = [page(), node("n1", 200, 200), node("n2", 400, 200), node("n3", 401, 201),
      seg("s1", "n1", "n2"), seg("s2", "n2", "n3"), seg("s3", "n1", "gone"), seg("s4", "n1", "n1")];
    const g = toGeometry(getPageParts(els, "pdf1"), getPageFrame(els[0] as any));
    expect(g.segments.map((s) => s.id)).toEqual(["s1", "s2"]);
    const els2 = [page(), node("n1", 200, 200), node("n2", 201, 201), seg("s1", "n1", "n2")];
    expect(toGeometry(getPageParts(els2, "pdf1"), getPageFrame(els2[0] as any)).segments).toEqual([]);
  });
});

describe("fingerprint follows the page", () => {
  const build = (p: any, nodes: [number, number][]) => [p, ...nodes.map(([x, y], i) => node("n" + i, x, y)), seg("s1", "n0", "n1"), seg("s2", "n1", "n2")];
  const pts: [number, number][] = [[300, 200], [600, 200], [600, 500]];
  const fp = (els: any[]) => pageState(els, els[0])!.fingerprint;

  it("is unchanged when the page moves", () => {
    expect(fp(build(page({ x: 600, y: 350 }), pts.map(([x, y]) => [x + 500, y + 300])))).toBe(fp(build(page(), pts)));
  });
  it("is unchanged when the page is resized (calibration rescaled)", () => {
    const k = 1.37;
    const resized = page({ width: 1000 * k, height: 700 * k, customData: { isPdf: true, pdfCmPerPx: 5 / k } });
    expect(fp(build(resized, pts.map(([x, y]) => [100 + (x - 100) * k, 50 + (y - 50) * k])))).toBe(fp(build(page(), pts)));
  });
  it("is unchanged when the page is rotated", () => {
    const rotated = page({ angle: 0.4 });
    const f = getPageFrame(rotated);
    const straight = getPageFrame(page());
    const moved = pts.map(([x, y]) => { const m = sceneToPage(straight, { x, y }); const s = pageToScene(f, m); return [s.x, s.y] as [number, number]; });
    expect(fp(build(rotated, moved))).toBe(fp(build(page(), pts)));
  });
  it("changes when the page is recalibrated", () => {
    expect(fp(build(page({ customData: { isPdf: true, pdfCmPerPx: 5.5 } }), pts))).not.toBe(fp(build(page(), pts)));
  });
  it("is null for an uncalibrated page", () => {
    const p = page({ customData: { isPdf: true } });
    expect(pageState([p], p)).toBeNull();
  });
});

describe("tree labels", () => {
  it("fills the lowest free number and marks duplicates", () => {
    expect(nextTreeLabel([tree("t1", "B1"), tree("t3", "B3")])).toBe("B2");
    const labels = displayLabels([tree("b", "B4"), tree("a", "B4"), tree("c", "B1")]);
    expect([labels.get("a"), labels.get("b"), labels.get("c")]).toEqual(["B4", "B4b", "B1"]);
  });
});
```

- [ ] **Step 2: Run — fails** (module missing).

- [ ] **Step 3: Implement `model.ts`**

```ts
import { isImageElement, isTrenchElement } from "@excalidraw/element";

import type {
  ExcalidrawElement,
  ExcalidrawImageElement,
  ExcalidrawTrenchElement,
} from "@excalidraw/element/types";

import { isValidCmPerPx } from "../data/library";

import { computeZones, fingerprint } from "./geometry";

import type { NetworkGeometry, Pt, ZoneSettings, Zones } from "./geometry";

export const networkIdForPage = (pdfId: string) => `vrijtrace-${pdfId}`;

export const isPdfPage = (
  el: ExcalidrawElement | null | undefined,
): el is ExcalidrawImageElement =>
  !!el && isImageElement(el) && el.customData?.isPdf === true && !el.isDeleted;

export type PageFrame = {
  id: string; x: number; y: number; width: number; height: number; angle: number;
  cmPerPx: number | null;
};

export const getPageFrame = (page: ExcalidrawImageElement): PageFrame => ({
  id: page.id, x: page.x, y: page.y, width: page.width, height: page.height, angle: page.angle,
  cmPerPx: isValidCmPerPx(page.customData?.pdfCmPerPx) ? page.customData!.pdfCmPerPx : null,
});

const rotate = (p: Pt, c: Pt, angle: number): Pt => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * cos - dy * sin, y: c.y + dx * sin + dy * cos };
};
const centre = (f: PageFrame): Pt => ({ x: f.x + f.width / 2, y: f.y + f.height / 2 });

export const pxPerMetre = (f: PageFrame) => 100 / f.cmPerPx!;

export const sceneToPage = (f: PageFrame, p: Pt): Pt => {
  const q = rotate(p, centre(f), -f.angle);
  const k = f.cmPerPx! / 100;
  return { x: (q.x - f.x) * k, y: (q.y - f.y) * k };
};

export const pageToScene = (f: PageFrame, m: Pt): Pt => {
  const k = pxPerMetre(f);
  return rotate({ x: f.x + m.x * k, y: f.y + m.y * k }, centre(f), f.angle);
};

export const centreOf = (el: { x: number; y: number; width: number; height: number }): Pt => ({
  x: el.x + el.width / 2,
  y: el.y + el.height / 2,
});

export type PageParts = {
  network: ExcalidrawTrenchElement | null;
  nodes: ExcalidrawTrenchElement[];
  segments: ExcalidrawTrenchElement[];
  trees: ExcalidrawTrenchElement[];
};

export const getPageParts = (elements: readonly ExcalidrawElement[], pdfId: string): PageParts => {
  const parts: PageParts = { network: null, nodes: [], segments: [], trees: [] };
  for (const el of elements) {
    if (!isTrenchElement(el) || el.isDeleted || el.customData?.pdfParentId !== pdfId) {
      continue;
    }
    switch (el.trench.kind) {
      case "network":
        parts.network = el;
        break;
      case "node":
        parts.nodes.push(el);
        break;
      case "segment":
        parts.segments.push(el);
        break;
      case "tree":
        parts.trees.push(el);
        break;
    }
  }
  return parts;
};

export const DEFAULT_SETTINGS = { redSide: "beide", workWidthM: 1.5, workSide: "beide", treeMinM: 5 } as const;

export const settingsOf = (network: ExcalidrawTrenchElement | null) =>
  network && network.trench.kind === "network"
    ? { redSide: network.trench.redSide, workWidthM: network.trench.workWidthM, workSide: network.trench.workSide, treeMinM: network.trench.treeMinM }
    : { ...DEFAULT_SETTINGS };

export const MIN_SEGMENT_PX = 3;

/** v8.2 req. 9: only visible, valid segments count; unused nodes are ignored. */
export const toGeometry = (parts: PageParts, frame: PageFrame): NetworkGeometry => {
  const nodeById = new Map(parts.nodes.map((n) => [n.id, n]));
  const segments: NetworkGeometry["segments"] = [];
  const used = new Set<string>();
  for (const s of parts.segments) {
    if (s.trench.kind !== "segment") {
      continue;
    }
    const { a, b, widthM } = s.trench;
    const na = nodeById.get(a);
    const nb = nodeById.get(b);
    if (!na || !nb || a === b) {
      continue;
    }
    const ca = centreOf(na);
    const cb = centreOf(nb);
    if (Math.hypot(ca.x - cb.x, ca.y - cb.y) < MIN_SEGMENT_PX) {
      continue;
    }
    segments.push({ id: s.id, a, b, widthM });
    used.add(a);
    used.add(b);
  }
  const nodes = parts.nodes
    .filter((n) => used.has(n.id))
    .map((n) => ({ id: n.id, ...sceneToPage(frame, centreOf(n)) }));
  return { nodes, segments };
};

const labelOf = (t: ExcalidrawTrenchElement) => (t.trench.kind === "tree" ? t.trench.label : "B?");

export const displayLabels = (trees: ExcalidrawTrenchElement[]) => {
  const out = new Map<string, string>();
  const byLabel = new Map<string, ExcalidrawTrenchElement[]>();
  for (const t of trees) {
    byLabel.set(labelOf(t), [...(byLabel.get(labelOf(t)) ?? []), t]);
  }
  for (const [label, group] of byLabel) {
    group.sort((x, y) => (x.id < y.id ? -1 : 1)).forEach((t, i) => {
      out.set(t.id, i === 0 ? label : label + String.fromCharCode(97 + i));
    });
  }
  return out;
};

export const nextTreeLabel = (trees: ExcalidrawTrenchElement[]) => {
  const used = new Set(trees.map(labelOf));
  for (let i = 1; ; i++) {
    if (!used.has(`B${i}`)) {
      return `B${i}`;
    }
  }
};

const zoneCache = new Map<string, Zones>();

export type PageState = {
  frame: PageFrame;
  parts: PageParts;
  geometry: NetworkGeometry;
  settings: ZoneSettings & { treeMinM: number };
  zones: Zones;
  fingerprint: string;
  active: boolean;
};

/** Everything the renderer and the sidebar need for one page; null if uncalibrated. */
export const pageState = (elements: readonly ExcalidrawElement[], page: ExcalidrawImageElement): PageState | null => {
  const frame = getPageFrame(page);
  if (!frame.cmPerPx) {
    return null;
  }
  const parts = getPageParts(elements, page.id);
  const geometry = toGeometry(parts, frame);
  const settings = settingsOf(parts.network);
  const fp = fingerprint(geometry, settings);
  const key = `${page.id}|${fp}`;
  let zones = zoneCache.get(key);
  if (!zones) {
    zones = computeZones(geometry, settings);
    zoneCache.set(key, zones);
    if (zoneCache.size > 64) {
      zoneCache.delete(zoneCache.keys().next().value!);
    }
  }
  const activation = parts.network?.trench.kind === "network" ? parts.network.trench.activation : null;
  return { frame, parts, geometry, settings, zones, fingerprint: fp, active: activation?.fingerprint === fp };
};
```

- [ ] **Step 4: Run — passes.** **Step 5: Commit** — `feat(vrijtrace): page model, valid geometry and fingerprint`.

---

### Task 5: Editing operations (v8.2 drawing rules)

**Files:**
- Create: `packages/excalidraw/vrijtrace/editing.ts`
- Test: `packages/excalidraw/vrijtrace/editing.test.ts`

**Interfaces:**
- Consumes: Task 4 `PageParts`, `PageFrame`, `pageToScene`, `centreOf`.
- Produces:
  ```ts
  export type WNode = { id: string; x: number; y: number };                // scene px centre
  export type WSegment = { id: string; a: string; b: string; widthM: number };
  export type Working = { nodes: WNode[]; segments: WSegment[] };
  export type Snap = "90" | "45" | "vrij";
  export type Reference = "midden" | "links" | "rechts";
  export type DrawOptions = { snap: Snap; reference: Reference; widthM: number; pxPerMetre: number; snapPx: number; newId: () => string };
  export const fromParts: (parts: PageParts) => Working;
  export const cloneWorking: (w: Working) => Working;
  export const nearNode: (w: Working, p: Pt, th: number, except?: string) => WNode | null;
  export const drawEndpoints: (w: Working, start: Pt, raw: Pt, o: DrawOptions) => { a: Pt; b: Pt } | null;
  export const addSegment: (w: Working, start: Pt, raw: Pt, o: DrawOptions) => string | null; // end node id
  export const dropNode: (w: Working, id: string, mergePx: number) => void;
  export const deleteSegment: (w: Working, id: string) => void;
  export const prune: (w: Working) => void;
  export type Diff = { addedNodes: WNode[]; movedNodes: WNode[]; removedNodes: string[]; addedSegments: WSegment[]; changedSegments: WSegment[]; removedSegments: string[] };
  export const diffWorking: (before: Working, after: Working) => Diff;
  export const exampleNetwork: (frame: PageFrame, newId: () => string) => { working: Working; trees: { label: string; x: number; y: number }[] };
  ```
  `snapPx` is v8.2's 13 board px converted to scene px (`13 / zoom`); the other v8.2 thresholds derive from it: segment hit `snapPx·10/13`, split-onto-node `snapPx·3/13`, crossing-onto-node `snapPx·2/13`, minimum new segment `snapPx·4/13`.

- [ ] **Step 1: Write the failing tests**

```ts
import { addSegment, deleteSegment, diffWorking, dropNode, drawEndpoints } from "./editing";
import type { DrawOptions, Working } from "./editing";

let n = 0;
const opts = (over: Partial<DrawOptions> = {}): DrawOptions => ({
  snap: "90", reference: "midden", widthM: 1, pxPerMetre: 20, snapPx: 13, newId: () => `id${++n}`, ...over,
});
const empty = (): Working => ({ nodes: [], segments: [] });

describe("drawing (v8.2 rules)", () => {
  it("snaps to 90° by default", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 3 }, opts());
    expect(w.nodes.map(({ x, y }) => [Math.round(x), Math.round(y)])).toEqual([[0, 0], [100, 0]]);
    expect(w.segments).toHaveLength(1);
  });
  it("snaps to 45° and draws free", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 90 }, opts({ snap: "45" }));
    const end = w.nodes[1];
    expect(end.x).toBeCloseTo(end.y, 6);
    const v = empty();
    addSegment(v, { x: 0, y: 0 }, { x: 100, y: 90 }, opts({ snap: "vrij" }));
    expect(v.nodes[1]).toMatchObject({ x: 100, y: 90 });
  });
  it("ends on a segment as a T-junction", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 200, y: 0 }, opts());
    addSegment(w, { x: 100, y: -100 }, { x: 100, y: 0 }, opts());
    expect(w.segments).toHaveLength(3);
    expect(w.nodes).toHaveLength(4);
  });
  it("splits both lines where it crosses", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 200, y: 0 }, opts());
    addSegment(w, { x: 100, y: -100 }, { x: 100, y: 100 }, opts());
    expect(w.segments).toHaveLength(4);
    expect(w.nodes).toHaveLength(5);
  });
  it("offsets a left-edge reference by half the width (v8.2: -½w·n)", () => {
    const line = drawEndpoints(empty(), { x: 0, y: 0 }, { x: 100, y: 0 }, opts({ reference: "links" }));
    expect(line!.a.y).toBeCloseTo(10, 6);
  });
  it("starts at an existing node within the snap distance", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 0 }, opts());
    addSegment(w, { x: 105, y: 4 }, { x: 105, y: 100 }, opts());
    expect(w.nodes).toHaveLength(3);
  });
});

describe("moving and deleting", () => {
  it("merges a dropped node into a nearby one", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 0 }, opts());
    addSegment(w, { x: 200, y: 0 }, { x: 200, y: 100 }, opts());
    const moved = w.nodes[1];
    Object.assign(moved, { x: 195, y: 2 });
    dropNode(w, moved.id, 12);
    expect(w.nodes).toHaveLength(3);
    expect(w.segments).toHaveLength(2);
  });
  it("survives dropping a node onto the other end of its own segment", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 0 }, opts());
    addSegment(w, { x: 100, y: 0 }, { x: 100, y: 100 }, opts());
    const end = w.nodes.find((x) => x.x === 100 && x.y === 100)!;
    Object.assign(end, { x: 101, y: 1 });
    expect(() => dropNode(w, end.id, 12)).not.toThrow();
    expect(w.segments).toHaveLength(1);
  });
  it("prunes nodes left without segments", () => {
    const w = empty();
    addSegment(w, { x: 0, y: 0 }, { x: 100, y: 0 }, opts());
    deleteSegment(w, w.segments[0].id);
    expect(w).toEqual({ nodes: [], segments: [] });
  });
  it("draws nothing for a segment back onto its own start", () => {
    const w = empty();
    expect(addSegment(w, { x: 0, y: 0 }, { x: 2, y: 1 }, opts())).toBeNull();
    expect(w).toEqual({ nodes: [], segments: [] });
  });
});

describe("diffWorking", () => {
  it("reports what changed", () => {
    const before = empty();
    addSegment(before, { x: 0, y: 0 }, { x: 100, y: 0 }, opts());
    const after = JSON.parse(JSON.stringify(before)) as Working;
    after.nodes[1].x = 120;
    after.segments[0].widthM = 2;
    const d = diffWorking(before, after);
    expect(d.movedNodes.map((x) => x.id)).toEqual([after.nodes[1].id]);
    expect(d.changedSegments.map((x) => x.widthM)).toEqual([2]);
    expect(d.addedNodes).toEqual([]);
    expect(diffWorking(before, empty()).removedSegments).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement `editing.ts`**

```ts
import { centreOf, pageToScene } from "./model";

import type { PageFrame, PageParts } from "./model";
import type { Pt } from "./geometry";

export type WNode = { id: string; x: number; y: number };
export type WSegment = { id: string; a: string; b: string; widthM: number };
export type Working = { nodes: WNode[]; segments: WSegment[] };
export type Snap = "90" | "45" | "vrij";
export type Reference = "midden" | "links" | "rechts";
export type DrawOptions = {
  snap: Snap; reference: Reference; widthM: number; pxPerMetre: number; snapPx: number; newId: () => string;
};

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const nodeOf = (w: Working, id: string) => w.nodes.find((n) => n.id === id);

export const fromParts = (parts: PageParts): Working => ({
  nodes: parts.nodes.map((n) => ({ id: n.id, ...centreOf(n) })),
  segments: parts.segments.flatMap((s) =>
    s.trench.kind === "segment" ? [{ id: s.id, a: s.trench.a, b: s.trench.b, widthM: s.trench.widthM }] : [],
  ),
});

export const cloneWorking = (w: Working): Working => ({
  nodes: w.nodes.map((n) => ({ ...n })),
  segments: w.segments.map((s) => ({ ...s })),
});

export const nearNode = (w: Working, p: Pt, th: number, except?: string): WNode | null => {
  let best: WNode | null = null;
  let bestD = th;
  for (const n of w.nodes) {
    if (n.id === except) {
      continue;
    }
    const d = dist(n, p);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best;
};

const project = (p: Pt, a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0;
  const q = { x: a.x + t * dx, y: a.y + t * dy };
  return { t, q, d: dist(p, q) };
};

const nearSegment = (w: Working, p: Pt, th: number) => {
  let best: { s: WSegment; q: Pt } | null = null;
  let bestD = th;
  for (const s of w.segments) {
    const a = nodeOf(w, s.a);
    const b = nodeOf(w, s.b);
    if (!a || !b) {
      continue;
    }
    const r = project(p, a, b);
    if (r.d < bestD && r.t > 0.025 && r.t < 0.975) {
      bestD = r.d;
      best = { s, q: r.q };
    }
  }
  return best;
};

const makeNode = (w: Working, p: Pt, o: DrawOptions) => {
  const id = o.newId();
  w.nodes.push({ id, x: p.x, y: p.y });
  return id;
};

const splitSegment = (w: Working, s: WSegment, p: Pt, o: DrawOptions) => {
  const existing = nearNode(w, p, (o.snapPx * 3) / 13);
  if (existing) {
    return existing.id;
  }
  const id = makeNode(w, p, o);
  const oldB = s.b;
  s.b = id;
  w.segments.push({ id: o.newId(), a: id, b: oldB, widthM: s.widthM });
  return id;
};

const nodeAt = (w: Working, p: Pt, o: DrawOptions) => {
  const close = nearNode(w, p, o.snapPx);
  if (close) {
    return close.id;
  }
  const hit = nearSegment(w, p, (o.snapPx * 10) / 13);
  return hit ? splitSegment(w, hit.s, hit.q, o) : makeNode(w, p, o);
};

const constrain = (a: Pt, b: Pt, snap: Snap): Pt => {
  if (snap === "vrij") {
    return b;
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.01) {
    return b;
  }
  const step = snap === "90" ? Math.PI / 2 : Math.PI / 4;
  const angle = Math.round(Math.atan2(dy, dx) / step) * step;
  return { x: a.x + Math.cos(angle) * len, y: a.y + Math.sin(angle) * len };
};

export const drawEndpoints = (w: Working, start: Pt, raw: Pt, o: DrawOptions) => {
  const q = constrain(start, raw, o.snap);
  const dx = q.x - start.x;
  const dy = q.y - start.y;
  const len = Math.hypot(dx, dy);
  if (len < 3) {
    return null;
  }
  const half = (o.widthM * o.pxPerMetre) / 2;
  const offset = o.reference === "links" ? -half : o.reference === "rechts" ? half : 0;
  const nx = dy / len;
  const ny = -dx / len;
  let a = { x: start.x + nx * offset, y: start.y + ny * offset };
  let b = { x: q.x + nx * offset, y: q.y + ny * offset };
  const na = nearNode(w, a, o.snapPx) || nearNode(w, start, o.snapPx);
  const nb = nearNode(w, b, o.snapPx) || nearNode(w, q, o.snapPx);
  if (na) {
    a = { x: na.x, y: na.y };
  }
  if (nb) {
    b = { x: nb.x, y: nb.y };
  }
  return { a, b };
};

const crossing = (a: Pt, b: Pt, c: Pt, d: Pt) => {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const cross = (u: Pt, v: Pt) => u.x * v.y - u.y * v.x;
  const den = cross(r, s);
  if (Math.abs(den) < 1e-4) {
    return null;
  }
  const ca = { x: c.x - a.x, y: c.y - a.y };
  const t = cross(ca, s) / den;
  const u = cross(ca, r) / den;
  return t > 0.001 && t < 0.999 && u > 0.001 && u < 0.999
    ? { p: { x: a.x + t * r.x, y: a.y + t * r.y }, t }
    : null;
};

export const prune = (w: Working) => {
  const seen = new Set<string>();
  const used = new Set<string>();
  w.segments = w.segments.filter((s) => {
    const a = nodeOf(w, s.a);
    const b = nodeOf(w, s.b);
    if (!a || !b || s.a === s.b || dist(a, b) < 3) {
      return false;
    }
    const key = [s.a, s.b].sort().join("|");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    used.add(s.a);
    used.add(s.b);
    return true;
  });
  w.nodes = w.nodes.filter((n) => used.has(n.id));
};

/** v8.2 addSegment: snap, split at a T, split at crossings, chain the pieces. */
export const addSegment = (w: Working, start: Pt, raw: Pt, o: DrawOptions): string | null => {
  const line = drawEndpoints(w, start, raw, o);
  if (!line || dist(line.a, line.b) < (o.snapPx * 4) / 13) {
    return null;
  }
  const ia = nodeAt(w, line.a, o);
  const ib = nodeAt(w, line.b, o);
  if (ia === ib) {
    prune(w);
    return null;
  }
  const A = nodeOf(w, ia)!;
  const B = nodeOf(w, ib)!;
  const cuts = [{ t: 0, id: ia }, { t: 1, id: ib }];
  for (const s of [...w.segments]) {
    const c = crossing(A, B, nodeOf(w, s.a)!, nodeOf(w, s.b)!);
    if (!c) {
      continue;
    }
    const id = nearNode(w, c.p, (o.snapPx * 2) / 13)?.id ?? splitSegment(w, s, c.p, o);
    cuts.push({ t: c.t, id });
  }
  cuts.sort((x, y) => x.t - y.t);
  const ids: string[] = [];
  for (const c of cuts) {
    if (!ids.includes(c.id)) {
      ids.push(c.id);
    }
  }
  for (let i = 1; i < ids.length; i++) {
    const [a, b] = [ids[i - 1], ids[i]];
    if (!w.segments.some((s) => (s.a === a && s.b === b) || (s.a === b && s.b === a))) {
      w.segments.push({ id: o.newId(), a, b, widthM: o.widthM });
    }
  }
  prune(w);
  return nodeOf(w, ib) ? ib : null;
};

export const dropNode = (w: Working, id: string, mergePx: number) => {
  const n = nodeOf(w, id);
  if (!n) {
    return;
  }
  const close = nearNode(w, n, mergePx, id);
  if (close) {
    for (const s of w.segments) {
      if (s.a === id) {
        s.a = close.id;
      }
      if (s.b === id) {
        s.b = close.id;
      }
    }
    w.nodes = w.nodes.filter((x) => x.id !== id);
  }
  prune(w);
};

export const deleteSegment = (w: Working, id: string) => {
  w.segments = w.segments.filter((s) => s.id !== id);
  prune(w);
};

export type Diff = {
  addedNodes: WNode[]; movedNodes: WNode[]; removedNodes: string[];
  addedSegments: WSegment[]; changedSegments: WSegment[]; removedSegments: string[];
};

export const diffWorking = (before: Working, after: Working): Diff => {
  const bn = new Map(before.nodes.map((n) => [n.id, n]));
  const bs = new Map(before.segments.map((s) => [s.id, s]));
  const an = new Set(after.nodes.map((n) => n.id));
  const as = new Set(after.segments.map((s) => s.id));
  return {
    addedNodes: after.nodes.filter((n) => !bn.has(n.id)),
    movedNodes: after.nodes.filter((n) => bn.has(n.id) && (bn.get(n.id)!.x !== n.x || bn.get(n.id)!.y !== n.y)),
    removedNodes: before.nodes.filter((n) => !an.has(n.id)).map((n) => n.id),
    addedSegments: after.segments.filter((s) => !bs.has(s.id)),
    changedSegments: after.segments.filter((s) => {
      const b = bs.get(s.id);
      return !!b && (b.a !== s.a || b.b !== s.b || b.widthM !== s.widthM);
    }),
    removedSegments: before.segments.filter((s) => !as.has(s.id)).map((s) => s.id),
  };
};

// v8.2 example, in v8.2 board px (1100×670, 20 px = 1 m); placed around the page centre.
const EXAMPLE_NODES: [number, number][] = [[235, 245], [420, 245], [615, 245], [615, 440], [420, 440], [790, 245], [860, 340], [310, 510]];
const EXAMPLE_SEGMENTS: [number, number][] = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [3, 6], [6, 7], [5, 8]];
const EXAMPLE_TREES: [string, number, number][] = [["B1", 427, 320], ["B2", 672, 289], ["B3", 900, 445]];

export const exampleNetwork = (frame: PageFrame, newId: () => string) => {
  const cx = (frame.width * frame.cmPerPx!) / 200;
  const cy = (frame.height * frame.cmPerPx!) / 200;
  const at = (x: number, y: number) => pageToScene(frame, { x: cx + (x - 550) / 20, y: cy + (y - 335) / 20 });
  const ids = EXAMPLE_NODES.map(() => newId());
  const working: Working = {
    nodes: EXAMPLE_NODES.map(([x, y], i) => ({ id: ids[i], ...at(x, y) })),
    segments: EXAMPLE_SEGMENTS.map(([a, b]) => ({ id: newId(), a: ids[a - 1], b: ids[b - 1], widthM: 1 })),
  };
  return { working, trees: EXAMPLE_TREES.map(([label, x, y]) => ({ label, ...at(x, y) })) };
};
```

- [ ] **Step 4: Run — passes.** **Step 5: Commit** — `feat(vrijtrace): v8.2 drawing, merge and delete rules`.

---

### Task 6: App state, props and the tool controller

**Files:**
- Modify: `packages/excalidraw/types.ts` (AppState, ExcalidrawProps, `AppClassProperties`), `packages/excalidraw/appState.ts` (defaults + `APP_STATE_STORAGE_CONF`), `packages/excalidraw/index.tsx` (forward props)
- Create: `packages/excalidraw/vrijtrace/controller.ts`, `packages/excalidraw/vrijtrace/strings.ts`
- Modify: `packages/excalidraw/components/App.tsx` (field, pointer routing, keys, tool reset)
- Test: `packages/excalidraw/tests/vrijtrace.test.tsx` (create)

**Interfaces:**
- Consumes: Tasks 1, 4, 5.
- Produces:
  ```ts
  // types.ts
  export type VrijTraceMode = "teken" | "verplaats" | "selecteer" | "verwijder" | "boom" | "boomToevoegen";
  export type VrijTraceDraft = { start: { x: number; y: number }; cur: { x: number; y: number }; preview: { a: { x: number; y: number }; b: { x: number; y: number }; lengthM: number } | null };
  export type VrijTraceUIState = { mode: VrijTraceMode; pageId: string | null; activeTreeId: string | null; selectedSegmentId: string | null; snap: "90" | "45" | "vrij"; reference: "midden" | "links" | "rechts"; widthM: number; hidePdf: boolean; draft: VrijTraceDraft | null };
  export type VrijTraceRemoteHolds = Record<string, { userId: string; name: string; expiresAt: number }>;
  // AppState gains: vrijTrace: VrijTraceUIState; vrijTraceRemoteHolds: VrijTraceRemoteHolds;
  // ExcalidrawProps gains: vrijTraceEnabled?: boolean; vrijTraceUser?: { uid: string; name: string }; onVrijTraceEditing?: (elementIds: string[]) => void;
  // App gains: public vrijTrace: VrijTraceController; public getPdfPageAt(x, y): ExcalidrawImageElement | null
  // controller.ts
  export class VrijTraceController {
    constructor(app: VrijTraceHost);
    pointerDown(p: Pt): void; hover(p: Pt): void;
    setMode(mode: VrijTraceMode): void; moveTree(treeId: string): void; stop(): void;
    setUI(patch: Partial<VrijTraceUIState>): void;
    setWidth(widthM: number, commit: boolean): void;
    updateSettings(patch: Partial<Pick<VrijTraceNetworkData, "redSide" | "workWidthM" | "workSide" | "treeMinM">>, commit: boolean): void;
    activate(): void; finish(): void; deleteSelectedOrMode(): void; example(): void; clear(): void; toggleHidePdf(): void;
    onKeyDown(e: KeyboardEvent): boolean; reset(): void;
    isHeldByOther(elementId: string): string | null; // holder name
  }
  ```

- [ ] **Step 1: Write the failing app tests**

`packages/excalidraw/tests/vrijtrace.test.tsx`:

```tsx
import React from "react";
import { act } from "@testing-library/react";

import { Excalidraw } from "../index";
import { getPageParts } from "../vrijtrace/model";

import { API } from "./helpers/api";
import { Keyboard, Pointer } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;
const mouse = new Pointer("mouse");

export const pdfPage = (over: any = {}) => ({
  ...API.createElement({ type: "image", id: "pdf1", x: 0, y: 0, width: 1000, height: 700 }),
  customData: { isPdf: true, pdfCmPerPx: 5 }, ...over,
});
const parts = () => getPageParts(h.elements, "pdf1");
const tool = () => act(() => h.app.setActiveTool({ type: "custom", customType: "vrijtrace" }));
const click = (x: number, y: number) => { mouse.reset(); mouse.clickAt(x, y); };

describe("Vrij Tracé tool", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} vrijTraceEnabled={true} vrijTraceUser={{ uid: "u1", name: "Jij" }} />);
  });

  it("refuses to draw outside an imported PDF page", () => {
    API.setElements([pdfPage()]);
    tool();
    click(1200, 100);
    expect(h.state.toast?.message).toBe("Sleuven teken je alleen op een geïmporteerde PDF-pagina");
    expect(parts().nodes).toHaveLength(0);
  });

  it("asks for a calibration first", () => {
    API.setElements([pdfPage({ customData: { isPdf: true } })]);
    tool();
    click(100, 100);
    expect(h.state.toast?.message).toBe("Kalibreer eerst de liniaal op deze pagina");
  });

  it("draws a segment with two clicks, creating the page's network once", () => {
    API.setElements([pdfPage()]);
    tool();
    click(100, 100);
    click(300, 104);
    const p = parts();
    expect(p.network?.id).toBe("vrijtrace-pdf1");
    expect(p.nodes).toHaveLength(2);
    expect(p.segments).toHaveLength(1);
    expect(p.nodes.every((n) => n.locked && n.width === 1)).toBe(true);
    expect(h.state.vrijTrace.pageId).toBe("pdf1");
  });

  it("makes one undo step per segment", () => {
    API.setElements([pdfPage()]);
    tool();
    click(100, 100);
    click(300, 100);
    click(300, 300);
    expect(parts().segments).toHaveLength(2);
    Keyboard.undo();
    expect(parts().segments).toHaveLength(1);
  });

  it("drops a draft when its page disappears", () => {
    API.setElements([pdfPage()]);
    tool();
    click(100, 100);
    API.setElements([]);
    click(300, 100);
    expect(h.elements.filter((e) => e.type === "trench")).toHaveLength(0);
    expect(h.state.vrijTrace.draft).toBeNull();
  });

  it("never creates two networks for one page", () => {
    API.setElements([pdfPage()]);
    tool();
    click(100, 100);
    click(300, 100);
    act(() => h.app.vrijTrace.updateSettings({ treeMinM: 4 }, true));
    expect(h.elements.filter((e) => e.type === "trench" && (e as any).trench.kind === "network")).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run — fails** (no `vrijTrace` in state, no customType handling).

- [ ] **Step 3: State, props, strings**

`types.ts`: add the `VrijTrace*` types from **Interfaces**; add to `interface AppState`:
```ts
  /** Vrij Tracé tool state of this user (never synced or saved) */
  vrijTrace: VrijTraceUIState;
  /** trench parts other people are editing, keyed by element id (set by the host) */
  vrijTraceRemoteHolds: VrijTraceRemoteHolds;
```
add to `ExcalidrawProps` (next to `pdfApiUrl`):
```ts
  /** show the Vrij Tracé tool (trench planning on imported PDF pages) */
  vrijTraceEnabled?: boolean;
  /** the current user, recorded when someone activates zones */
  vrijTraceUser?: { uid: string; name: string };
  /** the trench parts this user holds (grabbed or selected) changed */
  onVrijTraceEditing?: (elementIds: string[]) => void;
```
add `vrijTrace: App["vrijTrace"]; getPdfPageAt: App["getPdfPageAt"];` to `AppClassProperties`.

`appState.ts` `getDefaultAppState()`:
```ts
    vrijTrace: {
      mode: "teken", pageId: null, activeTreeId: null, selectedSegmentId: null,
      snap: "90", reference: "midden", widthM: 1, hidePdf: false, draft: null,
    },
    vrijTraceRemoteHolds: {},
```
`APP_STATE_STORAGE_CONF`: `vrijTrace: { browser: false, export: false, server: false }, vrijTraceRemoteHolds: { browser: false, export: false, server: false },`.
`index.tsx`: destructure and forward `vrijTraceEnabled`, `vrijTraceUser`, `onVrijTraceEditing` exactly like `pdfApiUrl`.

`vrijtrace/strings.ts`:
```ts
export const STR = {
  tool: "Vrij Tracé",
  onlyOnPdf: "Sleuven teken je alleen op een geïmporteerde PDF-pagina",
  treesOnlyOnPdf: "Bomen plaats je alleen op een geïmporteerde PDF-pagina",
  calibrateFirst: "Kalibreer eerst de liniaal op deze pagina",
  activated: "Zones geactiveerd",
  notActivated: "Zones niet geactiveerd",
  heldBy: (name: string) => `${name} bewerkt dit punt`,
  editing: (name: string) => `${name} bewerkt`,
  unknownUser: "Onbekend",
  ops: {
    tekenStart: "Tekenmodus · klik een beginpunt",
    tekenNext: "Tekenmodus · klik volgend punt of Voltooi",
    verplaats: "Verplaats punt · sleep een knooppunt",
    selecteer: "Selecteer segment · klik op een sleuf",
    verwijder: "Verwijder segment · klik op een sleuf",
    boom: (label: string) => `Boom verplaatsen · ${label} · klik of sleep`,
    boomToevoegen: "Boom toevoegen · klik op de pagina",
  },
  sections: {
    mode: "1. Tekenmodus", snap: "2. Magnetisch uitlijnen", trench: "3. Sleufinstellingen",
    red: "4. Schadepreventiezone", work: "5. Werkruimte", trees: "6. Bomen en afstandscontrole",
  },
  modes: { teken: "Teken", verplaats: "Verplaats punt", selecteer: "Selecteer segment", verwijder: "Verwijder segment" },
  help: {
    mode: "Klik twee punten of sleep om een sleufsegment te tekenen. Klik op een bestaande lijn voor een aftakking.",
    width: "Van 0,30 tot 2,30 m. Selecteer een segment om de breedte daarvan te wijzigen.",
    red: "Onafhankelijke rode zone vanaf de buitenzijde van de sleuf.",
    trees: "Selecteer een boom en klik of sleep op de tekening om deze te verplaatsen.",
  },
  labels: {
    width: "Sleufbreedte", reference: "Tekenreferentie", middle: "Middenlijn", left: "Linker rand", right: "Rechter rand",
    redDistance: "Afstand buiten sleufrand", side: "Zijde", workWidth: "Breedte buiten sleufrand", treeMin: "Minimale afstand",
    both: "Links en rechts", sideLeft: "Links", sideRight: "Rechts", moveTree: (l: string) => `Verplaats ${l}`,
    addTree: "Boom toevoegen", stop: "Stop",
  },
  actions: {
    activate: "Activeer / herbereken zones", finish: "Voltooi", undo: "↶ Ongedaan maken", delete: "Verwijder segment",
    example: "Voorbeeld", clear: "Wis tracé", hidePdf: "PDF verbergen", showPdf: "PDF tonen",
  },
  table: {
    title: "Boomcontrole", tree: "Boom", inTrench: "In sleuf", distance: "Afstand buitenrand", min: "Min. eis",
    verdict: "Toets", red: "Rode zone", work: "Werkruimte", ok: "Voldoet", conflict: "Conflict", yes: "Ja", no: "Nee",
  },
  legend: { trench: "Sleuf", red: "Schadepreventie", work: "Werkruimte", overlap: "Overlap" },
  count: (s: number, n: number) => `${s} segmenten · ${n} knooppunten`,
  scale: (page: string, pxPerM: string) => `${page}: 1 m = ${pxPerM} px`,
  activatedBy: (name: string, time: string) => `Zones geactiveerd · door ${name}, ${time}`,
  noPage: "Klik met Vrij Tracé op een geïmporteerde PDF-pagina om te beginnen.",
  disclaimer: "Functionele demonstratie. Afstanden en zone-unies zijn schematisch berekend. De tekening is niet maatvoerend gevalideerd voor CAD, landmeetkunde, engineering of formele toetsing.",
} as const;
```

- [ ] **Step 4: Controller**

`vrijtrace/controller.ts`:

```ts
import { randomId, viewportCoordsToSceneCoords } from "@excalidraw/common";
import { newTrenchElement } from "@excalidraw/element";

import type { ExcalidrawImageElement, ExcalidrawTrenchElement, VrijTraceNetworkData } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";

import { addSegment, cloneWorking, deleteSegment, diffWorking, drawEndpoints, dropNode, exampleNetwork, fromParts } from "./editing";
import { DEFAULT_SETTINGS, centreOf, getPageFrame, getPageParts, isPdfPage, networkIdForPage, nextTreeLabel, pageState, pxPerMetre } from "./model";
import { STR } from "./strings";

import type { AppState, ExcalidrawProps, VrijTraceMode, VrijTraceUIState } from "../types";
import type { Working } from "./editing";
import type { Pt } from "./geometry";

export interface VrijTraceHost {
  scene: Scene;
  state: AppState;
  props: ExcalidrawProps;
  setState: (patch: Partial<AppState>) => void;
  setToast: (toast: { message: string; duration?: number } | null) => void;
  getPdfPageAt: (x: number, y: number) => ExcalidrawImageElement | null;
  scheduleCapture: () => void;
  setCursor: (cursor: string) => void;
}

const NODE_HIT = 9; // screen px
const TREE_HIT = 15;
const SEGMENT_HIT = 11;
const DRAG_START = 8; // v8.2: a drag of more than 8 px draws on release
const MERGE_PX = 12;
const SNAP_PX = 13;

type Drag =
  | { type: "draw"; begin: Pt; moved: boolean }
  | { type: "node"; id: string; pageId: string }
  | { type: "tree"; id: string };

export class VrijTraceController {
  private drag: Drag | null = null;
  private held: string[] = [];

  constructor(private app: VrijTraceHost) {}

  private get ui() {
    return this.app.state.vrijTrace;
  }
  private get zoom() {
    return this.app.state.zoom.value;
  }

  setUI(patch: Partial<VrijTraceUIState>) {
    this.app.setState({ vrijTrace: { ...this.ui, ...patch } });
  }

  private hold(ids: string[]) {
    if (ids.join() !== this.held.join()) {
      this.held = ids;
      this.app.props.onVrijTraceEditing?.(ids);
    }
  }

  isHeldByOther(elementId: string): string | null {
    const h = this.app.state.vrijTraceRemoteHolds[elementId];
    return h && h.expiresAt > Date.now() ? h.name : null;
  }

  private page(id: string | null = this.ui.pageId) {
    const el = id ? this.app.scene.getNonDeletedElementsMap().get(id) : null;
    return isPdfPage(el) ? el : null;
  }

  /** Resolve the page under p for creating things; toast + null when refused. */
  private pageForCreate(p: Pt, refusal: string) {
    const page = this.app.getPdfPageAt(p.x, p.y);
    if (!page) {
      this.app.setToast({ message: refusal });
      return null;
    }
    if (!getPageFrame(page).cmPerPx) {
      this.app.setToast({ message: STR.calibrateFirst });
      return null;
    }
    if (page.id !== this.ui.pageId) {
      this.setUI({ pageId: page.id, draft: null, selectedSegmentId: null });
    }
    return page;
  }

  private ensureNetwork(page: ExcalidrawImageElement): ExcalidrawTrenchElement {
    const id = networkIdForPage(page.id);
    const existing = this.app.scene.getElement(id) as ExcalidrawTrenchElement | null;
    if (existing) {
      if (existing.isDeleted) {
        this.app.scene.mutateElement(existing, { isDeleted: false });
      }
      return existing;
    }
    const network = newTrenchElement({
      id,
      pdfParentId: page.id,
      trench: { kind: "network", ...DEFAULT_SETTINGS, activation: null },
      x: page.x, y: page.y, width: page.width, height: page.height, angle: page.angle,
    });
    this.app.scene.insertElementAtIndex(network, this.app.scene.getElementIndex(page.id) + 1);
    return network;
  }

  private working(page: ExcalidrawImageElement): Working {
    return fromParts(getPageParts(this.app.scene.getNonDeletedElements(), page.id));
  }

  private drawOptions(page: ExcalidrawImageElement) {
    return {
      snap: this.ui.snap, reference: this.ui.reference, widthM: this.ui.widthM,
      pxPerMetre: pxPerMetre(getPageFrame(page)), snapPx: SNAP_PX / this.zoom, newId: randomId,
    };
  }

  /** Write the difference between two working copies into the scene. */
  private apply(page: ExcalidrawImageElement, before: Working, after: Working) {
    const d = diffWorking(before, after);
    const network = this.ensureNetwork(page);
    const map = this.app.scene.getElementsMapIncludingDeleted();
    const created = [
      ...d.addedNodes.map((n) => newTrenchElement({ id: n.id, trench: { kind: "node" }, pdfParentId: page.id, x: n.x - 0.5, y: n.y - 0.5 })),
      ...d.addedSegments.map((s) => {
        const a = after.nodes.find((n) => n.id === s.a)!;
        return newTrenchElement({ id: s.id, trench: { kind: "segment", a: s.a, b: s.b, widthM: s.widthM }, pdfParentId: page.id, x: a.x - 0.5, y: a.y - 0.5 });
      }),
    ];
    if (created.length) {
      this.app.scene.insertElementsAtIndex(created, this.app.scene.getElementIndex(network.id) + 1);
    }
    for (const n of d.movedNodes) {
      const el = map.get(n.id);
      el && this.app.scene.mutateElement(el, { x: n.x - 0.5, y: n.y - 0.5 });
    }
    for (const s of d.changedSegments) {
      const el = map.get(s.id);
      el && this.app.scene.mutateElement(el as ExcalidrawTrenchElement, { trench: { kind: "segment", a: s.a, b: s.b, widthM: s.widthM } });
    }
    for (const id of [...d.removedNodes, ...d.removedSegments]) {
      const el = map.get(id);
      el && this.app.scene.mutateElement(el, { isDeleted: true });
    }
  }

  private edit(page: ExcalidrawImageElement, op: (w: Working) => void) {
    const before = this.working(page);
    const after = cloneWorking(before);
    op(after);
    this.apply(page, before, after);
    this.app.scheduleCapture();
  }

  private hitNode(page: ExcalidrawImageElement, p: Pt) {
    const parts = getPageParts(this.app.scene.getNonDeletedElements(), page.id);
    return parts.nodes.find((n) => Math.hypot(centreOf(n).x - p.x, centreOf(n).y - p.y) <= NODE_HIT / this.zoom) ?? null;
  }

  private hitSegment(page: ExcalidrawImageElement, p: Pt) {
    const w = this.working(page);
    const ppm = pxPerMetre(getPageFrame(page));
    for (const s of w.segments) {
      const a = w.nodes.find((n) => n.id === s.a);
      const b = w.nodes.find((n) => n.id === s.b);
      if (!a || !b) {
        continue;
      }
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0;
      const d = Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
      if (d <= Math.max(SEGMENT_HIT / this.zoom, (s.widthM * ppm) / 2)) {
        return s.id;
      }
    }
    return null;
  }

  private refuseHeld(id: string) {
    const name = this.isHeldByOther(id);
    if (name) {
      this.app.setToast({ message: STR.heldBy(name) });
    }
    return !!name;
  }

  private preview(page: ExcalidrawImageElement, start: Pt, cur: Pt) {
    const o = this.drawOptions(page);
    const line = drawEndpoints(this.working(page), start, cur, o);
    return line ? { ...line, lengthM: Math.hypot(line.b.x - line.a.x, line.b.y - line.a.y) / o.pxPerMetre } : null;
  }

  private commitDraw(page: ExcalidrawImageElement, p: Pt) {
    const draft = this.ui.draft!;
    let endId: string | null = null;
    this.edit(page, (w) => {
      endId = addSegment(w, draft.start, p, this.drawOptions(page));
    });
    const end = endId ? this.working(page).nodes.find((n) => n.id === endId) : null;
    this.setUI({ draft: end ? { start: { x: end.x, y: end.y }, cur: p, preview: null } : { ...draft, cur: p } });
  }

  pointerDown(p: Pt) {
    const mode = this.ui.mode;
    if (mode === "teken") {
      const page = this.pageForCreate(p, STR.onlyOnPdf);
      if (!page) {
        return;
      }
      if (!this.ui.draft) {
        const node = this.hitNode(page, p);
        this.setUI({ draft: { start: node ? centreOf(node) : p, cur: p, preview: null } });
        this.beginDrag({ type: "draw", begin: p, moved: false });
      } else {
        this.commitDraw(page, p);
      }
      return;
    }
    if (mode === "boom" || mode === "boomToevoegen") {
      const page = this.pageForCreate(p, STR.treesOnlyOnPdf);
      if (!page) {
        return;
      }
      let treeId = this.ui.activeTreeId;
      if (mode === "boomToevoegen") {
        const trees = getPageParts(this.app.scene.getNonDeletedElements(), page.id).trees;
        const tree = newTrenchElement({ trench: { kind: "tree", label: nextTreeLabel(trees) }, pdfParentId: page.id, x: p.x - 0.5, y: p.y - 0.5 });
        this.ensureNetwork(page);
        this.app.scene.insertElementAtIndex(tree, this.app.scene.getElementIndex(networkIdForPage(page.id)) + 1);
        treeId = tree.id;
        this.setUI({ mode: "boom", activeTreeId: tree.id });
      }
      const tree = treeId ? this.app.scene.getElement(treeId) : null;
      if (!tree || this.refuseHeld(tree.id)) {
        return;
      }
      this.app.scene.mutateElement(tree, { x: p.x - 0.5, y: p.y - 0.5 });
      this.hold([tree.id]);
      this.beginDrag({ type: "tree", id: tree.id });
      return;
    }
    const page = this.app.getPdfPageAt(p.x, p.y) ?? this.page();
    if (!page) {
      return;
    }
    if (mode === "verplaats") {
      const node = this.hitNode(page, p);
      if (node && !this.refuseHeld(node.id)) {
        this.hold([node.id]);
        this.beginDrag({ type: "node", id: node.id, pageId: page.id });
      }
    } else if (mode === "selecteer") {
      const id = this.hitSegment(page, p);
      if (id && this.refuseHeld(id)) {
        return;
      }
      const seg = id ? (this.app.scene.getElement(id) as ExcalidrawTrenchElement) : null;
      this.setUI({ pageId: page.id, selectedSegmentId: id, ...(seg?.trench.kind === "segment" ? { widthM: seg.trench.widthM } : {}) });
      this.hold(id ? [id] : []);
    } else if (mode === "verwijder") {
      const id = this.hitSegment(page, p);
      if (id && !this.refuseHeld(id)) {
        this.edit(page, (w) => deleteSegment(w, id));
      }
    }
  }

  private beginDrag(drag: Drag) {
    this.drag = drag;
    const toScene = (e: PointerEvent) => viewportCoordsToSceneCoords(e, this.app.state);
    const move = (e: PointerEvent) => this.dragMove(toScene(e));
    const up = (e: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.dragEnd(toScene(e));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  private dragMove(p: Pt) {
    const d = this.drag;
    if (!d) {
      return;
    }
    if (d.type === "draw") {
      if (Math.hypot(p.x - d.begin.x, p.y - d.begin.y) > DRAG_START / this.zoom) {
        d.moved = true;
      }
      this.hover(p);
    } else {
      const el = this.app.scene.getElement(d.id);
      el && this.app.scene.mutateElement(el, { x: p.x - 0.5, y: p.y - 0.5 });
    }
  }

  private dragEnd(p: Pt) {
    const d = this.drag;
    this.drag = null;
    if (!d) {
      return;
    }
    if (d.type === "draw") {
      const page = this.page();
      if (!page) {
        this.setUI({ draft: null });
      } else if (d.moved && this.ui.draft) {
        this.commitDraw(page, p);
      }
    } else if (d.type === "node") {
      const page = this.page(d.pageId);
      if (page) {
        this.edit(page, (w) => dropNode(w, d.id, MERGE_PX / this.zoom));
      }
      this.hold([]);
    } else {
      this.app.scheduleCapture();
      this.hold([]);
    }
  }

  hover(p: Pt) {
    const mode = this.ui.mode;
    if (mode === "teken" || mode === "boom" || mode === "boomToevoegen") {
      this.app.setCursor(this.app.getPdfPageAt(p.x, p.y) ? "crosshair" : "not-allowed");
    } else {
      this.app.setCursor("default");
    }
    const draft = this.ui.draft;
    const page = this.page();
    if (draft && page) {
      this.setUI({ draft: { ...draft, cur: p, preview: this.preview(page, draft.start, p) } });
    } else if (draft) {
      this.setUI({ draft: null });
    }
  }

  setMode(mode: VrijTraceMode) {
    this.setUI({ mode, draft: null, activeTreeId: null, ...(mode === "selecteer" ? {} : { selectedSegmentId: null }) });
    this.hold([]);
  }
  moveTree(treeId: string) {
    this.setUI({ mode: "boom", activeTreeId: treeId, draft: null });
  }
  /** v8.2 Stop: back to segment selection */
  stop() {
    this.setMode("selecteer");
  }
  finish() {
    this.setUI({ draft: null });
  }

  setWidth(widthM: number, commit: boolean) {
    const v = Math.min(2.3, Math.max(0.3, widthM));
    const seg = this.ui.selectedSegmentId ? (this.app.scene.getElement(this.ui.selectedSegmentId) as ExcalidrawTrenchElement | null) : null;
    if (seg && !seg.isDeleted && seg.trench.kind === "segment") {
      this.app.scene.mutateElement(seg, { trench: { ...seg.trench, widthM: v } });
      if (commit) {
        this.app.scheduleCapture();
      }
    }
    this.setUI({ widthM: v });
  }

  updateSettings(patch: Partial<Pick<VrijTraceNetworkData, "redSide" | "workWidthM" | "workSide" | "treeMinM">>, commit: boolean) {
    const page = this.page();
    if (!page) {
      return;
    }
    const network = this.ensureNetwork(page);
    if (network.trench.kind === "network") {
      this.app.scene.mutateElement(network, { trench: { ...network.trench, ...patch } });
    }
    if (commit) {
      this.app.scheduleCapture();
    }
  }

  activate() {
    const page = this.page();
    const state = page && pageState(this.app.scene.getNonDeletedElements(), page);
    if (!page || !state) {
      return;
    }
    const network = this.ensureNetwork(page);
    if (network.trench.kind !== "network") {
      return;
    }
    const by = this.app.props.vrijTraceUser ?? { uid: "", name: STR.unknownUser };
    this.app.scene.mutateElement(network, {
      trench: { ...network.trench, activation: { by, at: Date.now(), fingerprint: state.fingerprint } },
    });
    this.app.scheduleCapture();
    this.app.setToast({ message: STR.activated });
  }

  deleteSelectedOrMode() {
    const page = this.page();
    const id = this.ui.selectedSegmentId;
    if (page && id && !this.refuseHeld(id)) {
      this.edit(page, (w) => deleteSegment(w, id));
      this.setUI({ selectedSegmentId: null });
      this.hold([]);
    } else {
      this.setMode("verwijder");
    }
  }

  /** v8.2 Voorbeeld: replace this page's network and trees with the example. */
  example() {
    const page = this.page();
    if (!page || !getPageFrame(page).cmPerPx) {
      return;
    }
    const { working, trees } = exampleNetwork(getPageFrame(page), randomId);
    const before = this.working(page);
    this.apply(page, before, working);
    for (const t of getPageParts(this.app.scene.getNonDeletedElements(), page.id).trees) {
      this.app.scene.mutateElement(t, { isDeleted: true });
    }
    const index = this.app.scene.getElementIndex(networkIdForPage(page.id)) + 1;
    this.app.scene.insertElementsAtIndex(
      trees.map((t) => newTrenchElement({ trench: { kind: "tree", label: t.label }, pdfParentId: page.id, x: t.x - 0.5, y: t.y - 0.5 })),
      index,
    );
    this.setUI({ draft: null, selectedSegmentId: null, activeTreeId: null });
    this.app.scheduleCapture();
  }

  /** v8.2 Wis tracé: nodes and segments go, trees and settings stay. */
  clear() {
    const page = this.page();
    if (page) {
      this.edit(page, (w) => {
        w.nodes = [];
        w.segments = [];
      });
      this.setUI({ draft: null, selectedSegmentId: null });
    }
  }

  toggleHidePdf() {
    this.setUI({ hidePdf: !this.ui.hidePdf });
  }

  /** returns true when the key was handled */
  onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this.stop();
      return true;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && this.ui.selectedSegmentId) {
      this.deleteSelectedOrMode();
      return true;
    }
    return false;
  }

  reset() {
    this.drag = null;
    this.setUI({ draft: null, activeTreeId: null, selectedSegmentId: null });
    this.hold([]);
  }
}
```

(`viewportCoordsToSceneCoords` lives in `@excalidraw/common` in this fork; if it is exported from elsewhere, import it from where `App.tsx` imports it.)

- [ ] **Step 5: Wire it into `App.tsx`**

1. Import `VrijTraceController` from `../vrijtrace/controller`.
2. Declare `public vrijTrace!: VrijTraceController;` with the other public fields, then in the constructor, after `this.scene` and `this.store` exist:
   ```ts
   const app = this;
   this.vrijTrace = new VrijTraceController({
     get scene() { return app.scene; },
     get state() { return app.state; },
     get props() { return app.props; },
     setState: (patch) => app.setState(patch as any),
     setToast: (toast) => app.setToast(toast),
     getPdfPageAt: (x, y) => app.getPdfPageAt(x, y),
     scheduleCapture: () => app.store.scheduleCapture(),
     setCursor: (cursor) => setCursor(app.interactiveCanvas, cursor),
   });
   ```
   Add `public getPdfPageAt = (x: number, y: number) => this.getPdfImageAtPosition(x, y);` next to `getPdfImageAtPosition`.
3. `handleCanvasPointerDown`, first statement (above the text-bubble branch):
   ```ts
   if (this.state.activeTool.type === "custom" && this.state.activeTool.customType === "vrijtrace") {
     if (event.button === 0) {
       this.vrijTrace.pointerDown(viewportCoordsToSceneCoords(event, this.state));
     }
     return;
   }
   ```
4. `handleCanvasPointerMove`, first statement: same condition → `this.vrijTrace.hover(viewportCoordsToSceneCoords(event, this.state)); return;`
5. `onKeyDown` (the class keydown handler), first statement:
   ```ts
   if (this.state.activeTool.type === "custom" && this.state.activeTool.customType === "vrijtrace" && !isWritableElement(event.target) && this.vrijTrace.onKeyDown(event.nativeEvent ?? event)) {
     event.preventDefault();
     return;
   }
   ```
   and the shortcut: where single-letter tool keys are handled, add `if (event.key.toLowerCase() === KEYS.U && this.props.vrijTraceEnabled && !event[KEYS.CTRL_OR_CMD]) { this.setActiveTool({ type: "custom", customType: "vrijtrace" }); event.preventDefault(); return; }` (add `U: "u"` to `KEYS` in `common/src/keys.ts` if missing).
6. `componentDidUpdate(prevProps, prevState)`: when `prevState.activeTool.customType === "vrijtrace"` and the current tool is not → `this.vrijTrace.reset();`.

- [ ] **Step 6: Run — passes.** Then the baseline diffs.

- [ ] **Step 7: Commit** — `feat(vrijtrace): tool state, PDF-only controller and app wiring`.

---

### Task 7: Rendering

**Files:**
- Create: `packages/excalidraw/vrijtrace/render.ts`
- Modify: `packages/excalidraw/renderer/staticScene.ts` (paint loop), `staticSvgScene.ts` (`case "trench"`), `interactiveScene.ts` (after the selection pass, inside the `translate(scrollX, scrollY)` block)
- Test: `packages/excalidraw/tests/vrijtraceRender.test.tsx` (create)

**Interfaces:**
- Consumes: Task 4 `pageState`, `isPdfPage`, `pageToScene`, `centreOf`, `displayLabels`; Task 3 `checkTree`; Task 6 app state.
- Produces:
  ```ts
  export const renderVrijTraceStatic: (ctx: CanvasRenderingContext2D, appState: StaticCanvasAppState, network: ExcalidrawTrenchElement, elementsMap: ElementsMap) => void;
  export const renderVrijTraceSvg: (svgRoot: SVGElement, network: ExcalidrawTrenchElement, elementsMap: ElementsMap, offsetX: number, offsetY: number) => void;
  export const renderVrijTraceInteractive: (ctx: CanvasRenderingContext2D, appState: InteractiveCanvasAppState, elementsMap: ElementsMap) => void;
  export const renderHiddenPdf: (ctx: CanvasRenderingContext2D, appState: StaticCanvasAppState, page: ExcalidrawImageElement) => void;
  export const COLORS: { edge: string; edgeOn: string; fill: string; fillOn: string; centre: string; centreOn: string; red: string; work: string; overlap: string; overlapLine: string };
  ```
  `StaticCanvasAppState` / `InteractiveCanvasAppState` must include `vrijTrace` and `vrijTraceRemoteHolds`: add both keys to the static and interactive app-state pick lists (search for `getRenderableAppState`/`StaticCanvasAppState` in `components/canvases/*.tsx` and `scene/types.ts`), so mode/hide-PDF changes re-render.

- [ ] **Step 1: Write the failing tests**

```tsx
import React from "react";
import { act } from "@testing-library/react";

import { exportToSvg } from "../scene/export";
import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { Pointer } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;
const mouse = new Pointer("mouse");
const pdfPage = () => ({ ...API.createElement({ type: "image", id: "pdf1", x: 0, y: 0, width: 1000, height: 700 }), customData: { isPdf: true, pdfCmPerPx: 5 } });

describe("Vrij Tracé rendering", () => {
  beforeEach(async () => {
    await render(<Excalidraw vrijTraceEnabled={true} />);
    API.setElements([pdfPage()]);
    act(() => h.app.setActiveTool({ type: "custom", customType: "vrijtrace" }));
    mouse.reset(); mouse.clickAt(100, 100); mouse.clickAt(400, 100);
  });

  it("exports the trench, and zones only once activated", async () => {
    const svg1 = await exportToSvg({ elements: h.elements, appState: h.state, files: {} });
    expect(svg1.querySelector("[data-vrijtrace='trench']")).not.toBeNull();
    expect(svg1.querySelector("[data-vrijtrace='red']")).toBeNull();
    act(() => h.app.vrijTrace.activate());
    const svg2 = await exportToSvg({ elements: h.elements, appState: h.state, files: {} });
    expect(svg2.querySelector("[data-vrijtrace='red']")).not.toBeNull();
  });

  it("hides zones again after any edit", async () => {
    act(() => h.app.vrijTrace.activate());
    act(() => h.app.vrijTrace.updateSettings({ workWidthM: 3 }, true));
    const svg = await exportToSvg({ elements: h.elements, appState: h.state, files: {} });
    expect(svg.querySelector("[data-vrijtrace='red']")).toBeNull();
  });

  it("renders the canvases without throwing", () => {
    act(() => h.app.vrijTrace.toggleHidePdf());
    act(() => h.app.vrijTrace.activate());
    expect(() => act(() => h.app.refresh())).not.toThrow();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement `render.ts`**

```ts
import { getClientColor } from "../clients";
import { checkTree } from "./geometry";
import { centreOf, displayLabels, isPdfPage, pageState, pageToScene, pxPerMetre, sceneToPage } from "./model";
import { STR } from "./strings";

import type { ElementsMap, ExcalidrawImageElement, ExcalidrawTrenchElement } from "@excalidraw/element/types";
import type { Polygons } from "./geometry";
import type { PageState } from "./model";
import type { InteractiveCanvasAppState, StaticCanvasAppState } from "../types";

/** v8.2 colours */
export const COLORS = {
  edge: "#343a40", edgeOn: "#315d97", fill: "#ffffff", fillOn: "#c7defa", centre: "#737b83", centreOn: "#6689ae",
  red: "rgba(218,54,65,0.41)", work: "rgba(237,151,41,0.43)", overlap: "rgba(155,92,185,0.43)", overlapLine: "rgba(122,66,156,0.63)",
};

const stateFor = (network: ExcalidrawTrenchElement, elementsMap: ElementsMap) => {
  const page = elementsMap.get(network.customData?.pdfParentId);
  return isPdfPage(page) ? { page, state: pageState([...elementsMap.values()], page) } : null;
};

const tracePath = (ctx: CanvasRenderingContext2D, polys: Polygons, s: PageState) => {
  ctx.beginPath();
  for (const ring of polys) {
    ring.forEach((m, i) => {
      const p = pageToScene(s.frame, m);
      i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    });
    ctx.closePath();
  }
};

const centreLines = (s: PageState) =>
  s.geometry.segments.map((seg) => {
    const a = s.geometry.nodes.find((n) => n.id === seg.a)!;
    const b = s.geometry.nodes.find((n) => n.id === seg.b)!;
    return [pageToScene(s.frame, a), pageToScene(s.frame, b)];
  });

export const renderVrijTraceStatic = (ctx: CanvasRenderingContext2D, appState: StaticCanvasAppState, network: ExcalidrawTrenchElement, elementsMap: ElementsMap) => {
  const found = stateFor(network, elementsMap);
  if (!found?.state) {
    return;
  }
  const s = found.state;
  const z = appState.zoom.value;
  ctx.save();
  ctx.translate(appState.scrollX, appState.scrollY);
  if (s.active) {
    tracePath(ctx, s.zones.work, s); ctx.fillStyle = COLORS.work; ctx.fill("evenodd");
    tracePath(ctx, s.zones.red, s); ctx.fillStyle = COLORS.red; ctx.fill("evenodd");
    tracePath(ctx, s.zones.overlap, s); ctx.fillStyle = COLORS.overlap; ctx.fill("evenodd");
    ctx.save(); ctx.clip("evenodd");
    ctx.strokeStyle = COLORS.overlapLine; ctx.lineWidth = 3 / z;
    const step = 16 / z;
    const { x, y, width, height } = s.frame;
    for (let k = -height; k < width + height; k += step) {
      ctx.beginPath(); ctx.moveTo(x + k, y); ctx.lineTo(x + k - height, y + height); ctx.stroke();
    }
    ctx.restore();
  }
  tracePath(ctx, s.zones.trench, s);
  ctx.fillStyle = s.active ? COLORS.fillOn : COLORS.fill;
  ctx.fill("evenodd");
  ctx.strokeStyle = s.active ? COLORS.edgeOn : COLORS.edge;
  ctx.lineWidth = 1.2 / z;
  ctx.stroke();
  ctx.setLineDash([7 / z, 5 / z]);
  ctx.strokeStyle = s.active ? COLORS.centreOn : COLORS.centre;
  ctx.lineWidth = 1.5 / z;
  for (const [a, b] of centreLines(s)) {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.setLineDash([]);
  const labels = displayLabels(s.parts.trees);
  for (const t of s.parts.trees) {
    const c = centreOf(t);
    const check = checkTree(sceneToPage(s.frame, c), s.zones, s.active, s.settings.treeMinM);
    drawTree(ctx, c, labels.get(t.id)!, z, check.pass === false);
  }
  ctx.restore();
};
```

The tree glyph helper, in the same file (screen-constant size, v8.2 look):

```ts

const drawTree = (ctx: CanvasRenderingContext2D, c: { x: number; y: number }, label: string, z: number, conflict: boolean) => {
  ctx.save();
  ctx.lineWidth = (conflict ? 2.5 : 1.5) / z;
  ctx.strokeStyle = conflict ? "#c92a2a" : "#343a40";
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(c.x, c.y, 12 / z, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#343a40"; ctx.lineWidth = 1.2 / z; ctx.fillStyle = "#e1e3e5";
  ctx.beginPath(); ctx.arc(c.x, c.y, 7.4 / z, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.font = `bold ${11 / z}px sans-serif`;
  const w = ctx.measureText(label).width + 10 / z;
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#8a9197"; ctx.lineWidth = 1 / z;
  ctx.beginPath(); ctx.rect(c.x + 13 / z, c.y - 12 / z, w, 18 / z); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#252d36"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText(label, c.x + 18 / z, c.y - 3 / z);
  ctx.restore();
};
```

SVG export (scene units; each group tagged for tests):

```ts
const SVG_NS = "http://www.w3.org/2000/svg";
const pathD = (polys: Polygons, s: PageState, ox: number, oy: number) =>
  polys.map((ring) => ring.map((m, i) => { const p = pageToScene(s.frame, m); return `${i ? "L" : "M"}${p.x + ox} ${p.y + oy}`; }).join("") + "Z").join("");

export const renderVrijTraceSvg = (svgRoot: SVGElement, network: ExcalidrawTrenchElement, elementsMap: ElementsMap, offsetX: number, offsetY: number) => {
  const found = stateFor(network, elementsMap);
  if (!found?.state) {
    return;
  }
  const s = found.state;
  const doc = svgRoot.ownerDocument!;
  const add = (tag: string, kind: string, d: string, fill: string, stroke = "none", width = 0) => {
    const el = doc.createElementNS(SVG_NS, tag);
    el.setAttribute("data-vrijtrace", kind);
    el.setAttribute("d", d);
    el.setAttribute("fill", fill);
    el.setAttribute("fill-rule", "evenodd");
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-width", String(width));
    svgRoot.appendChild(el);
  };
  if (s.active) {
    add("path", "work", pathD(s.zones.work, s, offsetX, offsetY), COLORS.work);
    add("path", "red", pathD(s.zones.red, s, offsetX, offsetY), COLORS.red);
    add("path", "overlap", pathD(s.zones.overlap, s, offsetX, offsetY), COLORS.overlap);
  }
  add("path", "trench", pathD(s.zones.trench, s, offsetX, offsetY), s.active ? COLORS.fillOn : COLORS.fill, s.active ? COLORS.edgeOn : COLORS.edge, 1.2);
  const labels = displayLabels(s.parts.trees);
  for (const t of s.parts.trees) {
    const c = centreOf(t);
    const g = doc.createElementNS(SVG_NS, "g");
    g.setAttribute("data-vrijtrace", "tree");
    g.innerHTML = `<circle cx="${c.x + offsetX}" cy="${c.y + offsetY}" r="12" fill="#fff" stroke="#343a40" stroke-width="1.5"/><text x="${c.x + offsetX + 16}" y="${c.y + offsetY + 4}" font-size="11" font-weight="bold" fill="#252d36">${labels.get(t.id)}</text>`;
    svgRoot.appendChild(g);
  }
};
```

Interactive layer (current page only, while the tool is active):

```ts
export const renderVrijTraceInteractive = (ctx: CanvasRenderingContext2D, appState: InteractiveCanvasAppState, elementsMap: ElementsMap) => {
  const z = appState.zoom.value;
  // colleagues' holds — always, on every page
  for (const [id, hold] of Object.entries(appState.vrijTraceRemoteHolds ?? {})) {
    const el = elementsMap.get(id);
    if (!el || hold.expiresAt < Date.now()) {
      continue;
    }
    const c = centreOf(el);
    ctx.save();
    ctx.strokeStyle = getClientColor(hold.userId, null);
    ctx.lineWidth = 3 / z;
    ctx.beginPath(); ctx.arc(c.x, c.y, 16 / z, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = `bold ${11.5 / z}px sans-serif`;
    ctx.fillText(STR.editing(hold.name), c.x + 20 / z, c.y - 14 / z);
    ctx.restore();
  }
  if (appState.activeTool.type !== "custom" || appState.activeTool.customType !== "vrijtrace") {
    return;
  }
  const ui = appState.vrijTrace;
  const page = ui.pageId ? elementsMap.get(ui.pageId) : null;
  if (!isPdfPage(page)) {
    return;
  }
  const s = pageState([...elementsMap.values()], page);
  if (!s) {
    return;
  }
  ctx.save();
  // nodes (bigger in Verplaats punt)
  const r = (ui.mode === "verplaats" ? 8 : 5.3) / z;
  ctx.lineWidth = 2 / z; ctx.strokeStyle = COLORS.edge; ctx.fillStyle = "#ffffff";
  for (const n of s.geometry.nodes) {
    const p = pageToScene(s.frame, n);
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  // selected segment
  const sel = s.geometry.segments.find((x) => x.id === ui.selectedSegmentId);
  if (sel) {
    const a = pageToScene(s.frame, s.geometry.nodes.find((n) => n.id === sel.a)!);
    const b = pageToScene(s.frame, s.geometry.nodes.find((n) => n.id === sel.b)!);
    ctx.setLineDash([5 / z, 5 / z]); ctx.strokeStyle = "#111"; ctx.lineWidth = sel.widthM * pxPerMetre(s.frame) + 6 / z; ctx.globalAlpha = 0.75; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.globalAlpha = 1; ctx.setLineDash([]);
  }
  // active tree
  const tree = ui.activeTreeId ? elementsMap.get(ui.activeTreeId) : null;
  if (tree && ui.mode === "boom") {
    const c = centreOf(tree);
    ctx.setLineDash([3 / z, 2 / z]); ctx.strokeStyle = "#343a40"; ctx.lineWidth = 2.5 / z;
    ctx.beginPath(); ctx.arc(c.x, c.y, 15 / z, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }
  // drawing preview with length
  const pv = ui.draft?.preview;
  if (pv) {
    ctx.setLineDash([8 / z, 5 / z]); ctx.strokeStyle = "#555"; ctx.lineWidth = 2 / z;
    ctx.beginPath(); ctx.moveTo(pv.a.x, pv.a.y); ctx.lineTo(pv.b.x, pv.b.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = `${12 / z}px sans-serif`; ctx.fillStyle = "#555";
    ctx.fillText(`${pv.lengthM.toFixed(2).replace(".", ",")} m`, (pv.a.x + pv.b.x) / 2 + 8 / z, (pv.a.y + pv.b.y) / 2 - 8 / z);
  }
  ctx.restore();
};

export const renderHiddenPdf = (ctx: CanvasRenderingContext2D, appState: StaticCanvasAppState, page: ExcalidrawImageElement) => {
  const z = appState.zoom.value;
  ctx.save();
  ctx.translate(appState.scrollX + page.x + page.width / 2, appState.scrollY + page.y + page.height / 2);
  ctx.rotate(page.angle);
  ctx.setLineDash([6 / z, 6 / z]); ctx.strokeStyle = "#868e96"; ctx.lineWidth = 1.2 / z;
  ctx.strokeRect(-page.width / 2, -page.height / 2, page.width, page.height);
  ctx.restore();
};
```

- [ ] **Step 4: Call the renderers**

- `staticScene.ts` paint loop, at the start of the per-element `try` (after the bound-text early return):
  ```ts
  if (isTrenchElement(element)) {
    if (element.trench.kind === "network") {
      renderVrijTraceStatic(context, appState, element, elementsMap);
    }
    return;
  }
  if (appState.vrijTrace?.hidePdf && element.id === appState.vrijTrace.pageId && isPdfPage(element)) {
    renderHiddenPdf(context, appState, element);
    return;
  }
  ```
- `staticSvgScene.ts` `case "trench":` → `if (element.trench.kind === "network") { renderVrijTraceSvg(root, element, elementsMap, offsetX, offsetY); } break;` (use the function's actual root/offset variable names).
- `interactiveScene.ts`: inside the block that already did `context.translate(appState.scrollX, appState.scrollY)`, after the selection rendering: `renderVrijTraceInteractive(context, appState, elementsMap);`.

- [ ] **Step 5: Run — passes**, baseline diffs. **Step 6: Commit** — `feat(vrijtrace): draw trench, zones, trees and editing layer`.

---

### Task 8: Panel, action island and sidebar tab

**Files:**
- Create: `packages/excalidraw/vrijtrace/VrijTracePanel.tsx`, `VrijTraceActions.tsx`, `VrijTraceSidebar.tsx`, `vrijtrace.scss`
- Modify: `packages/excalidraw/components/Actions.tsx` (toolbar button after the text-bubble `ToolButton`), `LayerUI.tsx` (`renderFixedSideContainer` + root), `DefaultSidebar.tsx` (tab), `packages/common/src/constants.ts` (`VRIJTRACE_SIDEBAR_TAB = "vrijtrace"`), `packages/element/src/showSelectedShapeActions.ts` (not for vrijtrace — the panel replaces shape actions)
- Test: `packages/excalidraw/tests/vrijtraceUI.test.tsx` (create)

**Interfaces:**
- Consumes: Task 6 controller (`h.app.vrijTrace`), `STR`; Task 4 `pageState`, `displayLabels`; Task 3 `checkTree`.
- Produces: `data-testid`s used by tests and the live run: `toolbar-vrijtrace`, `vt-mode-<mode>`, `vt-snap-<v>`, `vt-ref-<v>`, `vt-width`, `vt-red-side`, `vt-work-width`, `vt-work-side`, `vt-tree-min`, `vt-tree-<label>`, `vt-tree-add`, `vt-stop`, `vt-activate`, `vt-finish`, `vt-undo`, `vt-delete`, `vt-example`, `vt-clear`, `vt-pdf`, `vt-rows`, `vt-zone-state`, `vt-count`.

- [ ] **Step 1: Write the failing UI tests**

```tsx
import React from "react";
import { act, fireEvent, queryByTestId } from "@testing-library/react";

import { Excalidraw } from "../index";
import { getPageParts } from "../vrijtrace/model";

import { API } from "./helpers/api";
import { Pointer } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;
const mouse = new Pointer("mouse");
const pdfPage = () => ({ ...API.createElement({ type: "image", id: "pdf1", x: 0, y: 0, width: 1000, height: 700 }), customData: { isPdf: true, pdfCmPerPx: 5 } });

describe("Vrij Tracé UI", () => {
  let container: HTMLElement;
  beforeEach(async () => {
    ({ container } = await render(<Excalidraw vrijTraceEnabled={true} vrijTraceUser={{ uid: "u1", name: "Jij" }} />));
    API.setElements([pdfPage()]);
  });
  const byId = (id: string) => queryByTestId(container, id)!;

  it("hides the tool when disabled", async () => {
    const other = await render(<Excalidraw />);
    expect(queryByTestId(other.container, "toolbar-vrijtrace")).toBeNull();
  });

  it("shows v8.2's six sections and the action row", () => {
    fireEvent.click(byId("toolbar-vrijtrace"));
    for (const id of ["vt-mode-teken", "vt-mode-verplaats", "vt-mode-selecteer", "vt-mode-verwijder", "vt-snap-90", "vt-snap-45", "vt-snap-vrij", "vt-width", "vt-ref-links", "vt-red-side", "vt-work-width", "vt-work-side", "vt-tree-min", "vt-tree-add", "vt-stop", "vt-activate", "vt-finish", "vt-undo", "vt-delete", "vt-example", "vt-clear", "vt-pdf"]) {
      expect(byId(id)).not.toBeNull();
    }
  });

  it("Voorbeeld loads the v8.2 example with three trees, Wis tracé keeps the trees", () => {
    fireEvent.click(byId("toolbar-vrijtrace"));
    mouse.reset(); mouse.clickAt(100, 100); // sets the current page
    act(() => h.app.vrijTrace.finish());
    fireEvent.click(byId("vt-example"));
    expect(getPageParts(h.elements, "pdf1").segments).toHaveLength(8);
    expect(getPageParts(h.elements, "pdf1").trees.map((t: any) => t.trench.label).sort()).toEqual(["B1", "B2", "B3"]);
    expect(byId("vt-rows").querySelectorAll("tr")).toHaveLength(3);
    fireEvent.click(byId("vt-clear"));
    expect(getPageParts(h.elements, "pdf1").segments).toHaveLength(0);
    expect(getPageParts(h.elements, "pdf1").trees).toHaveLength(3);
  });

  it("changing the minimum distance changes only the verdict", () => {
    fireEvent.click(byId("toolbar-vrijtrace"));
    mouse.reset(); mouse.clickAt(100, 100);
    act(() => h.app.vrijTrace.finish());
    fireEvent.click(byId("vt-example"));
    const before = byId("vt-rows").textContent;
    fireEvent.change(byId("vt-tree-min"), { target: { value: "0" } });
    const after = byId("vt-rows").textContent;
    const distances = (t: string | null) => (t ?? "").match(/\d+,\d+ m/g)!.filter((_, i) => i % 2 === 0);
    expect(distances(after)).toEqual(distances(before));
    expect(after).not.toEqual(before);
  });

  it("shows the activation state and who activated", () => {
    fireEvent.click(byId("toolbar-vrijtrace"));
    mouse.reset(); mouse.clickAt(100, 100); mouse.clickAt(400, 100);
    expect(byId("vt-zone-state").textContent).toBe("Zones niet geactiveerd");
    fireEvent.click(byId("vt-activate"));
    expect(byId("vt-zone-state").textContent).toMatch(/^Zones geactiveerd · door Jij, \d\d:\d\d$/);
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement the components**

`VrijTracePanel.tsx` (left island; replaces `SelectedShapeActions` while the tool is active):

```tsx
import React from "react";

import { useApp, useExcalidrawElements } from "../components/App";

import { getPageParts, displayLabels, isPdfPage, settingsOf } from "./model";
import { STR } from "./strings";

import type { UIAppState } from "../types";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

export const VrijTracePanel = ({ appState }: { appState: UIAppState }) => {
  const app = useApp();
  const elements = useExcalidrawElements();
  const ui = appState.vrijTrace;
  const vt = app.vrijTrace;
  const page = ui.pageId ? elements.find((e) => e.id === ui.pageId) : null;
  const parts = isPdfPage(page) ? getPageParts(elements, page.id) : null;
  const settings = settingsOf(parts?.network ?? null);
  const labels = parts ? displayLabels(parts.trees) : new Map();
  const opt = (pressed: boolean, testId: string, label: string, onClick: () => void) => (
    <button type="button" className="vt-opt" aria-pressed={pressed} data-testid={testId} onClick={onClick}>{label}</button>
  );
  return (
    <div className="vt-panel">
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.mode}</div>
        <div className="vt-grid2">
          {(["teken", "verplaats", "selecteer", "verwijder"] as const).map((m) => opt(ui.mode === m, `vt-mode-${m}`, STR.modes[m], () => vt.setMode(m)))}
        </div>
        <p className="vt-help">{STR.help.mode}</p>
      </div>
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.snap}</div>
        <div className="vt-grid3">
          {(["90", "45", "vrij"] as const).map((s) => opt(ui.snap === s, `vt-snap-${s}`, s === "vrij" ? "Vrij" : `${s}°`, () => vt.setUI({ snap: s })))}
        </div>
      </div>
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.trench}</div>
        <label className="vt-lbl" htmlFor="vt-width"><span>{STR.labels.width}</span><span>{fmt(ui.widthM)} m</span></label>
        <input id="vt-width" data-testid="vt-width" type="range" min="0.3" max="2.3" step="0.05" value={ui.widthM}
          onChange={(e) => vt.setWidth(Number(e.target.value), false)} onPointerUp={(e) => vt.setWidth(Number((e.target as HTMLInputElement).value), true)} />
        <p className="vt-help">{STR.help.width}</p>
        <div className="vt-lbl">{STR.labels.reference}</div>
        <div className="vt-grid3">
          {opt(ui.reference === "midden", "vt-ref-midden", STR.labels.middle, () => vt.setUI({ reference: "midden" }))}
          {opt(ui.reference === "links", "vt-ref-links", STR.labels.left, () => vt.setUI({ reference: "links" }))}
          {opt(ui.reference === "rechts", "vt-ref-rechts", STR.labels.right, () => vt.setUI({ reference: "rechts" }))}
        </div>
      </div>
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.red}</div>
        <div className="vt-lbl"><span>{STR.labels.redDistance}</span><span>2,00 m</span></div>
        <label className="vt-lbl" htmlFor="vt-red-side">{STR.labels.side}</label>
        <select id="vt-red-side" data-testid="vt-red-side" value={settings.redSide} onChange={(e) => vt.updateSettings({ redSide: e.target.value as any }, true)}>
          <option value="beide">{STR.labels.both}</option><option value="links">{STR.labels.sideLeft}</option><option value="rechts">{STR.labels.sideRight}</option>
        </select>
        <p className="vt-help">{STR.help.red}</p>
      </div>
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.work}</div>
        <label className="vt-lbl" htmlFor="vt-work-width"><span>{STR.labels.workWidth}</span><span>{fmt(settings.workWidthM)} m</span></label>
        <input id="vt-work-width" data-testid="vt-work-width" type="range" min="0.5" max="4" step="0.1" value={settings.workWidthM}
          onChange={(e) => vt.updateSettings({ workWidthM: Number(e.target.value) }, false)} onPointerUp={() => app.store.scheduleCapture()} />
        <label className="vt-lbl" htmlFor="vt-work-side">{STR.labels.side}</label>
        <select id="vt-work-side" data-testid="vt-work-side" value={settings.workSide} onChange={(e) => vt.updateSettings({ workSide: e.target.value as any }, true)}>
          <option value="beide">{STR.labels.both}</option><option value="links">{STR.labels.sideLeft}</option><option value="rechts">{STR.labels.sideRight}</option>
        </select>
      </div>
      <div className="vt-sec">
        <div className="vt-h">{STR.sections.trees}</div>
        <label className="vt-lbl" htmlFor="vt-tree-min"><span>{STR.labels.treeMin}</span><span>{fmt(settings.treeMinM)} m</span></label>
        <input id="vt-tree-min" data-testid="vt-tree-min" type="range" min="0" max="15" step="0.25" value={settings.treeMinM}
          onChange={(e) => vt.updateSettings({ treeMinM: Number(e.target.value) }, true)} />
        <div className="vt-grid2">
          {(parts?.trees ?? []).map((t) => opt(ui.mode === "boom" && ui.activeTreeId === t.id, `vt-tree-${labels.get(t.id)}`, STR.labels.moveTree(labels.get(t.id)!), () => vt.moveTree(t.id)))}
          {opt(ui.mode === "boomToevoegen", "vt-tree-add", STR.labels.addTree, () => vt.setMode("boomToevoegen"))}
          {opt(false, "vt-stop", STR.labels.stop, () => vt.stop())}
        </div>
        <p className="vt-help">{STR.help.trees}</p>
      </div>
    </div>
  );
};
```

(The test `fireEvent.change(vt-tree-min)` relies on React's `onChange` for range inputs; keep `onChange`, not `onInput`. If `app.store` is not on `AppClassProperties`, call `vt.updateSettings({}, true)` in `onPointerUp` instead.)

`VrijTraceActions.tsx` (bottom island):

```tsx
import React from "react";

import { useApp } from "../components/App";

import { STR } from "./strings";

import type { UIAppState } from "../types";

export const VrijTraceActions = ({ appState }: { appState: UIAppState }) => {
  const app = useApp();
  const vt = app.vrijTrace;
  const b = (id: string, label: string, onClick: () => void, primary = false) => (
    <button type="button" className={primary ? "vt-act vt-act--primary" : "vt-act"} data-testid={id} onClick={onClick}>{label}</button>
  );
  return (
    <div className="vt-actions Island">
      {b("vt-activate", STR.actions.activate, () => vt.activate(), true)}
      {b("vt-finish", STR.actions.finish, () => vt.finish())}
      {b("vt-undo", STR.actions.undo, () => app.actionManager.executeAction(app.actionManager.actions.undo, "ui"))}
      {b("vt-delete", STR.actions.delete, () => vt.deleteSelectedOrMode())}
      {b("vt-example", STR.actions.example, () => vt.example())}
      {b("vt-clear", STR.actions.clear, () => vt.clear())}
      {b("vt-pdf", appState.vrijTrace.hidePdf ? STR.actions.showPdf : STR.actions.hidePdf, () => vt.toggleHidePdf())}
    </div>
  );
};
```

`VrijTraceSidebar.tsx` (tab content):

```tsx
import React from "react";

import { useExcalidrawAppState, useExcalidrawElements } from "../components/App";

import { checkTree } from "./geometry";
import { COLORS } from "./render";
import { centreOf, displayLabels, isPdfPage, pageState, pxPerMetre, sceneToPage } from "./model";
import { STR } from "./strings";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");
const yesNo = (v: boolean | null) => (v === null ? "—" : v ? STR.table.yes : STR.table.no);

export const VrijTraceSidebar = () => {
  const appState = useExcalidrawAppState();
  const elements = useExcalidrawElements();
  const page = elements.find((e) => e.id === appState.vrijTrace.pageId);
  const s = isPdfPage(page) ? pageState(elements, page) : null;
  if (!s) {
    return <div className="vt-side"><p className="vt-help">{STR.noPage}</p></div>;
  }
  const labels = displayLabels(s.parts.trees);
  const activation = s.parts.network?.trench.kind === "network" ? s.parts.network.trench.activation : null;
  const time = activation ? new Date(activation.at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "";
  return (
    <div className="vt-side">
      <div className="vt-status">
        <span data-testid="vt-zone-state" className={s.active ? "vt-pill vt-pill--on" : "vt-pill"}>
          {s.active && activation ? STR.activatedBy(activation.by.name, time) : STR.notActivated}
        </span>
        <span data-testid="vt-count">{STR.count(s.geometry.segments.length, s.geometry.nodes.length)}</span>
        <span>{STR.scale((page as any).customData?.originalPdfName ?? "PDF", fmt(pxPerMetre(s.frame)))}</span>
      </div>
      <h3>{STR.table.title}</h3>
      <table className="vt-table">
        <thead><tr><th>{STR.table.tree}</th><th>{STR.table.inTrench}</th><th>{STR.table.distance}</th><th>{STR.table.min}</th><th>{STR.table.verdict}</th><th>{STR.table.red}</th><th>{STR.table.work}</th></tr></thead>
        <tbody data-testid="vt-rows">
          {s.parts.trees.map((t) => {
            const r = checkTree(sceneToPage(s.frame, centreOf(t)), s.zones, s.active, s.settings.treeMinM);
            return (
              <tr key={t.id}>
                <td><b>{labels.get(t.id)}</b></td>
                <td>{yesNo(r.inside)}</td>
                <td>{r.distanceM === null ? "—" : `${fmt(r.distanceM)} m`}</td>
                <td>{fmt(s.settings.treeMinM)} m</td>
                <td className={r.pass === null ? "" : r.pass ? "vt-ok" : "vt-bad"}>{r.pass === null ? "—" : r.pass ? STR.table.ok : STR.table.conflict}</td>
                <td>{yesNo(r.red)}</td>
                <td>{yesNo(r.work)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="vt-legend">
        <span><i style={{ background: COLORS.fill, border: `2px solid ${COLORS.edge}` }} />{STR.legend.trench}</span>
        <span><i style={{ background: COLORS.red }} />{STR.legend.red}</span>
        <span><i style={{ background: COLORS.work }} />{STR.legend.work}</span>
        <span><i style={{ background: COLORS.overlap }} />{STR.legend.overlap}</span>
      </div>
      <p className="vt-help">{STR.disclaimer}</p>
    </div>
  );
};
```

`vrijtrace.scss` — styles for `.vt-panel`, `.vt-sec`, `.vt-h` (12px bold), `.vt-help` (11.5px, `var(--color-gray-60)`), `.vt-grid2`/`.vt-grid3` (CSS grid, 4px gap), `.vt-opt` (Excalidraw button tokens; `[aria-pressed="true"]` uses `var(--color-surface-primary-container)` and `var(--color-primary)`), `.vt-actions` (absolute, `bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; padding: 4px; pointer-events: all`), `.vt-act`, `.vt-act--primary` (`var(--color-primary)` background, white text), `.vt-table` (13px, tabular-nums), `.vt-ok`/`.vt-bad` (`var(--color-success)` / `var(--color-danger)`), `.vt-pill`, `.vt-pill--on`, `.vt-legend i` (18×10 swatches). Import it from `VrijTracePanel.tsx`.

- [ ] **Step 4: Wire the components**

- `Actions.tsx`, after the text-bubble `ToolButton`:
  ```tsx
  {app.props.vrijTraceEnabled && (
    <ToolButton
      type="radio"
      icon={<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M2 7h16M2 13h16M2 10h2.5m3 0h2.5m3 0h2.5" /></svg>}
      checked={activeTool.type === "custom" && activeTool.customType === "vrijtrace"}
      name="editor-current-shape"
      title={`${STR.tool} — U`}
      aria-label={STR.tool}
      aria-keyshortcuts="U"
      keyBindingLabel="U"
      data-testid="toolbar-vrijtrace"
      onChange={() => app.setActiveTool({ type: "custom", customType: "vrijtrace" })}
    />
  )}
  ```
- `LayerUI.tsx` `renderFixedSideContainer`: `const vrijTraceActive = appState.activeTool.type === "custom" && appState.activeTool.customType === "vrijtrace";` and replace `{shouldRenderSelectedShapeActions && renderSelectedShapeActions()}` with
  ```tsx
  {vrijTraceActive ? (
    <Island className={CLASSES.SHAPE_ACTIONS_MENU} padding={2} style={{ maxHeight: `${appState.height - 166}px` }}>
      <VrijTracePanel appState={appState} />
    </Island>
  ) : (shouldRenderSelectedShapeActions && renderSelectedShapeActions())}
  ```
  and render `{vrijTraceActive && <VrijTraceActions appState={appState} />}` inside the layer's root container (next to the footer), so it sits over the canvas.
  Activating the tool also opens the tab: in `controller.setUI`, when `pageId` changes from null, call `this.app.setState({ openSidebar: { name: "default", tab: "vrijtrace" } })` — add `openSidebar` to the host's `setState` patch (it is a normal AppState key).
- `constants.ts`: `export const VRIJTRACE_SIDEBAR_TAB = "vrijtrace";`
- `DefaultSidebar.tsx`: `const props = useAppProps();` then after the library trigger: `{props.vrijTraceEnabled && <Sidebar.TabTrigger tab={VRIJTRACE_SIDEBAR_TAB}>VT</Sidebar.TabTrigger>}` and after the search tab: `{props.vrijTraceEnabled && <Sidebar.Tab tab={VRIJTRACE_SIDEBAR_TAB}><VrijTraceSidebar /></Sidebar.Tab>}`. If the sidebar is closed in the test, `vt-rows`/`vt-zone-state` will not exist — the tests rely on the controller opening it (above).

- [ ] **Step 5: Run — passes**, baseline diffs (including eslint on the new files: `FORK npx eslint --max-warnings=0 packages/excalidraw/vrijtrace`).

- [ ] **Step 6: Commit** — `feat(vrijtrace): v8.2 panel, action row and tree-check sidebar`.

---

### Task 9: Page lifecycle

**Files:**
- Modify: `packages/excalidraw/actions/actionDuplicateSelection.tsx`, the copy path (`components/App.tsx` paste → `addElementsFromPasteOrLibrary` already duplicates; see step 3), `packages/excalidraw/actions/actionElementLock.tsx` (unlock actions)
- Test: `packages/excalidraw/tests/vrijtraceLifecycle.test.tsx` (create)

**Interfaces:** Consumes Task 6's `h.app.vrijTrace`, Task 4 `getPageParts`, `networkIdForPage`, `pageState`.

- [ ] **Step 1: Write the failing tests**

```tsx
import React from "react";
import { act } from "@testing-library/react";

import { actionDuplicateSelection } from "../actions/actionDuplicateSelection";
import { actionDeleteSelected } from "../actions/actionDeleteSelected";
import { actionUnlockAllElements } from "../actions/actionElementLock";
import { distanceConversion } from "../actions";
import { Excalidraw } from "../index";
import { getPageParts, pageState } from "../vrijtrace/model";

import { API } from "./helpers/api";
import { Pointer, UI } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;
const mouse = new Pointer("mouse");
const pdfPage = () => ({ ...API.createElement({ type: "image", id: "pdf1", x: 0, y: 0, width: 1000, height: 700 }), customData: { isPdf: true, pdfCmPerPx: 5 } });
const page = () => h.elements.find((e) => e.id === "pdf1") as any;
const active = () => pageState(h.elements, page())!.active;

describe("Vrij Tracé follows its page", () => {
  beforeEach(async () => {
    await render(<Excalidraw vrijTraceEnabled={true} handleKeyboardGlobally={true} />);
    API.setElements([pdfPage()]);
    act(() => h.app.setActiveTool({ type: "custom", customType: "vrijtrace" }));
    mouse.reset(); mouse.clickAt(100, 100); mouse.clickAt(400, 100);
    act(() => h.app.vrijTrace.finish());
    act(() => h.app.vrijTrace.activate());
    act(() => h.app.setActiveTool({ type: "selection" }));
  });

  it("keeps zones active when the page is moved or resized", () => {
    API.setSelectedElements([page()]);
    mouse.reset(); mouse.downAt(900, 600); mouse.moveTo(1100, 700); mouse.upAt(1100, 700);
    expect(active()).toBe(true);
    UI.resize(page(), "se", [370, 259]);
    expect(active()).toBe(true);
  });

  it("deactivates zones when the page is recalibrated", () => {
    API.executeAction(distanceConversion, { pdfCalibration: { pdfId: "pdf1", cmPerPx: 6 } });
    expect(active()).toBe(false);
  });

  it("deletes the whole network with the page", () => {
    API.setSelectedElements([page()]);
    API.executeAction(actionDeleteSelected);
    expect(h.elements.filter((e) => e.type === "trench" && !e.isDeleted)).toHaveLength(0);
  });

  it("copies the network when the page is duplicated, with remapped ids", () => {
    API.setSelectedElements([page()]);
    API.executeAction(actionDuplicateSelection);
    const copy = h.elements.find((e) => (e as any).customData?.isPdf && e.id !== "pdf1" && !e.isDeleted)!;
    const parts = getPageParts(h.elements, copy.id);
    expect(parts.network?.id).toBe(`vrijtrace-${copy.id}`);
    expect(parts.segments).toHaveLength(1);
    const nodeIds = new Set(parts.nodes.map((n) => n.id));
    expect(parts.segments.every((s: any) => nodeIds.has(s.trench.a) && nodeIds.has(s.trench.b))).toBe(true);
  });

  it("never unlocks trench parts", () => {
    API.executeAction(actionUnlockAllElements);
    expect(h.elements.filter((e) => e.type === "trench").every((e) => e.locked)).toBe(true);
  });
});
```

(Use the action names this fork exports: check `actions/index.ts` for `actionDistanceConversion` and the unlock-all action; adjust the imports, not the assertions.)

- [ ] **Step 2: Run — expected failures:** duplication (children are not copied, ids not remapped) and unlock-all; move/resize/recalibrate/delete may already pass through existing PDF-child handling — keep those tests as regression guards.

- [ ] **Step 3: Duplicate with the page**

In `actionDuplicateSelection.tsx`, before calling `duplicateElements`, extend the selection with every non-deleted trench element whose `customData.pdfParentId` is a selected PDF page. After duplication (where `origIdToDuplicateId` / the returned map is available):

```ts
for (const dup of duplicatedElements) {
  if (!isTrenchElement(dup)) {
    continue;
  }
  const newPage = origIdToDuplicateId.get(dup.customData?.pdfParentId) ?? dup.customData?.pdfParentId;
  if (dup.trench.kind === "network") {
    // fixed id per page
    Object.assign(dup, { id: networkIdForPage(newPage) });
  }
  if (dup.trench.kind === "segment") {
    Object.assign(dup, { trench: { ...dup.trench, a: origIdToDuplicateId.get(dup.trench.a) ?? dup.trench.a, b: origIdToDuplicateId.get(dup.trench.b) ?? dup.trench.b } });
  }
}
```

(`binding.ts:1502` already remaps `customData.pdfParentId`; do the same in the paste path if `addElementsFromPasteOrLibrary` is used for page copy-paste — call one shared helper `remapTrenchIds(duplicated, map)` exported from `vrijtrace/model.ts`.)

- [ ] **Step 4: Never unlock trench parts**

In the unlock action(s) in `actionElementLock.tsx`, skip elements where `isTrenchElement(el)`.

- [ ] **Step 5: Run — passes.** Baseline diffs. **Step 6: Commit** — `feat(vrijtrace): networks follow, copy and delete with their page`.

---

### Task 10: Edit holds in the fork

**Files:**
- Modify: `packages/excalidraw/vrijtrace/controller.ts` (already calls `hold` / `refuseHeld`; this task tests them end to end)
- Test: `packages/excalidraw/tests/vrijtraceHolds.test.tsx` (create)

**Interfaces:** Consumes Task 6 `onVrijTraceEditing`, `vrijTraceRemoteHolds`.

- [ ] **Step 1: Write the tests**

```tsx
import React from "react";
import { act } from "@testing-library/react";

import { Excalidraw } from "../index";
import { getPageParts } from "../vrijtrace/model";
import { centreOf } from "../vrijtrace/model";

import { API } from "./helpers/api";
import { Pointer } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;
const mouse = new Pointer("mouse");
const pdfPage = () => ({ ...API.createElement({ type: "image", id: "pdf1", x: 0, y: 0, width: 1000, height: 700 }), customData: { isPdf: true, pdfCmPerPx: 5 } });

describe("edit holds", () => {
  const onEditing = vi.fn();
  beforeEach(async () => {
    onEditing.mockClear();
    await render(<Excalidraw vrijTraceEnabled={true} onVrijTraceEditing={onEditing} />);
    API.setElements([pdfPage()]);
    act(() => h.app.setActiveTool({ type: "custom", customType: "vrijtrace" }));
    mouse.reset(); mouse.clickAt(100, 100); mouse.clickAt(400, 100);
    act(() => h.app.vrijTrace.setMode("verplaats"));
  });

  it("announces the node being dragged, and its release", () => {
    const node = getPageParts(h.elements, "pdf1").nodes[0];
    const c = centreOf(node);
    mouse.reset(); mouse.downAt(c.x, c.y); mouse.moveTo(c.x + 50, c.y); mouse.upAt(c.x + 50, c.y);
    expect(onEditing.mock.calls.map((x) => x[0])).toEqual([[node.id], []]);
  });

  it("refuses a part someone else holds", () => {
    const node = getPageParts(h.elements, "pdf1").nodes[0];
    act(() => h.setState({ vrijTraceRemoteHolds: { [node.id]: { userId: "u2", name: "Sanne", expiresAt: Date.now() + 8000 } } }));
    const c = centreOf(node);
    mouse.reset(); mouse.downAt(c.x, c.y); mouse.moveTo(c.x + 50, c.y); mouse.upAt(c.x + 50, c.y);
    expect(h.state.toast?.message).toBe("Sanne bewerkt dit punt");
    expect(centreOf(getPageParts(h.elements, "pdf1").nodes.find((n) => n.id === node.id)!).x).toBeCloseTo(c.x);
  });

  it("ignores expired holds", () => {
    const node = getPageParts(h.elements, "pdf1").nodes[0];
    act(() => h.setState({ vrijTraceRemoteHolds: { [node.id]: { userId: "u2", name: "Sanne", expiresAt: Date.now() - 1 } } }));
    expect(h.app.vrijTrace.isHeldByOther(node.id)).toBeNull();
  });
});
```

- [ ] **Step 2: Run** — fix the controller until it passes (expected issues: `hold([])` on drag end, `refuseHeld` before `beginDrag`). **Step 3: Commit** — `test(vrijtrace): edit holds announced and respected`.

---

### Task 11: Whiteboard wiring — feature flag, user, editing broadcast

**Files:**
- Modify: `lib/Service/ConfigService.php`, `lib/Listener/LoadViewerListener.php`, `lib/Listener/BeforeTemplateRenderedListener.php`, `src/App.tsx`, `src/hooks/useSync.ts`, `src/hooks/useCollaboration.ts`
- Test: `tests/integration/vrijtrace.spec.mjs` (create)

**Interfaces:**
- Consumes: fork props `vrijTraceEnabled`, `vrijTraceUser`, `onVrijTraceEditing`, app state `vrijTraceRemoteHolds`.
- Produces: broadcast message `{ type: 'VRIJTRACE_EDITING', payload: { elementIds: string[], userId: string, name: string } }` over `server-volatile-broadcast`; initial state `vrijTraceEnabled`.

- [ ] **Step 1: Branch and failing integration test**

```bash
cd ~/src/inzicht-stack/nextcloud/custom_apps && sudo chown -R payboy:payboy whiteboard && cd whiteboard && git checkout -b feat/vrij-trace
```

`tests/integration/vrijtrace.spec.mjs`:

```js
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest'
import { io } from 'socket.io-client'
import jwt from 'jsonwebtoken'
import { createConfigMock } from './configMock.js'
import ServerManagerModule from '../../websocket_server/Services/ServerService.js'
import ConfigModule from '../../websocket_server/Utilities/ConfigUtility.js'

vi.setConfig({ testTimeout: 10000 })
vi.mock('../../websocket_server/Utilities/ConfigUtility.js', () => ({
	default: createConfigMock({
		NEXTCLOUD_URL: 'http://127.0.0.1:3011', PORT: '3011', HOST: '127.0.0.1', JWT_SECRET_KEY: 'secret',
		USE_TLS: false, STORAGE_STRATEGY: 'lru', MAX_UPLOAD_FILE_SIZE: 2e6, CACHED_TOKEN_TTL: 5 * 60 * 1000, COMPRESSION_ENABLED: false,
	}),
}))

const Config = ConfigModule
const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve))
const client = (id) => io(Config.NEXTCLOUD_URL, { auth: { token: jwt.sign({ roomID: 777, user: { id, name: id } }, Config.JWT_SECRET_KEY) } })

describe('Vrij Tracé collaboration', () => {
	let server, a, b
	beforeAll(async () => {
		server = new ServerManagerModule()
		await server.start()
		a = client('anna'); b = client('bert')
		await Promise.all([once(a, 'connect'), once(b, 'connect')])
		a.emit('join-room', 777); b.emit('join-room', 777)
		await Promise.all([once(a, 'sync-designate'), once(b, 'sync-designate')])
	})
	afterAll(async () => { a?.disconnect(); b?.disconnect(); await server?.gracefulShutdown?.() })

	it('relays VRIJTRACE_EDITING to the other client', async () => {
		const received = once(b, 'client-broadcast')
		const message = { type: 'VRIJTRACE_EDITING', payload: { elementIds: ['n1'], userId: 'anna', name: 'Anna' } }
		a.emit('server-volatile-broadcast', '777', new TextEncoder().encode(JSON.stringify(message)))
		const data = await received
		expect(JSON.parse(new TextDecoder().decode(data))).toEqual(message)
	})

	it('keeps concurrent edits of different trench parts from two clients', async () => {
		const el = (id, x, version) => ({ id, type: 'trench', x, y: 0, width: 1, height: 1, version, versionNonce: version, isDeleted: false, trench: { kind: 'node' }, customData: { pdfParentId: 'pdf1' } })
		const scene = (elements) => new TextEncoder().encode(JSON.stringify({ type: 'SCENE_INIT', payload: { elements } }))
		const toB = once(b, 'client-broadcast')
		a.emit('server-broadcast', '777', scene([el('n1', 10, 2)]), new ArrayBuffer(0))
		const toA = once(a, 'client-broadcast')
		b.emit('server-broadcast', '777', scene([el('n2', 20, 2)]), new ArrayBuffer(0))
		const [atB, atA] = await Promise.all([toB, toA])
		expect(JSON.parse(new TextDecoder().decode(atB)).payload.elements[0].id).toBe('n1')
		expect(JSON.parse(new TextDecoder().decode(atA)).payload.elements[0].id).toBe('n2')
	})
})
```

(If the server's shutdown method has another name, use the one `socket.spec.mjs` uses in its `afterAll`.)

Run: `cd ~/src/inzicht-stack/nextcloud/custom_apps && WB npx vitest run tests/integration/vrijtrace.spec.mjs` — the relay already works, so both tests are expected to **pass**: they pin the server behaviour the design depends on. If either fails, stop and report — the design assumption is wrong.

- [ ] **Step 2: Feature flag (PHP)**

`ConfigService.php`, next to `getDisableExternalLibraries()`:

```php
	public function getVrijTraceEnabled(): bool {
		return $this->appConfig->getAppValueBool('vrijtrace_enabled', false);
	}
```

`LoadViewerListener.php` (after `pdfApiUrl`) and `BeforeTemplateRenderedListener.php` (after `pdfApiUrl`):

```php
		$this->initialState->provideInitialState('vrijTraceEnabled', $this->configService->getVrijTraceEnabled());
```

Check: `docker exec nextcloud-app php -l /var/www/html/custom_apps/whiteboard/lib/Service/ConfigService.php` (and both listeners) → "No syntax errors detected".

- [ ] **Step 3: Send holds (`useSync.ts`)**

Add `VrijTraceEditing = 'VRIJTRACE_EDITING',` to `SyncMessageType`. Add, next to `doSyncCursors`:

```ts
	const heldRef = useRef<string[]>([])
	const sendHeld = useCallback(() => {
		if (!fileId || !socket || collabStatus !== 'online') {
			return
		}
		const user = getCurrentUser()
		const data = {
			type: SyncMessageType.VrijTraceEditing,
			payload: { elementIds: heldRef.current, userId: user?.uid ?? '', name: user?.displayName ?? user?.uid ?? '' },
		}
		socket.emit(SyncMessageType.ServerVolatileBroadcast, `${fileId}`, new TextEncoder().encode(JSON.stringify(data)))
	}, [fileId, socket, collabStatus])

	useEffect(() => {
		const timer = setInterval(() => {
			if (heldRef.current.length) {
				sendHeld()
			}
		}, 3000)
		return () => clearInterval(timer)
	}, [sendHeld])

	const onVrijTraceEditing = useCallback((elementIds: string[]) => {
		heldRef.current = elementIds
		sendHeld()
	}, [sendHeld])
```

and return `onVrijTraceEditing` alongside `onChange, onPointerUpdate`. (Import `getCurrentUser` from `@nextcloud/auth`.)

- [ ] **Step 4: Receive holds (`useCollaboration.ts`)**

Add `VrijTraceEditing = 'VRIJTRACE_EDITING',` to `BroadcastType`. Near the other refs:

```ts
	const remoteHoldsRef = useRef<Record<string, { userId: string, name: string, expiresAt: number }>>({})
	const publishHolds = useCallback(() => {
		const now = Date.now()
		remoteHoldsRef.current = Object.fromEntries(Object.entries(remoteHoldsRef.current).filter(([, h]) => h.expiresAt > now))
		excalidrawAPI?.updateScene({ appState: { vrijTraceRemoteHolds: { ...remoteHoldsRef.current } } as any })
	}, [excalidrawAPI])

	useEffect(() => {
		const timer = setInterval(publishHolds, 2000)
		return () => clearInterval(timer)
	}, [publishHolds])
```

In `handleClientBroadcast`'s switch:

```ts
				case BroadcastType.VrijTraceEditing: {
					const { elementIds, userId, name } = decoded.payload ?? {}
					if (!Array.isArray(elementIds) || typeof userId !== 'string') {
						break
					}
					remoteHoldsRef.current = Object.fromEntries(Object.entries(remoteHoldsRef.current).filter(([, h]) => h.userId !== userId))
					for (const id of elementIds) {
						remoteHoldsRef.current[id] = { userId, name: name || userId, expiresAt: Date.now() + 8000 }
					}
					publishHolds()
					break
				}
```

When the collaborators list is updated (the `room-user-change` handler that builds `newCollaborators`), drop holds of users no longer present: filter `remoteHoldsRef.current` by the remaining user ids and call `publishHolds()`.

- [ ] **Step 5: Pass the props (`src/App.tsx`)**

```tsx
	const vrijTraceEnabled = useMemo(() => loadState('whiteboard', 'vrijTraceEnabled', false) as boolean, [])
	const vrijTraceUser = useMemo(() => {
		const user = getCurrentUser()
		return { uid: user?.uid ?? '', name: user?.displayName ?? user?.uid ?? 'Gast' }
	}, [])
	const { onChange: handleOnChange, onPointerUpdate, onVrijTraceEditing } = useSync()
```

(adapt to how `useSync()` is destructured today) and on `<Excalidraw …>`: `vrijTraceEnabled={vrijTraceEnabled && !isReadOnly}`, `vrijTraceUser={vrijTraceUser}`, `onVrijTraceEditing={onVrijTraceEditing}`.

- [ ] **Step 6: Lint and test**

Run: `WB bash -c "ESLINT_USE_FLAT_CONFIG=false npx eslint src/App.tsx src/hooks/useSync.ts src/hooks/useCollaboration.ts tests/integration/vrijtrace.spec.mjs && npx vitest run tests/integration/vrijtrace.spec.mjs"` → no lint errors, 2 passed.

- [ ] **Step 7: Commit** — `feat(vrijtrace): feature flag, current user and editing broadcast` (then `sudo chown -R www-data:www-data whiteboard`).

---

### Task 12: Build, acceptance on dev, rollout

**Files:** none new; `whiteboard/js/**`, `whiteboard/yarn.lock`, fork tarball.

- [ ] **Step 1: Full fork checks** — baseline diffs for tests, tsc and eslint (Global Constraints). Expected: only the new Vrij Tracé tests added, no new failures.

- [ ] **Step 2: Build** (procedure in memory `whiteboard-build-procedure`):

```bash
cd ~/src/inzicht-stack/nextcloud/custom_apps
FORK bash -c "yarn build:package && cd packages/excalidraw && npm pack"
cp excalidraw/packages/excalidraw/excalidraw-excalidraw-0.18.0.tgz excalidraw/packages/excalidraw/excalidraw-excalidraw-v0.18.0.tgz
sudo chown -R payboy:payboy whiteboard
rm -rf whiteboard/node_modules
# clipper-lib is a new transitive dependency: install WITHOUT --frozen-lockfile once to record it
WB bash -c "yarn install --ignore-engines && yarn build"
grep -l "vrijtrace" whiteboard/js/*.mjs | head -3   # expect at least one chunk
```

Update the two tarball `integrity` lines in `whiteboard/yarn.lock` only if `yarn install` did not (check `git diff yarn.lock`).

- [ ] **Step 3: Enable on dev and bump the cache-buster**

```bash
docker exec -u www-data nextcloud-app php occ config:app:set whiteboard vrijtrace_enabled --value=true --type=boolean
L=$(docker exec -u www-data nextcloud-app php occ config:app:get theming cachebuster); docker exec -u www-data nextcloud-app php occ config:app:set theming cachebuster --value=$((L+1))
sudo chown -R www-data:www-data whiteboard
```

- [ ] **Step 4: Live acceptance — two browser sessions (two Playwright contexts, two throwaway users sharing one board)**. Check and record each line:

| # | Check |
|---|---|
| 1 | Imported PDF, no zones before activation |
| 2 | Draw a loop and a branch; T-junction and crossing split |
| 3 | Teken / Verplaats punt / Selecteer segment / Verwijder segment |
| 4 | 90° default, 45°, Vrij |
| 5 | Width 0.30–2.30 m on new and selected segments; Middenlijn / Linker rand / Rechter rand |
| 6 | Red zone 2.00 m, Links / Rechts / Links en rechts |
| 7 | Werkruimte 0.50–4.00 m, sides |
| 8 | Rounded unions, trench cut out, overlap hatched |
| 9 | Any edit → "Zones niet geactiveerd" for **both** users |
| 10 | Boom toevoegen, Verplaats B*n*, table values |
| 11 | Changing the minimum changes only Toets |
| 12 | Verplaats B*n* and Stop behave as v8.2 |
| 13 | Voorbeeld, Activeer, Ongedaan maken, Verwijder segment, Wis tracé |
| 14 | Disclaimer and page scale shown; refusal off-PDF and on an uncalibrated page |
| C1 | User A drags a node → user B sees "A bewerkt", cannot grab it; A releases → B can |
| C2 | A and B edit different segments at the same time → both edits survive on both screens and after reload |
| C3 | B sees A's activation ("door A, hh:mm") |
| C4 | Move/resize/rotate the page → network follows, zones stay active; recalibrate → zones off |

Delete the throwaway users afterwards.

- [ ] **Step 5: Merge and push**

```bash
cd ~/src/inzicht-stack/nextcloud/custom_apps/excalidraw && git checkout nc-master && git merge --ff-only feat/vrij-trace && git push nc nc-master:master
cd ../whiteboard && git add -A js yarn.lock && git commit -m "feat: rebuild bundle with Vrij Tracé (behind vrijtrace_enabled)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git checkout master && git merge --ff-only feat/vrij-trace && git push origin master
```

- [ ] **Step 6: Deploy to production with the flag off** (production steps in memory `whiteboard-build-procedure`; root password supplied by the user per session): `git pull --ff-only origin master` in `/opt/nextcloud-stack/nextcloud/custom_apps/whiteboard`, bump the theming cache-buster, confirm `occ config:app:get whiteboard vrijtrace_enabled` is empty/false. Verify from outside that the new chunk is served. Turn the flag on only when the client accepts: `occ config:app:set whiteboard vrijtrace_enabled --value=true --type=boolean`.
