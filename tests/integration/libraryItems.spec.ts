import { describe, it, expect } from 'vitest'
import { libraryItemsFromFiles, withoutDefaultItems } from '../../src/utils/libraryItems'

const rect = { id: 'r', type: 'rectangle' }

describe('libraryItemsFromFiles', () => {
	it('turns the bundled default files into published, grouped items', () => {
		const items = libraryItemsFromFiles([
			{
				basename: '01-avp.excalidrawlib',
				default: true,
				name: 'AVP',
				libraryItems: [{ id: 'inzicht-avp-rond', name: 'AVP rond', created: 5, elements: [rect] }],
			},
		])
		expect(items).toEqual([
			expect.objectContaining({
				id: 'inzicht-avp-rond',
				name: 'AVP rond',
				status: 'published',
				group: 'AVP',
				created: 5,
				elements: [rect],
			}),
		])
	})

	it('keeps a user\'s own items as they were: unpublished and ungrouped', () => {
		const [item] = libraryItemsFromFiles([
			{ basename: 'personal.excalidrawlib', libraryItems: [{ id: 'mine', elements: [rect] }] },
		])
		expect(item.status).toBe('unpublished')
		expect(item.group).toBeUndefined()
	})

	it('still reads old version 1 library files as published items', () => {
		const items = libraryItemsFromFiles([{ basename: 'old.excalidrawlib', library: [[rect], [rect]] }])
		expect(items).toHaveLength(2)
		expect(items.every(i => i.status === 'published')).toBe(true)
	})

	it('skips files without items and items without elements', () => {
		expect(libraryItemsFromFiles([
			{ basename: 'empty.excalidrawlib' },
			{ basename: 'x.excalidrawlib', libraryItems: [{ id: 'e', elements: [] }] },
		])).toEqual([])
	})
})

describe('withoutDefaultItems', () => {
	it('leaves the bundled items out of what is saved to the user\'s files', () => {
		const kept = withoutDefaultItems([
			{ id: 'inzicht-avp-rond', status: 'published', created: 1, elements: [] },
			{ id: 'mine', status: 'unpublished', created: 1, elements: [] },
		] as never)
		expect(kept.map(i => i.id)).toEqual(['mine'])
	})
})
