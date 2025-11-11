# React JWT Authentication (Access + Refresh)

Full-stack authentication sample that satisfies the IA04 requirements: Vite + React on the client, Express + MongoDB on the API, JWT access & refresh tokens, Axios interceptors, React Query for server state, and React Hook Form for validation.

> **Live Frontend:** https://react-authenticationwith-jwt.vercel.app/  
> **Hosted API:** https://reactauthenticationwithjwt.onrender.com (base URL already configured in the deployed client)

## Stack

- **Frontend:** Vite + React 18 + TypeScript, React Router, React Query, React Hook Form, Axios
- **Backend:** Express 4, MongoDB with Mongoose, JWT, bcrypt
- **Auth Flow:** Access token in memory, refresh token in `localStorage`, Axios interceptor with automatic refresh + logout fallback

## Project Structure

```
IA04/
├── client/   # Vite React app (UI, React Query, React Hook Form)
└── server/   # Express API, Mongo models, JWT logic
```

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- MongoDB instance (local `mongod` or cloud e.g. Atlas)

## 1. Backend Setup (`server`)

1. Copy `.env.example` to `.env` and adjust values:
   ```bash
   cd server
   cp .env.example .env
   # update MONGODB_URI, JWT secrets, etc.
   ```
2. Install dependencies & run the API:
   ```bash
   npm install
   npm run dev
   ```
3. The server seeds a demo user automatically (defaults: `demo@example.com` / `Password123!`).

### API Endpoints

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | `/api/auth/login`     | Returns `{ user, accessToken, refreshToken }` |
| POST   | `/api/auth/refresh`   | Returns `{ user, accessToken }` using a refresh token |
| POST   | `/api/auth/logout`    | Invalidates the stored refresh token |
| GET    | `/api/protected/profile` | Example protected resource |

## 2. Frontend Setup (`client`)

1. Copy env template:
   ```bash
   cd client
   cp .env.example .env
   ```
   - `VITE_API_URL` should point at the backend (default `http://localhost:5000/api`).
   - Optional: set `VITE_API_PROXY=http://localhost:5000` to use Vite's dev proxy.
2. Install & run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` and sign in with the seeded credentials.

### Frontend Highlights

- **React Hook Form** enforces required email/password validation and friendly errors.
- **React Query** handles login/logout mutations and the protected `profile` query.
- **Axios** instance auto-attaches the access token and transparently refreshes it (queueing pending requests during refresh).
- **Auth Context** keeps the session in sync, bootstraps from refresh token, and broadcasts forced logouts.
- **ProtectedRoute** gate-keeps the dashboard until authentication is confirmed.

## Deployment Notes

1. Deploy the API (e.g., Render, Railway, Fly.io, or a simple VPS) and provide the production MongoDB URI (Atlas recommended).
2. Update the client's `VITE_API_URL` with the deployed API base (e.g., `https://api.yourapp.com/api`).
3. Build the client with `npm run build` and deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.
4. The `client/vercel.json` rewrite ensures deep links (e.g., `/login`) fall back to `index.html` on Vercel; re-upload this file if you reconfigure the project.
5. Confirm the **Hosted URL** entries above stay in sync with any redeployments (Vercel for the client, Render for the API).

## Testing the Flow

1. Start both services locally.
2. Visit the login page and authenticate with the demo credentials.
3. Use the dashboard; open the dev tools > Application tab to observe the refresh token in `localStorage` while the access token stays in memory.
4. Hit logout — both tokens are cleared and the session resets.

## Troubleshooting

- **Mongo connection errors**: verify `MONGODB_URI` and that `mongod`/Atlas is reachable.
- **JWT issues**: make sure `.env` contains matching `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` across restarts.
- **401 loops**: removing the refresh token (`localStorage` key `ia04_refresh_token`) forces a clean relog.

Happy hacking!
