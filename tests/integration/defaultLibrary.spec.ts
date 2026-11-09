import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(__dirname, '../../library')
const files = readdirSync(DIR).filter(f => f.endsWith('.excalidrawlib')).sort()
const libs = files.map(f => JSON.parse(readFileSync(join(DIR, f), 'utf8')))
const items = libs.flatMap(lib => lib.libraryItems)
const item = (id: string) => items.find(i => i.id === id)

describe('bundled In Zicht library', () => {
	it('has the client\'s groups in order', () => {
		expect(libs.map(lib => [lib.name, lib.libraryItems.length])).toEqual([
			['AVP', 3],
			['Mantelbuizen', 12],
			['Gevelinvoer', 1],
			['Boring / zinker', 2],
			['Bomen', 6],
		])
	})

	it('sorts the trees into the client\'s two groups, large to small', () => {
		const bomen = libs.find(lib => lib.name === 'Bomen').libraryItems
		expect(bomen.map(i => [i.id, i.subgroup, i.caption])).toEqual([
			['inzicht-boom-c1-zonder', 'Zonder wortelbeschermende maatregelen', 'C1 3,00 m'],
			['inzicht-boom-c2-zonder', 'Zonder wortelbeschermende maatregelen', 'C2 2,00 m'],
			['inzicht-boom-c3-zonder', 'Zonder wortelbeschermende maatregelen', 'C3 1,00 m'],
			['inzicht-boom-c1-met', 'Met wortelbeschermende maatregelen', 'C1 1,75 m'],
			['inzicht-boom-c2-met', 'Met wortelbeschermende maatregelen', 'C2 1,25 m'],
			['inzicht-boom-c3-met', 'Met wortelbeschermende maatregelen', 'C3 1,00 m'],
		])
	})

	it('only holds items the app never saves into a user\'s own library', () => {
		for (const { id, elements } of items) {
			expect(id).toMatch(/^inzicht-/)
			expect(new Set(elements.map(e => e.id)).size).toBe(elements.length)
		}
	})

	// CINH: the test radius around the stem is decisive, measured from its centre
	it.each([
		['inzicht-boom-c1-zonder', 3.00],
		['inzicht-boom-c1-met', 1.75],
		['inzicht-boom-c2-zonder', 2.00],
		['inzicht-boom-c2-met', 1.25],
		['inzicht-boom-c3-zonder', 1.00],
		['inzicht-boom-c3-met', 1.00],
	])('draws the test ring of %s at its true radius of %s m', (id, radiusM) => {
		const ring = item(id).elements.find(e => e.strokeStyle === 'dashed')
		const cmPerPx = ring.customData.libraryCmPerPx
		expect((ring.width / 2) * cmPerPx).toBeCloseTo(radiusM * 100, 6)
		expect(item(id).elements.every(e => e.customData?.libraryCmPerPx === cmPerPx)).toBe(true)
	})

	// Vrij Tracé finds a tree by its ring and measures from it (Boomcontrole)
	it.each([
		['inzicht-boom-c1-zonder', 'C1', false],
		['inzicht-boom-c1-met', 'C1', true],
		['inzicht-boom-c2-zonder', 'C2', false],
		['inzicht-boom-c2-met', 'C2', true],
		['inzicht-boom-c3-zonder', 'C3', false],
		['inzicht-boom-c3-met', 'C3', true],
	])('marks the outer ring of %s as the tree (%s, scherm %s)', (id, klasse, scherm) => {
		const marked = item(id).elements.filter(e => e.customData?.treeRing)
		expect(marked).toHaveLength(1)
		expect(marked[0]).toMatchObject({ type: 'ellipse', strokeStyle: 'dashed' })
		expect(marked[0].customData.treeRing).toEqual({ klasse, scherm })
		// the outer ring is the largest circle of the drawing
		expect(marked[0].width).toBe(Math.max(...item(id).elements.map(e => e.width)))
	})

	/** size of an element in metres on the ground, from the scale its item is drawn at */
	const metres = (e: { width: number, height: number, customData?: { libraryCmPerPx?: number } }) =>
		[e.width, e.height].map(px => +(px * e.customData.libraryCmPerPx / 100).toFixed(4))

	it('draws the AVP search rings at 50, 100, 150 and 200 m radius', () => {
		const rings = item('inzicht-avp-zoekradius').elements.filter(e => e.type === 'ellipse' && e.width > 20)
		expect(rings.map(e => metres(e)[0] / 2).sort((a, b) => a - b)).toEqual([50, 100, 150, 200])
	})

	it('draws the outdoor AVP as a 5,00 x 5,00 m area with 2,50 x 1,35 m equipment', () => {
		const [area, equipment] = item('inzicht-avp-buiten').elements.filter(e => e.type === 'rectangle')
		expect(metres(area)).toEqual([5, 5])
		expect(metres(equipment)).toEqual([2.5, 1.35])
	})

	it('draws the indoor AVP room at 4,00 x 3,00 m', () => {
		const [room] = item('inzicht-avp-binnen').elements
		expect(metres(room)).toEqual([4, 3])
	})

	it.each(['rood', 'blauw', 'groen', 'oranje'])('draws the %s ducts at 110, 160 and 200 mm across', colour => {
		const ducts = items.filter(i => i.id.startsWith(`inzicht-mantelbuis-${colour}-`))
		expect(ducts.map(i => i.name)).toEqual([110, 160, 200].map(mm => `Mantelbuis ${colour} Ø${mm} mm`))
		expect(ducts.map(i => metres(i.elements.find(e => e.type === 'rectangle'))[1])).toEqual([0.11, 0.16, 0.2])
		for (const duct of ducts) {
			const scale = duct.elements[0].customData.libraryCmPerPx
			expect(duct.elements.every(e => e.customData?.libraryCmPerPx === scale)).toBe(true)
		}
	})

	it('keeps symbols without a physical size at their own size', () => {
		for (const id of ['inzicht-gevelinvoer', 'inzicht-boring', 'inzicht-boogzinker']) {
			expect(item(id).elements.every(e => e.customData?.librarySymbol === true)).toBe(true)
		}
	})

	it('draws the boring as one stretchable line with open circles at both ends', () => {
		const [line] = item('inzicht-boring').elements
		expect(line).toMatchObject({ type: 'arrow', startArrowhead: 'circle_outline', endArrowhead: 'circle_outline' })
	})

	it('binds the boogzinker lines to its box so the box keeps its size', () => {
		const elements = item('inzicht-boogzinker').elements
		const box = elements.find(e => e.type === 'rectangle')
		const lines = elements.filter(e => e.type === 'arrow')
		expect(lines.map(l => l.endBinding?.elementId ?? l.startBinding?.elementId)).toEqual([box.id, box.id])
		expect(box.boundElements.map(b => b.id).sort()).toEqual(lines.map(l => l.id).sort())
		// with a gap of 0 Excalidraw aims a bound line at the box centre once the box moves
		expect(lines.map(l => (l.endBinding ?? l.startBinding).gap)).toEqual([1, 1])
	})
})
