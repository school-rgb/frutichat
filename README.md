# LinkChat

LinkChat is a real-time global messaging platform built for Cloudflare Pages + Workers + Durable Objects + D1 + R2 + WebRTC.

## What it is

This project includes:

- Secure account creation, login, logout, and profile updates
- Cloudflare D1 data model for users, sessions, profiles, conversations, messages, attachments, calls, reports, and notifications
- Durable Object-backed chat rooms with WebSocket realtime messaging
- Typing indicators and presence updates
- Media uploads stored in Cloudflare R2 with metadata in D1
- WebRTC voice/video call signaling using Durable Object message routing
- Installable PWA shell and notification support
- Mobile-friendly responsive messenger UI

## Local install

1. Install dependencies:
   npm install
2. Create a local `.env` using `.env.example` as a template.
3. Start the local worker:
   npm run dev
4. Open the app at http://localhost:8787

## Cloudflare setup

### 1) Create D1 database

wrangler d1 create linkchat-db

Then update `wrangler.toml` with the generated `database_id`.

### 2) Create R2 bucket

wrangler r2 bucket create linkchat-media

### 3) Configure Durable Object

This project uses a Durable Object called `ChatRoom`, bound as `CHAT_ROOMS` in `wrangler.toml`.

### 4) Deploy

wrangler deploy

or, if using a Pages project, deploy the static front-end through Cloudflare Pages and keep the worker for API/WebSocket signaling.

## Database migrations

Apply the schema:

wrangler d1 migrations apply linkchat-db --local

On Cloudflare:

wrangler d1 migrations apply linkchat-db --remote

## Two-user test

1. Open the app in two different browsers.
2. Create account `alice` and `bob` in separate sessions.
3. Open a direct conversation.
4. Send a message from Alice and verify Bob sees it live without refresh.
5. Reload a browser and confirm conversation history remains.

## TURN configuration

Set these values in your environment or `.env`:

- TURN_SERVER_URL
- TURN_USERNAME
- TURN_PASSWORD

These are used by the WebRTC client for ICE candidates when direct peer connection is not possible.

## Notifications

To enable browser notifications, set your VAPID keys and request permission from the app UI when the user chooses notifications in settings.

## Custom domain

1. In Cloudflare Dashboard, add a custom domain to your Pages/Worker project.
2. Configure DNS records to Cloudflare.
3. Update `PUBLIC_BASE_URL` or frontend config to match your custom domain.

## Security notes

- Passwords are hashed with PBKDF2 and stored with a per-user salt.
- Sessions are exchangeable bearer tokens and are checked server-side.
- All sensitive endpoints require Authorization header verification.
- Upload validation and message validation occur on the server before persistence.

## Files included

- public/ — frontend app shell, UI, manifest, service worker
- worker/ — API and Durable Object implementation
- migrations/ — D1 schema
- tests/ — lightweight test coverage for auth helpers
- wrangler.toml — Cloudflare runtime configuration
