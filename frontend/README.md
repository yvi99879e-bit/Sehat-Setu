# Sehat Setu — Hospital Service Price Comparison (Frontend)

A React (Vite) frontend where users browse hospitals in their city, compare
crowdsourced prices for services (X-Ray, Ultrasound, MRI, blood tests, etc.),
sign up / log in, and submit the price + experience they personally had so
other patients can see it.

This frontend talks to the **backend** API (Node.js + Express + JWT + MySQL,
in the sibling `backend/` folder) — that backend must be running first.

## Stack

- **React 18 + Vite** — app shell and dev server
- **react-router-dom v6** — routing
- **axios** — all API calls go through `src/api/axiosClient.js` (auth token auto-attached, errors normalized)

## Getting started

1. **Start the backend first** (see `backend/README.md`):
   ```bash
   cd ../backend
   npm install
   npm run dev     # runs on http://localhost:4000
   ```

2. **Then run the frontend:**
   ```bash
   npm install
   cp .env.example .env    # default already points at http://localhost:4000/api
   npm run dev              # runs on http://localhost:5173
   ```

3. Open http://localhost:5173, sign up for a new account, and start browsing.

## Project structure

```
src/
  api/                 axios instance + one service module per resource
    axiosClient.js       shared axios instance, auth header, error normalization
    authService.js        register / login / logout against the real backend
    hospitalService.js    fetch hospitals (server-side city/search filtering), cities
    serviceService.js     service catalog + crowdsourced price entries, summarization
  context/
    AuthContext.jsx      global auth state (user, login, register, logout)
  components/            Navbar, HospitalCard, ServiceTable, PriceBand, StarRating, ProtectedRoute
  pages/                 Home, Hospitals, HospitalDetail, Login, Register, Dashboard, AddServicePrice
```

## How auth works

- `POST /auth/register` and `POST /auth/login` return `{ user, token }`.
- The JWT is stored in `localStorage` and attached as `Authorization: Bearer <token>`
  to every request via an axios interceptor.
- `ProtectedRoute` redirects to `/login` if there's no active session.
- Submitting a price report (`POST /prices`) requires being logged in — the
  backend derives who submitted it from the token, not from the request body.

## Data model (matches the backend / MySQL schema)

- **hospitals** — `{ id, name, city, address, type, rating }`
- **services** — master catalog, `{ id, name, category }`
- **priceEntries** (`/prices`) — `{ id, hospitalId, serviceId, price, rating, experience, submittedBy, submittedByName, createdAt }`
- **users** — `{ id, name, email, city }` (password never sent to the frontend)

`HospitalDetail` aggregates price entries per service into min/avg/max and
renders them with the `PriceBand` component, plus a list of individual
patient experiences.
