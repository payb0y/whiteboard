/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// An open board used to save itself every ten seconds with nobody drawing:
// each server save called getJWT(), which wrote the JWT and config stores
// even when nothing had changed, the re-render made Excalidraw report a
// change, and that change queued the next save.

import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'

const memory = new Map<string, string>()
const g = globalThis as Record<string, unknown>
g.localStorage = {
	getItem: (key: string) => memory.get(key) ?? null,
	setItem: (key: string, value: string) => { memory.set(key, String(value)) },
	removeItem: (key: string) => { memory.delete(key) },
	clear: () => memory.clear(),
	key: () => null,
	length: 0,
}
g.window = globalThis

vi.mock('@nextcloud/axios', () => ({ default: { get: vi.fn() } }))
vi.mock('@nextcloud/router', () => ({ generateUrl: (url: string) => url }))

type Stores = {
	useJWTStore: typeof import('../../src/stores/useJwtStore').useJWTStore
	useWhiteboardConfigStore: typeof import('../../src/stores/useWhiteboardConfigStore').useWhiteboardConfigStore
	computeSceneKey: typeof import('../../src/utils/syncSceneData').computeSceneKey
}
let s: Stores

const base64url = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
const tokenFor = (fileId: number, readOnly: boolean) => {
	const now = Math.floor(Date.now() / 1000)
	return `${base64url({ alg: 'HS256' })}.${base64url({ userid: 'u1', fileId, isFileReadOnly: readOnly, user: { id: 'u1', name: 'U' }, iat: now, exp: now + 900 })}.sig`
}

beforeAll(async () => {
	const jwt = await import('../../src/stores/useJwtStore')
	const config = await import('../../src/stores/useWhiteboardConfigStore')
	const scene = await import('../../src/utils/syncSceneData')
	s = { useJWTStore: jwt.useJWTStore, useWhiteboardConfigStore: config.useWhiteboardConfigStore, computeSceneKey: scene.computeSceneKey }
})

beforeEach(() => {
	s.useJWTStore.getState().clearTokens()
	s.useWhiteboardConfigStore.setState({ fileId: 7, isReadOnly: false, isVersionPreview: false })
})

describe('idle board does not save itself', () => {
	it('setReadOnly with the current value leaves the store alone', () => {
		const listener = vi.fn()
		const stop = s.useWhiteboardConfigStore.subscribe(listener)
		s.useWhiteboardConfigStore.getState().setReadOnly(false)
		expect(listener).not.toHaveBeenCalled()
		s.useWhiteboardConfigStore.getState().setReadOnly(true)
		expect(listener).toHaveBeenCalledTimes(1)
		expect(s.useWhiteboardConfigStore.getState().isReadOnly).toBe(true)
		stop()
	})

	it('setReadOnly still forces read-only in a version preview', () => {
		s.useWhiteboardConfigStore.setState({ isVersionPreview: true, isReadOnly: false })
		s.useWhiteboardConfigStore.getState().setReadOnly(false)
		expect(s.useWhiteboardConfigStore.getState().isReadOnly).toBe(true)
	})

	it('getJWT with a valid stored token writes nothing after the first call', async () => {
		const token = tokenFor(7, false)
		const exp = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).exp
		s.useJWTStore.setState({ tokens: { 7: token }, tokenExpiries: { 7: exp } })

		expect(await s.useJWTStore.getState().getJWT()).toBe(token)
		const timer = s.useJWTStore.getState().autoRefreshTimers['7']
		expect(timer).toBeTruthy()

		const jwtListener = vi.fn()
		const configListener = vi.fn()
		const stopJwt = s.useJWTStore.subscribe(jwtListener)
		const stopConfig = s.useWhiteboardConfigStore.subscribe(configListener)
		for (let i = 0; i < 3; i++) {
			expect(await s.useJWTStore.getState().getJWT()).toBe(token)
		}
		expect(jwtListener).not.toHaveBeenCalled()
		expect(configListener).not.toHaveBeenCalled()
		expect(s.useJWTStore.getState().autoRefreshTimers['7']).toBe(timer)
		stopJwt()
		stopConfig()
	})

	it('getJWT still applies a changed permission from the token', async () => {
		const token = tokenFor(7, true)
		const exp = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).exp
		s.useJWTStore.setState({ tokens: { 7: token }, tokenExpiries: { 7: exp } })
		await s.useJWTStore.getState().getJWT()
		expect(s.useWhiteboardConfigStore.getState().isReadOnly).toBe(true)
	})

	it('getJWT schedules a new refresh when the token expiry changes', async () => {
		const first = tokenFor(7, false)
		const exp = JSON.parse(Buffer.from(first.split('.')[1], 'base64url').toString()).exp
		s.useJWTStore.setState({ tokens: { 7: first }, tokenExpiries: { 7: exp } })
		await s.useJWTStore.getState().getJWT()
		const timer = s.useJWTStore.getState().autoRefreshTimers['7']

		s.useJWTStore.setState({ tokenExpiries: { 7: exp + 300 } })
		await s.useJWTStore.getState().getJWT()
		expect(s.useJWTStore.getState().autoRefreshTimers['7']).not.toBe(timer)
	})

	it('computeSceneKey changes only when elements or files change', () => {
		const el = (id: string, version: number) => ({ id, version, versionNonce: 1, isDeleted: false }) as never
		const files = { a: {} } as never
		const key = s.computeSceneKey([el('x', 1)], files)
		expect(s.computeSceneKey([el('x', 1)], { a: {} } as never)).toBe(key)
		expect(s.computeSceneKey([el('x', 2)], files)).not.toBe(key)
		expect(s.computeSceneKey([el('x', 1)], { a: {}, b: {} } as never)).not.toBe(key)
	})
})
