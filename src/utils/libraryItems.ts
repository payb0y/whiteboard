/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { LibraryItem, LibraryItems } from '@excalidraw/excalidraw/types/types'

/** Ids of the items bundled with the app (library/*.excalidrawlib) start with this */
export const DEFAULT_ITEM_PREFIX = 'inzicht-'

/** One library file as the server sends it */
export type LibraryFile = {
	basename?: string
	filename?: string
	/** bundled with the app, the same for every user */
	default?: boolean
	/** group title of a bundled file */
	name?: string
	library?: unknown[][]
	libraryItems?: Array<Partial<LibraryItem> & { elements?: unknown[], subgroup?: unknown, caption?: unknown }>
}

type LibraryItemExtended = LibraryItem & {
	filename?: string
	group?: string
	/** a heading inside the group; its items are drawn to one scale */
	subgroup?: string
	/** a short text under the item's tile */
	caption?: string
}

/** text, or undefined for anything else a library file may hold */
const text = (value: unknown) => (typeof value === 'string' && value ? value : undefined)

/**
 * Turn the server's library files into library items. The bundled default
 * files become published items in their group; a user's own items keep the
 * status they were saved with.
 */
export const libraryItemsFromFiles = (files: LibraryFile[]): LibraryItemExtended[] => {
	const items: LibraryItemExtended[] = []
	const now = Date.now()

	for (const file of files) {
		// version 1 (legacy library files from https://excalidraw.com)
		for (const elements of file.library ?? []) {
			items.push({
				id: '',
				created: now,
				status: 'published',
				elements: elements as LibraryItem['elements'],
				filename: file.filename,
			})
		}

		// version 2
		for (const item of file.libraryItems ?? []) {
			if (!item.elements || item.elements.length === 0) {
				continue
			}
			const libraryItem: LibraryItemExtended = {
				id: item.id ?? '',
				created: item.created || now,
				status: file.default ? 'published' : (item.status || 'unpublished'),
				elements: item.elements as LibraryItem['elements'],
				filename: file.filename,
			}
			if (item.name) {
				libraryItem.name = item.name
			}
			if (file.default && file.name) {
				libraryItem.group = file.name
			}
			const subgroup = text(item.subgroup)
			if (subgroup) {
				libraryItem.subgroup = subgroup
			}
			const caption = text(item.caption)
			if (caption) {
				libraryItem.caption = caption
			}
			items.push(libraryItem)
		}
	}
	return items
}

/** The bundled items are never written into a user's own library file */
export const withoutDefaultItems = (items: LibraryItems): LibraryItems =>
	items.filter(item => !item.id?.startsWith(DEFAULT_ITEM_PREFIX))
