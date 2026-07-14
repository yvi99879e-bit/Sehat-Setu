import 'dotenv/config'
import app from './app.js'
import pool from './config/db.js'

const PORT = process.env.PORT || 4000

async function start() {
  // Fail fast with a clear message instead of only erroring on the first request.
  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected successfully')
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    console.error('   Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in your .env file,')
    console.error('   and make sure MySQL is running and sql/init.sql has been loaded.')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`Hospital-compare API running on http://localhost:${PORT}`)
  })
}

start()
