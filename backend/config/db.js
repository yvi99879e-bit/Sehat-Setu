import mysql from 'mysql2/promise'

// Render's env var inputs can silently include a trailing space or newline
// when typed/pasted, which breaks strict '=== "true"' checks and credential
// matches. Trim everything defensively so that class of bug can't happen.
const clean = (val, fallback) => {
  if (val === undefined || val === null) return fallback
  const trimmed = String(val).trim()
  return trimmed === '' ? fallback : trimmed
}

const sslEnabled = clean(process.env.DB_SSL, 'false').toLowerCase() === 'true'

const pool = mysql.createPool({
  host: clean(process.env.DB_HOST, 'localhost'),
  port: Number(clean(process.env.DB_PORT, '3306')),
  user: clean(process.env.DB_USER, 'hc_user'),
  password: clean(process.env.DB_PASSWORD, 'hc_password'),
  database: clean(process.env.DB_NAME, 'hospital_compare'),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  // Hosted MySQL providers (Aiven, TiDB Cloud, etc.) require SSL.
  // Set DB_SSL=true in .env when deploying; leave unset for local MySQL.
  ssl: sslEnabled ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
})

export default pool
