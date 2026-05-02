# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

Nextcloud Whiteboard is a Nextcloud app built on a fork of Excalidraw. It has three independently deployable pieces that share this repo:

1. **PHP Nextcloud app** (`lib/`, `appinfo/`) — registered with the Nextcloud platform under namespace `OCA\Whiteboard\`. Provides REST endpoints, viewer/editor integration listeners, JWT issuance, file content read/write through Nextcloud's filesystem, and admin/personal settings.
2. **Browser frontend** (`src/`) — TypeScript/React app rendered inside Nextcloud's Viewer. Vue.js is only used for Nextcloud-flavored chrome (settings panels, dialogs); the canvas itself is React + Excalidraw.
3. **Collaboration server** (`websocket_server/`) — standalone Node.js Socket.IO server for real-time collaboration. Run as a separate process / Docker image (`ghcr.io/nextcloud-releases/whiteboard:stable`). Not required for basic whiteboard editing — only for live multi-user sessions, recordings, and presentations.

The PHP app and the websocket server share a `JWT_SECRET_KEY` (configured via `occ config:app:set whiteboard jwt_secret_key`); browsers fetch JWTs from the PHP `JWTController` and present them to the websocket server.

## Common commands

Node version is pinned to `^24.0.0` and npm to `^11.3.0` (see `package.json`'s `engines`). PHP target is 8.4 (see `composer.json` `platform`).

### Frontend / websocket build & dev
```bash
npm ci                           # install (preferred over npm install)
npm run build                    # production Vite build
npm run dev                      # development build (no minification, sourcemaps)
npm run watch                    # rebuild on src change via nodemon
npm run server:start             # start collaboration websocket server (websocket_server/main.js)
npm run server:watch             # same, auto-restart on change
```

The websocket server requires environment variables — at minimum `JWT_SECRET_KEY` and `NEXTCLOUD_URL`. Copy `.env.example` for a full list (TLS, `STORAGE_STRATEGY`, `REDIS_URL`, `RECORDINGS_DIR`, `METRICS_TOKEN`, etc.).

### Lint & format
```bash
npm run lint                     # ESLint over src/, websocket_server/, tests/integration
npm run lint:fix
npm run stylelint                # SCSS/CSS in src/
composer run cs:check            # PHP-CS-Fixer (Nextcloud coding standard)
composer run cs:fix
composer run psalm               # PHP static analysis (uses psalm.xml + tests/psalm-baseline.xml)
composer run lint                # `php -l` over all non-vendor PHP
```

ESLint is invoked via `ESLINT_USE_FLAT_CONFIG=false` against the legacy `.eslintrc.cjs` — keep the env var when running ESLint manually.

### Tests

**Vitest integration suite** (`tests/integration/*.spec.{js,mjs,ts,tsx}`) — these spin up the real `ServerService` from `websocket_server/` and exercise it over Socket.IO:
```bash
npm test                         # all integration specs
npm run test:watch
npx vitest run tests/integration/socket.spec.mjs       # single file
npx vitest run -t "name pattern"                        # by test name
```

`vitest.config.js` rebuilds `redis-memory-server` on startup. If that fails (no native toolchain), the Redis multinode spec is auto-skipped — don't add a workaround, the runner already handles it.

**Playwright e2e** (`playwright/e2e/`) — requires Docker; the config (`playwright.config.ts`) auto-starts a Nextcloud container on `localhost:8089` and a websocket server on `localhost:3002` with `TLS=false JWT_SECRET_KEY=secret`:
```bash
npx playwright test                                     # full suite
npx playwright test path/to/file.spec.ts                # single file
SERVER_VERSION=stable30 npx playwright test             # pin NC server version
```

**PHP unit tests** (`tests/Unit/`):
```bash
composer run test:unit
./vendor/bin/phpunit -c tests/phpunit.xml --filter TestName
```

## Architecture notes

### Frontend runtime modes (`src/main.ts`)
`main.ts` detects which of three runtimes it's booting in via `loadState('whiteboard', ...)`:
- **`recording`** — headless Chromium opened by the websocket server's `RecordingService`. JWT is preloaded into `useJWTStore` before the React tree mounts so the recorder skips the auth handshake.
- **`public-share`** — registers a Viewer handler and tries to open through `OCA.Viewer`; if Viewer never finishes initializing within 2.5s, falls back to rendering directly into `#preview` / `#imgframe`. The whiteboard-vs-other-mimetype check has a NC29/30 path (hidden `#mimetype` input) and an NC31+ path (relies on `file_id` in initial state).
- **`viewer`** (default) — registers `'application/vnd.excalidraw+json'` with `OCA.Viewer.registerHandler`. Retries up to 3× / 250ms while waiting for `OCA.Viewer` to load.

When editing entry-point logic, preserve all three branches — they cover separate Nextcloud surfaces and skipping any will silently break recording or public sharing.

### Excalidraw aliasing
The repo depends on a forked Excalidraw published as `@nextcloud/excalidraw` (and `@nextcloud/excalidraw-element`). The tarball is referenced via `file:../excalidraw/...` in `package.json`, so a sibling checkout of the fork is required to install. `vite.config.ts` rewrites all imports of `@excalidraw/excalidraw` → `@nextcloud/excalidraw` and `@excalidraw/element` → `@nextcloud/excalidraw-element`. Always import from `@excalidraw/...` in source code; the alias does the rest.

### Client-first data flow
Whiteboard data lives in three places, in this priority order on read:
1. **IndexedDB** (`src/database/db.ts`, Dexie) — per-`fileId` row with elements/files/appState plus `hasPendingLocalChanges` and `lastSyncedHash`. This is the local source of truth between sessions.
2. **Websocket server room state** — only when a collaboration session is active. Lost on websocket restart unless `STORAGE_STRATEGY=redis`.
3. **Nextcloud file** — authoritative storage, written through `WhiteboardController::update` and read via `WhiteboardController::show` using JWT-authenticated requests.

Sync runs through a Web Worker (`src/workers/syncWorker.ts`, orchestrated by `useSync` / `useBoardDataManager`) so canvas interactions stay responsive. State is split across Zustand stores in `src/stores/` (one per concern: collaboration, JWT, sync, config, lang, excalidraw API ref, creator display).

### Websocket server services
`websocket_server/Services/ServerService.js` is the composition root. It picks storage adapters based on `STORAGE_STRATEGY` (`Adapters/LruAdapter.js` vs `Adapters/RedisAdapter.js` — both implement `StorageAdapter.js`), then wires the rest of the services into a `SocketService`. Notable services: `RoomLifecycleService` (room create/teardown/TTLs), `RecordingService` + `RecordingControlService` (Puppeteer + ffmpeg), `PresentationService`, `VotingService`, `TimerService`, `ViewportService` (follow-user), `PrometheusDataService` (only constructed when `METRICS_TOKEN` is set), `SystemMonitorService`, `ClusterService` (Redis Streams pub/sub when scaling).

For multi-node deployments, Redis is **required** — socket and room session keys are scoped with TTLs rather than cleared globally on shutdown so other nodes' state survives a single-node restart. Don't add global `FLUSH`-style operations; they'd break this guarantee.

### PHP service factories
Authentication and file lookup use a chain-of-services pattern (`lib/Service/Authentication/`, `lib/Service/File/`). `AuthenticateUserServiceFactory::create($publicSharingToken)` returns a `ChainAuthenticateUserService` that tries the public-share token first (it has stricter permissions than session users in some flows), then falls back to `IUserSession`. When adding a new auth path, add it to the chain rather than branching at call sites.

### Routes & PHP entry points
All HTTP routes are declared in `appinfo/routes.php` and resolve to controllers under `lib/Controller/`. `lib/AppInfo/Application.php` registers event listeners (CSP, viewer/text-editor loaders, template creator) and a `SetupCheck`. The NC<30 fallback for `RegisterTemplateCreatorEvent` is in `Application::boot` — keep it until `min-version` in `appinfo/info.xml` (currently `28`) is raised.

### Benchmarking
`tools/benchmarks/runBenchmarks.mjs` boots the production server (TLS off, LRU cache) and runs synthetic Socket.IO clients from `loadTest.mjs`. Tunable via `LOAD_TEST_CONCURRENCY`, `LOAD_TEST_ACTIVE_RATIO`, `LOAD_TEST_RATE`, `LOAD_TEST_DURATION`. Results land in `tools/benchmarks/results.json`. README has interpretation guidance and capacity recommendations.

## Conventions

- Formatting: tabs (width 4), no semicolons, single quotes, `bracketSameLine: true` (see `prettier` block in `package.json`).
- Frontend logging: import the project logger (`src/utils/logger.ts`) instead of using `console.*`.
- Recording-related runtime code: temp paths fall back to OS temp dir if `RECORDINGS_DIR` isn't writable — preserve that fallback rather than failing hard.
- Never commit `vendor/` or `node_modules/`. The CI build (`krankerl.toml`) re-runs `composer install --no-dev && npm ci && npm run build`.
