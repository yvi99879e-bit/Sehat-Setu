import { v4 as uuid } from 'uuid'
import pool from '../config/db.js'

function toCamel(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    city: row.city,
    createdAt: row.created_at
  }
}

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    return toCamel(rows[0])
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    return toCamel(rows[0])
  },

  async create({ name, email, passwordHash, city }) {
    const id = uuid()
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, city) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, passwordHash, city]
    )
    return this.findById(id)
  }
}

export default User
