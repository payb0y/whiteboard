import { describe, it, expect } from 'vitest'
import { sanitizeAppStateForSync } from '../../src/utils/sanitizeAppState'

describe('sanitizeAppStateForSync', () => {
	it('keeps Vrij Tracé UI state and colleagues\' holds local', () => {
		const cleaned = sanitizeAppStateForSync({
			viewBackgroundColor: '#fff',
			vrijTrace: { mode: 'teken', hidePdf: true, draft: { start: { x: 0, y: 0 } } },
			vrijTraceRemoteHolds: { n1: { userId: 'u2', name: 'Bert', expiresAt: 1 } },
		} as never)
		expect(cleaned).toEqual({ viewBackgroundColor: '#fff' })
	})
})
