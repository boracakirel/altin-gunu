# Altın Günü

A chat-controlled livestream game for Twitch and Kick, designed for an OBS Browser Source.

## Status

Initial project scaffold only. Gameplay, platform integrations, persistence, and reports are not implemented yet. PixiJS is included for the future game scene; no renderer has been initialized.

## Requirements

- Node.js 24 or newer (Node 24 recommended; see `.nvmrc`).
- npm 11 or newer.

## Development

```sh
npm install
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend health check: <http://127.0.0.1:3001/api/health>

The Vite development server proxies `/api` requests to the backend. Both services bind to the local machine only. No platform credentials are needed for this scaffold.

## Checks

```sh
npm run typecheck
npm run build
```

`npm start` runs the built backend only. The frontend build is written to `apps/web/dist`; production frontend hosting will be configured later.

## Structure

```text
apps/
  server/  Fastify API (TypeScript)
  web/     React + Vite frontend, with PixiJS available
docs/
  proposal.md  Product proposal and development roadmap
```

## Planned milestones

1. Confirm gameplay rules and visual scope.
2. Build an offline playable prototype with simulated chat.
3. Add durable sessions and reliable milestone handling.
4. Integrate Twitch.
5. Integrate Kick.
6. Add reports, moderation, and release testing.

See [the proposal](docs/proposal.md) for details. VCS setup and initial commits are intentionally left to the project owner.
