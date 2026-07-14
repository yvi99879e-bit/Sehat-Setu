import 'dotenv/config'
import app from './app.js'
import pool from './config/db.js'

const PORT = process.env.PORT || 4000

function logConfig() {
  const host = (process.env.DB_HOST || 'localhost').trim()
  const port = (process.env.DB_PORT || '3306').trim()
  const user = (process.env.DB_USER || '').trim()
  const name = (process.env.DB_NAME || '').trim()
  const ssl = (process.env.DB_SSL || 'false').trim().toLowerCase()
  console.log(`DB config -> host=${host} port=${port} user=${user} database=${name} ssl=${ssl}`)
}

async function start() {
  logConfig()
  // Fail fast with a clear message instead of only erroring on the first request.
  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected successfully')
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    console.error('   Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL in your .env file,')
    console.error('   and make sure MySQL is running and sql/init.sql has been loaded.')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`Hospital-compare API running on http://localhost:${PORT}`)
  })
}

start()
