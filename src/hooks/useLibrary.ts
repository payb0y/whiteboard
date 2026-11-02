/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useCallback, useState } from 'react'
import { useJWTStore } from '../stores/useJwtStore'
import { useShallow } from 'zustand/react/shallow'
import { generateUrl } from '@nextcloud/router'
import type { LibraryItems } from '@excalidraw/excalidraw/types/types'
import logger from '../utils/logger'
import { libraryItemsFromFiles, withoutDefaultItems } from '../utils/libraryItems'

export function useLibrary() {
	const { getJWT } = useJWTStore(
		useShallow(state => ({
			getJWT: state.getJWT,
		})),
	)

	const [isLibraryLoaded, setIsLibraryLoaded] = useState(false)

	const fetchLibraryItems = useCallback(async (): Promise<LibraryItems | null> => {
		try {
			const jwt = await getJWT()
			if (!jwt) {
				logger.warn('[Library] No JWT found, cannot fetch library')
				return null
			}
			const url = generateUrl('apps/whiteboard/library')
			const response = await globalThis.fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					Authorization: `Bearer ${jwt}`,
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to fetch library: ${response.statusText}`)
			}

			const data = await response.json()
			return libraryItemsFromFiles(data.data) as LibraryItems
		} catch (error) {
			logger.error('[Library] Error fetching library:', error)
			return null
		}
	})

	const updateLibraryItems = useCallback(async (items: LibraryItems): Promise<void> => {
		try {
			const jwt = await getJWT()
			if (!jwt) {
				logger.warn('[Library] No JWT found, cannot update library')
				return
			}
			const url = generateUrl('apps/whiteboard/library')
			const response = await globalThis.fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({ items: withoutDefaultItems(items) }),
			})

			if (!response.ok) {
				throw new Error(`Failed to update library: ${response.statusText}`)
			}
		} catch (error) {
			logger.error('[Library] Error updating library:', error)
		}
	})

	return {
		fetchLibraryItems,
		updateLibraryItems,
		isLibraryLoaded,
		setIsLibraryLoaded,
	}
}
