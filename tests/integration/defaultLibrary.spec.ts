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
			['aVP', 3],
			['Mantelbuizen', 12],
			['Gevelinvoer', 1],
			['Boring / zinker', 2],
			['Bomen', 6],
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
