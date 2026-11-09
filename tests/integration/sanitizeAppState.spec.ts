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

	it('keeps this browser\'s PDF import progress out of the saved board', () => {
		// a board saved mid-import came back with a "converting" page nothing could clear
		const cleaned = sanitizeAppStateForSync({
			viewBackgroundColor: '#fff',
			pdfImport: { stage: 'convert', name: 'plan.pdf', x: 0, y: 0, width: 10, height: 7, percent: 100, placed: 0, total: 0, error: null },
		} as never)
		expect(cleaned).toEqual({ viewBackgroundColor: '#fff' })
	})
})
