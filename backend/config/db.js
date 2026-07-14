import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'hc_user',
  password: process.env.DB_PASSWORD || 'hc_password',
  database: process.env.DB_NAME || 'hospital_compare',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
})

export default pool
