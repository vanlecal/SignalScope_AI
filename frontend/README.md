# SignalScope AI — Frontend

React + TypeScript frontend for SignalScope AI built with Vite and Tailwind.

This UI consumes the backend APIs to display live business and market news, present summarized metrics,
and request AI analyses for events.

---

## Tech stack

- React 19 + TypeScript
- Vite (bundler)
- Tailwind CSS v4
- lucide-react (icons), Framer Motion, Recharts
- Radix UI primitives

---

## Quick start

Requirements: Node.js 18+ and npm

Install dependencies

```bash
cd frontend
npm install
```

Run dev server

```bash
npm run dev
```

Build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

Lint / format

```bash
npm run lint
npm run format
```

---

## Environment variables

Configure a `.env` file at the project root (the frontend folder) with at least:

- `VITE_BACKEND_URL` — base URL of the backend (e.g. `http://localhost:5000`)

Vite exposes variables prefixed with `VITE_` via `import.meta.env`.

---

## Important files & structure

- `src/pages/Landing.tsx` — main landing page and where `Footer` is included
- `src/components/Footer.tsx` — footer component used on the landing page
- `src/lib/api.ts` — functions that call backend endpoints (`/api/live-feed/news`, `/api/agent/analyze`)
- `vite.config.ts` — Vite configuration (Tailwind plugin + tsconfig paths)
- `package.json` — scripts and dependencies

General layout:

```
frontend/
├─ src/
│  ├─ components/
│  ├─ lib/
│  └─ pages/
├─ vite.config.ts
├─ package.json
└─ README.md
```

---

## How the frontend talks to the backend

All backend requests use the `VITE_BACKEND_URL` env var in `src/lib/api.ts`.

- Live feed: `GET ${VITE_BACKEND_URL}/api/live-feed/news?category=...`
- Agent analysis: `POST ${VITE_BACKEND_URL}/api/agent/analyze` with JSON body `{ "event": "..." }`

If you run the backend locally with port `5000`, set `VITE_BACKEND_URL=http://localhost:5000`.

---

## Tailwind & Styling

Tailwind is configured via the `@tailwindcss/vite` plugin in `vite.config.ts`. Modify Tailwind config
or `styles.css` as needed.

---

## Troubleshooting

- If API calls fail, confirm `VITE_BACKEND_URL` is correct and the backend is reachable.
- If types fail, run `npm install` to ensure `@types/*` are installed and restart the dev server.

---

## Contributing

1. Create a feature branch from `main`
2. Run the dev server and make changes
3. Open a PR with a short description

---

If you want, I can add an example `.env` file, a short OpenAPI client snippet, or a Postman collection for the backend endpoints.
