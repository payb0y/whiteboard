import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest'
import { io } from 'socket.io-client'
import jwt from 'jsonwebtoken'
import { createConfigMock } from './configMock.js'
import ServerManagerModule from '../../websocket_server/Services/ServerService.js'
import ConfigModule from '../../websocket_server/Utilities/ConfigUtility.js'

vi.setConfig({ testTimeout: 10000 })

vi.mock('../../websocket_server/Utilities/ConfigUtility.js', () => ({
	default: createConfigMock({
		NEXTCLOUD_URL: 'http://127.0.0.1:3011',
		PORT: '3011',
		HOST: '127.0.0.1',
		JWT_SECRET_KEY: 'secret',
		USE_TLS: false,
		STORAGE_STRATEGY: 'lru',
		MAX_UPLOAD_FILE_SIZE: 2e6,
		CACHED_TOKEN_TTL: 5 * 60 * 1000,
		COMPRESSION_ENABLED: false,
	}),
}))

const Config = ConfigModule

const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve))

const client = (id) => io(Config.NEXTCLOUD_URL, {
	auth: {
		token: jwt.sign({ roomID: 777, user: { id, name: id } }, Config.JWT_SECRET_KEY),
	},
})

const encode = (message) => new TextEncoder().encode(JSON.stringify(message))
const decode = (data) => JSON.parse(new TextDecoder().decode(data))

// The design relies on the server relaying these messages unchanged; these
// tests pin that behaviour rather than add any.
describe('Vrij Tracé collaboration', () => {
	let server, a, b

	beforeAll(async () => {
		server = new ServerManagerModule()
		await server.start()
		a = client('anna')
		b = client('bert')
		await Promise.all([once(a, 'connect'), once(b, 'connect')])
		const designated = Promise.all([once(a, 'sync-designate'), once(b, 'sync-designate')])
		a.emit('join-room', 777)
		b.emit('join-room', 777)
		await designated
	})

	afterAll(async () => {
		a?.disconnect()
		b?.disconnect()
		await new Promise((resolve) => setTimeout(resolve, 500))
		await server?.gracefulShutdown()
	})

	// server-volatile-broadcast only relays cursor and viewport messages, so
	// edit holds travel over the regular (non-persisted) room broadcast
	it('relays VRIJTRACE_EDITING to the other client', async () => {
		const received = once(b, 'client-broadcast')
		const message = { type: 'VRIJTRACE_EDITING', payload: { elementIds: ['n1'], userId: 'anna', name: 'Anna' } }
		a.emit('server-broadcast', '777', encode(message), new ArrayBuffer(0))
		expect(decode(await received)).toEqual(message)
	})

	it('keeps concurrent edits of different trench parts from two clients', async () => {
		const el = (id, x, version) => ({
			id,
			type: 'trench',
			x,
			y: 0,
			width: 1,
			height: 1,
			version,
			versionNonce: version,
			isDeleted: false,
			trench: { kind: 'node' },
			customData: { pdfParentId: 'pdf1' },
		})
		const scene = (elements) => encode({ type: 'SCENE_INIT', payload: { elements } })
		const toB = once(b, 'client-broadcast')
		const toA = once(a, 'client-broadcast')
		a.emit('server-broadcast', '777', scene([el('n1', 10, 2)]), new ArrayBuffer(0))
		b.emit('server-broadcast', '777', scene([el('n2', 20, 2)]), new ArrayBuffer(0))
		const [atB, atA] = await Promise.all([toB, toA])
		expect(decode(atB).payload.elements[0].id).toBe('n1')
		expect(decode(atA).payload.elements[0].id).toBe('n2')
	})
})
