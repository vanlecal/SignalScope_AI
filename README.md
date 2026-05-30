# SignalScope AI

SignalScope AI — Autonomous web intelligence for real-time business impact analysis.

Live demo: https://signal-scope-ai.vercel.app/

SignalScope ingests live business and market news, filters and normalizes results, and produces concise AI-driven impact analyses that power the frontend dashboard.

---

**Repository layout**

- `frontend/` — React + TypeScript UI (Vite + Tailwind). See `frontend/README.md` for frontend-specific setup.
- `backend/` — Node.js + Express backend integrating Bright Data and Groq. See `backend/README.md` for backend-specific setup.

---

**Quick start (development)**

1. Clone the repository:

```bash
git clone <repo-url>
cd SignalScope_AI
```

2. Backend: install and run

```bash
cd backend
npm install
npm run dev
```

3. Frontend: install and run (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the frontend dev server (Vite) URL shown in the terminal (usually `http://localhost:5173`) or visit the hosted demo above.

---

**Environment variables**

Backend (see `backend/README.md` for details):

- `BRIGHTDATA_API_KEY`
- `BRIGHTDATA_ZONE`
- `BRIGHTDATA_SERP_ZONE`
- `GROQ_API_KEY`
- `PORT` (optional, defaults to 5000)
- Optional: `ALLOWED_IP_1`, `ALLOWED_IP_2`, `ALLOWED_IP_3` (informational — not enforced by default)

Frontend:

- `VITE_BACKEND_URL` — base URL for API calls (e.g. `http://localhost:5000` or the hosted backend URL)

---

**Architecture & key flows**

- Live feed: frontend calls `GET /api/live-feed/news` (backend calls Bright Data SERP, normalizes articles, resolves preview images when possible, and caches results briefly).
- Agent analysis: frontend posts `{ event }` to `POST /api/agent/analyze`; the backend fetches live news relevant to the event, summarizes top items, and sends them with the event to Groq to produce structured JSON analysis.

---

**APIs (examples)**

Live feed:

```bash
curl "${VITE_BACKEND_URL:-http://localhost:5000}/api/live-feed/news?category=Tech"
```

Agent analysis:

```bash
curl -X POST http://localhost:5000/api/agent/analyze \
	-H "Content-Type: application/json" \
	-d '{"event":"NVIDIA announces new AI chip"}'
```

---

**Notes & operational considerations**

- Bright Data and Groq credentials are required for full functionality; without them the backend will return errors for those flows.
- Image resolution and SERP scraping are performed server-side to avoid exposing scraping credentials in the browser.
- The repository retains small in-memory caches (live-feed and preview images) to reduce external requests; these are not persistent and reset on restart.
- The backend currently logs any `ALLOWED_IP_*` values found in `.env` but does not block requests by default. Re-enable allowlisting middleware if you require IP-based restriction.

---

**Contributing**

1. Fork the repo and open a branch
2. Run the frontend and backend locally
3. Open a PR with a clear description and link to any design or API changes

---

For frontend-specific docs, see `frontend/README.md`.
For backend-specific docs, see `backend/README.md`.

If you want I can also add:

- An OpenAPI spec for the backend endpoints
- A Postman collection or example `.env` files for quick local testing

---

License: see the `LICENSE` file in the repository.
