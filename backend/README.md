# Hospital Compare — Backend (MySQL)

Node.js + Express REST API with JWT auth, clean MVC structure, and **MySQL**
for storage. Comes with pre-inserted hospitals, services, and sample prices
— logged-in users can add their own price/experience reports on top of that.

## 1. Load everything in one command

`sql/init.sql` creates the database, the tables, and inserts the seed data
(10 hospitals, 8 services, 15 sample price reports) all in one file.

```bash
mysql -u root -p < sql/init.sql
```

That's it — no need to create the database first. If you want a separate
app-level MySQL user instead of using root, create one first:

```bash
mysql -u root -p -e "CREATE USER 'hc_user'@'localhost' IDENTIFIED BY 'hc_password'; \
  GRANT ALL PRIVILEGES ON hospital_compare.* TO 'hc_user'@'localhost'; FLUSH PRIVILEGES;"
```

## 2. Configure and run

```bash
npm install
cp .env.example .env   # adjust DB_USER / DB_PASSWORD if you changed them
npm run dev             # or: npm start
```

API runs on **http://localhost:4000**.

## Structure (MVC)

```
config/db.js           mysql2 connection pool
sql/init.sql             one-file setup: schema + pre-inserted hospitals/services/prices
models/                 User, Hospital, Service, PriceEntry — SQL queries only
controllers/             validation + request handling, calls into models
routes/                  maps HTTP verbs + paths to controllers
middleware/
  auth.js                 verifies JWT, loads user from MySQL, sets req.user
  errorHandler.js          404 + centralized error responses
utils/jwt.js             sign/verify helpers
app.js / server.js       express app + boot
```

## Endpoints

| Method | Route                       | Auth | Description                          |
|--------|------------------------------|------|---------------------------------------|
| POST   | /api/auth/register            | –    | Sign up, returns `{ user, token }` |
| POST   | /api/auth/login                | –    | Log in, returns `{ user, token }` |
| GET    | /api/auth/me                    | ✅   | Current user from token |
| GET    | /api/hospitals?city=&search=      | –    | List hospitals, optional filters |
| GET    | /api/hospitals/:id                | –    | One hospital |
| GET    | /api/hospitals/meta/cities         | –    | Distinct city list |
| GET    | /api/services                       | –    | Service catalog |
| GET    | /api/prices?hospitalId=&submittedBy= | –  | Crowdsourced price/experience entries |
| POST   | /api/prices                          | ✅   | Submit a price + experience (requires login) |

Protected routes require `Authorization: Bearer <token>`.

## Data model

- **users** — id, name, email (unique), password_hash (bcrypt), city, created_at
- **hospitals** — id, name, city, address, type, rating
- **services** — id, name, category
- **price_entries** — id, hospital_id (FK), service_id (FK), price, rating,
  experience, submitted_by (FK → users, nullable), submitted_by_name, created_at

## Connecting the React frontend

In the frontend's `.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Point `authService.js` at `POST /auth/register` and `POST /auth/login`
directly, and prefix the other service files' paths with `/api` — the
response shapes (`{ user, token }`, hospital/service/price objects) already
match what the frontend expects.

## Notes

- Passwords are bcrypt-hashed before storage — never stored in plain text.
- `ON DUPLICATE KEY UPDATE` in init.sql makes it safe to re-run without duplicating rows.
- Swap `config/db.js` for another database later if needed — models are the
  only place that touches SQL, so nothing else changes.
