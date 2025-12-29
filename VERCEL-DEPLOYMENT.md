# Vercel Deployment Guide (Frontend)

This repo contains:
- A Next.js frontend (Vercel-friendly)
- A Fastify API server (not designed to run as a long-lived process on Vercel)

The recommended production setup is **two deployments**:
1) Deploy the **Next.js frontend** to Vercel
2) Deploy the **Fastify API** to a Node-friendly host (Render/Railway/Fly.io/DigitalOcean/etc.)

---

## 1) Deploy the API (Fastify)

### Requirements
- Node.js 18+ recommended
- A MongoDB database (Atlas or self-hosted)

### Environment variables
Set these on your API host:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_APP_URL` (the Vercel URL, for CORS)
- `API_PORT` (only if your host needs it; many hosts provide `PORT` instead)

### Notes
- In production, the API should **not** rely on `.env.local`.
- Make sure your MongoDB IP allowlist is configured (Atlas) and network access is open.

---

## 2) Deploy the Frontend (Next.js) to Vercel

### Steps
1. Push the repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Framework preset: **Next.js**.
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your deployed API base URL (example: `https://your-api.example.com`)
   - `NEXT_PUBLIC_APP_URL` = your Vercel app URL (example: `https://your-app.vercel.app`)
5. Deploy.

### Validate
- Open the deployed site
- Try registering a user
- Confirm the API host logs show requests arriving

---

## Troubleshooting

### "Failed to fetch" in production
- Check `NEXT_PUBLIC_API_URL` on Vercel.
- Confirm the API is reachable from the public internet.
- Confirm API CORS `origin` matches your Vercel URL.

### Auth works locally but fails in production
- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set on the API host.
- Ensure you did not deploy with placeholder secrets.
