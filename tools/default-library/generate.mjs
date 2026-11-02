/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Writes the default library files (library/*.excalidrawlib) that every user
 * sees under "In Zicht bibliotheek". Each file is one group in the sidebar.
 *
 * The symbols are placeholders redrawn from the client's screenshots; replace
 * them with the client's own library file when it arrives. Item ids must keep
 * the "inzicht-" prefix: the app never saves those into a user's own library.
 *
 *   node tools/default-library/generate.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../library')
const CREATED = Date.UTC(2026, 10, 2)

// deterministic seeds so regenerating gives the same files
let counter = 0
const seed = () => 100000 + (counter++ * 7919) % 900000

const base = (id, type, x, y, width, height, style = {}) => ({
	id,
	type,
	x,
	y,
	width,
	height,
	angle: 0,
	strokeColor: '#1e1e1e',
	backgroundColor: 'transparent',
	fillStyle: 'solid',
	strokeWidth: 1,
	strokeStyle: 'solid',
	roughness: 0,
	opacity: 100,
	groupIds: [],
	frameId: null,
	roundness: null,
	seed: seed(),
	version: 1,
	versionNonce: seed(),
	isDeleted: false,
	boundElements: null,
	updated: CREATED,
	link: null,
	locked: false,
	...style,
})

/** builds one library item; every shape in it shares a group so it moves as one */
const item = (id, name, draw) => {
	const itemId = `inzicht-${id}`
	const gid = `${itemId}-g`
	const elements = []
	const add = (type, x, y, w, h, style, extra = {}) => {
		elements.push({ ...base(`${itemId}-${elements.length}`, type, x, y, w, h, style), ...extra, groupIds: [gid] })
	}
	const shape = {
		rect: (x, y, w, h, style) => add('rectangle', x, y, w, h, style),
		circle: (cx, cy, r, style) => add('ellipse', cx - r, cy - r, 2 * r, 2 * r, style),
		/** open or closed polyline through absolute points */
		line: (pts, style, closed = false) => {
			const xs = pts.map(p => p[0])
			const ys = pts.map(p => p[1])
			const x0 = Math.min(...xs)
			const y0 = Math.min(...ys)
			const rel = pts.map(([x, y]) => [x - pts[0][0], y - pts[0][1]])
			if (closed) rel.push([0, 0])
			add('line', pts[0][0], pts[0][1], Math.max(...xs) - x0, Math.max(...ys) - y0, style, {
				points: rel,
				lastCommittedPoint: null,
				startBinding: null,
				endBinding: null,
				startArrowhead: null,
				endArrowhead: null,
			})
		},
	}
	draw(shape)
	return { id: itemId, status: 'published', created: CREATED, name, elements }
}

const RED = '#e03131'
const RED_LIGHT = '#ffa8a8'

const avp = [
	item('avp-rond', 'aVP rond', s => {
		for (const r of [26, 19, 12, 5]) s.circle(30, 30, r, { strokeColor: RED_LIGHT })
		s.circle(30, 30, 1.6, { strokeColor: RED, backgroundColor: RED })
	}),
	item('avp-kast', 'aVP kast', s => {
		s.rect(5, 5, 50, 50, { strokeColor: RED_LIGHT, backgroundColor: '#f1f3f5' })
		for (const y of [13, 21, 29, 37, 45]) s.line([[5, y], [55, y]], { strokeColor: '#ced4da', strokeWidth: 0.5 })
		for (const x of [17, 30, 43]) s.line([[x, 5], [x, 55]], { strokeColor: '#ced4da', strokeWidth: 0.5 })
		s.rect(17, 23, 26, 14, { strokeColor: RED, backgroundColor: '#495057' })
	}),
	item('avp-gebouw', 'aVP gebouw', s => {
		s.line([[5, 8], [55, 8], [55, 46], [38, 46], [34, 54], [32, 46], [5, 46]],
			{ strokeColor: RED_LIGHT, backgroundColor: '#f8f9fa' }, true)
		for (const [x, y, w, h] of [[9, 12, 12, 5], [40, 12, 12, 5], [24, 22, 12, 14], [46, 24, 5, 10]]) {
			s.rect(x, y, w, h, { strokeColor: '#adb5bd', backgroundColor: '#adb5bd' })
		}
	}),
]

const COLOURS = [
	['rood', 'Rood', '#e03131', '#a51d1d'],
	['blauw', 'Blauw', '#1c7ed6', '#1864ab'],
	['groen', 'Groen', '#2f9e44', '#1f6e30'],
	['oranje', 'Oranje', '#f76707', '#c24e02'],
]
const SIZES = [['klein', 4], ['middel', 7], ['groot', 10]]
const mantelbuizen = COLOURS.flatMap(([key, label, fill, dark]) =>
	SIZES.map(([size, h]) => item(`mantelbuis-${key}-${size}`, `Mantelbuis ${label.toLowerCase()} ${size}`, s => {
		s.rect(0, 30 - h / 2, 80, h, { strokeColor: dark, backgroundColor: fill })
		s.rect(0, 30 - h / 2, 3, h, { strokeColor: '#212529', backgroundColor: '#212529' })
	})))

const gevelinvoer = [
	item('gevelinvoer', 'Gevelinvoer', s => {
		s.line([[30, 12], [50, 46], [10, 46]], { strokeColor: '#495057', strokeWidth: 2 }, true)
	}),
]

const GREY = '#868e96'
const boringZinker = [
	item('boring', 'Boring', s => {
		s.line([[11, 30], [49, 30]], { strokeColor: GREY, strokeWidth: 1.5, strokeStyle: 'dotted' })
		s.circle(8, 30, 3, { strokeColor: GREY, backgroundColor: '#ffffff' })
		s.circle(52, 30, 3, { strokeColor: GREY, backgroundColor: '#ffffff' })
	}),
	item('zinker', 'Zinker', s => {
		s.line([[0, 30], [20, 30]], { strokeColor: GREY, strokeWidth: 1.5, strokeStyle: 'dotted' })
		s.line([[40, 30], [60, 30]], { strokeColor: GREY, strokeWidth: 1.5, strokeStyle: 'dotted' })
		s.rect(20, 22, 20, 16, { strokeColor: '#495057', backgroundColor: '#ffffff' })
		s.line([[20, 22], [30, 31], [40, 22]], { strokeColor: '#495057' })
	}),
]

const CLASSES = [['I', 10], ['II', 14], ['III', 18]]
const bomen = [['met', true], ['zonder', false]].flatMap(([word, protectedTree]) =>
	CLASSES.map(([cls, r]) => item(`boom-${cls.toLowerCase()}-${word}`, `Boom klasse ${cls} ${word} bescherming`, s => {
		const c = 40
		s.circle(c, c, protectedTree ? r + 12 : r + 20, {
			strokeColor: '#f59f00',
			strokeStyle: protectedTree ? 'dotted' : 'dashed',
			opacity: protectedTree ? 60 : 100,
		})
		s.circle(c, c, r, { strokeColor: '#2f9e44', backgroundColor: '#8ce99a' })
		s.circle(c, c, 1.5, { strokeColor: '#a61e4d', backgroundColor: '#a61e4d' })
	})))

const FILES = [
	['01-avp', 'aVP', avp],
	['02-mantelbuizen', 'Mantelbuizen', mantelbuizen],
	['03-gevelinvoer', 'Gevelinvoer', gevelinvoer],
	['04-boring-zinker', 'Boring / zinker', boringZinker],
	['05-bomen', 'Bomen', bomen],
]

mkdirSync(OUT, { recursive: true })
for (const [file, name, libraryItems] of FILES) {
	const lib = { type: 'excalidrawlib', version: 2, source: 'inzicht-whiteboard', name, libraryItems }
	writeFileSync(join(OUT, `${file}.excalidrawlib`), JSON.stringify(lib, null, '\t') + '\n')
	console.log(`${file}.excalidrawlib: ${libraryItems.length} items`)
}
