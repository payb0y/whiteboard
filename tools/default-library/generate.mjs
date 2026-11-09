/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Writes the default library files (library/*.excalidrawlib) that every user
 * sees under "In Zicht bibliotheek". Each file is one group in the sidebar.
 *
 * The drawings come from the client's own library (client-symbols.excalidrawlib,
 * in the order they drew them); this script names and groups them and sets how
 * each one scales on a calibrated PDF page (customData on every element):
 *
 * - libraryCmPerPx: real size, as agreed with the client: AVP search rings
 *   50-200 m, outdoor AVP 5,00 x 5,00 m, indoor AVP room 4,00 x 3,00 m, ducts
 *   110 / 160 / 200 mm across, tree test rings 3,00 / 1,75 / 2,00 / 1,25 / 1,00 m
 *   (CINH). Each drawing has its own px per metre.
 * - librarySymbol: a symbol with no physical size; never resized.
 *
 * Boring and boogzinker are rebuilt so their length can be dragged while the
 * end circles / the box keep their size. Item ids keep the "inzicht-" prefix:
 * the app never saves those into a user's own library.
 *
 *   node tools/default-library/generate.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '../../library')
const CREATED = Date.UTC(2026, 10, 3)

const source = JSON.parse(readFileSync(join(HERE, 'client-symbols.excalidrawlib'), 'utf8')).libraryItems

/** drawn at this many px per metre on the ground: true to size on a calibrated page */
const realSize = pxPerMetre => ({ libraryCmPerPx: 100 / pxPerMetre })
const SYMBOL = { librarySymbol: true }

/** the client's drawing number n, with stable ids and the given scaling */
const copy = (n, slug, name, customData) => {
	const itemId = `inzicht-${slug}`
	const groups = new Map()
	const elements = source[n].elements.filter(e => !e.isDeleted).map((element, i) => ({
		...element,
		id: `${itemId}-${i}`,
		groupIds: element.groupIds.map(g => {
			if (!groups.has(g)) groups.set(g, `${itemId}-g${groups.size || ''}`)
			return groups.get(g)
		}),
		boundElements: null,
		frameId: null,
		updated: CREATED,
		...(customData ? { customData } : {}),
	}))
	return { id: itemId, status: 'published', created: CREATED, name, elements }
}

const linear = (id, type, x, y, points, style) => ({
	id,
	type,
	x,
	y,
	width: Math.max(...points.map(p => p[0])) - Math.min(...points.map(p => p[0])),
	height: Math.max(...points.map(p => p[1])) - Math.min(...points.map(p => p[1])),
	angle: 0,
	strokeColor: '#111111',
	backgroundColor: 'transparent',
	fillStyle: 'solid',
	strokeWidth: 3,
	strokeStyle: 'dashed',
	roughness: 0,
	opacity: 100,
	groupIds: [],
	frameId: null,
	roundness: null,
	seed: 1000 + id.length * 31,
	version: 1,
	versionNonce: 2000 + id.length * 37,
	isDeleted: false,
	boundElements: null,
	updated: CREATED,
	link: null,
	locked: false,
	points,
	lastCommittedPoint: null,
	startBinding: null,
	endBinding: null,
	startArrowhead: null,
	endArrowhead: null,
	elbowed: false,
	customData: SYMBOL,
	...style,
})

const avp = [
	// rings of 35 / 70 / 105 / 140 px radius
	copy(0, 'avp-zoekradius', 'AVP zoekradius (50, 100, 150, 200 m)', realSize(0.7)),
	// 250 px square, equipment 125 x 67,5 px
	copy(1, 'avp-buiten', 'AVP buiten, verharding 5,00 x 5,00 m', realSize(50)),
	// room of 320 x 240 px; the equipment inside is illustrative
	copy(2, 'avp-binnen', 'AVP binnenruimte 4,00 x 3,00 m', realSize(80)),
]

// drawings 3-14: red, blue, green, orange, each 16,5 / 24 / 30 px thick = 110 / 160 / 200 mm
const mantelbuizen = ['rood', 'blauw', 'groen', 'oranje'].flatMap((colour, c) =>
	[110, 160, 200].map((mm, s) =>
		copy(3 + c * 3 + s, `mantelbuis-${colour}-${mm}`, `Mantelbuis ${colour} Ø${mm} mm`, realSize(150))))

// drawings 15-20: per class without, then with a PVC root screen (CINH), 65 px per metre
const TREES = [
	['c1', 'C1 groot >12 m', '3,00 m', '1,75 m'],
	['c2', 'C2 middel 6-12 m', '2,00 m', '1,25 m'],
	['c3', 'C3 klein <6 m', '1,00 m', '1,00 m'],
]
/** the client's two groups in the library panel, each from large to small */
const ZONDER = 'Zonder wortelbeschermende maatregelen'
const MET = 'Met wortelbeschermende maatregelen'
/**
 * Vrij Tracé finds a tree by its dashed outer ring (the toetsstraal) and
 * measures the distance to a trench from it; the ring says the class and
 * whether there is a root screen, for the Boomcontrole table.
 */
const markRing = (item, klasse, scherm) => {
	const ring = item.elements.find(e => e.type === 'ellipse' && e.strokeStyle === 'dashed')
	ring.customData = { ...ring.customData, treeRing: { klasse, scherm } }
	return item
}
/** a tree item in its group, with its class and test radius under the tile */
const treeItem = (slug, label, radius, t, scherm) => {
	const klasse = slug.toUpperCase()
	const name = scherm
		? `Boom ${label}, met PVC-wortelscherm (toetsstraal ${radius})`
		: `Boom ${label}, zonder bescherming (toetsstraal ${radius})`
	const item = markRing(copy(15 + t * 2 + (scherm ? 1 : 0), `boom-${slug}-${scherm ? 'met' : 'zonder'}`, name, realSize(65)), klasse, scherm)
	return { ...item, subgroup: scherm ? MET : ZONDER, caption: `${klasse} ${radius}` }
}
const bomen = [
	...TREES.map(([slug, label, without], t) => treeItem(slug, label, without, t, false)),
	...TREES.map(([slug, label, , withScreen], t) => treeItem(slug, label, withScreen, t, true)),
]

const gevelinvoer = [copy(21, 'gevelinvoer', 'Gevelinvoer', SYMBOL)]

// boring: a dashed line whose ends are open circles that keep their size
const boring = {
	id: 'inzicht-boring',
	status: 'published',
	created: CREATED,
	name: 'Boring',
	elements: [
		linear('inzicht-boring-0', 'arrow', 0, 0, [[0, 0], [215, 0]], {
			strokeWidth: 4,
			startArrowhead: 'circle_outline',
			endArrowhead: 'circle_outline',
		}),
	],
}

// boogzinker: the client's box symbol with a dashed line bound to each side,
// so dragging a line end changes the length and moving the box drags both
const zinker = copy(23, 'boogzinker', 'Boogzinker', SYMBOL)
const [, box, curve] = zinker.elements
const boxId = 'inzicht-boogzinker-box'
const left = 'inzicht-boogzinker-in'
const right = 'inzicht-boogzinker-uit'
const midY = box.y + box.height / 2
// a gap of 0 would make Excalidraw aim the lines at the box centre once it moves
const GAP = 1
zinker.elements = [
	{ ...box, id: boxId, boundElements: [{ id: left, type: 'arrow' }, { id: right, type: 'arrow' }] },
	curve,
	linear(left, 'arrow', 0, midY, [[0, 0], [box.x - GAP, 0]], {
		endBinding: { elementId: boxId, focus: 0, gap: GAP },
	}),
	linear(right, 'arrow', box.x + box.width + GAP, midY, [[0, 0], [230 - box.x - box.width - GAP, 0]], {
		startBinding: { elementId: boxId, focus: 0, gap: GAP },
	}),
]

const FILES = [
	['01-avp', 'AVP', avp],
	['02-mantelbuizen', 'Mantelbuizen', mantelbuizen],
	['03-gevelinvoer', 'Gevelinvoer', gevelinvoer],
	['04-boring-zinker', 'Boring / zinker', [boring, zinker]],
	['05-bomen', 'Bomen', bomen],
]

mkdirSync(OUT, { recursive: true })
for (const [file, name, libraryItems] of FILES) {
	const lib = { type: 'excalidrawlib', version: 2, source: 'inzicht-whiteboard', name, libraryItems }
	writeFileSync(join(OUT, `${file}.excalidrawlib`), JSON.stringify(lib) + '\n')
	console.log(`${file}.excalidrawlib: ${libraryItems.length} items`)
}
