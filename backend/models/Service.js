import pool from '../config/db.js'

const Service = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY name')
    return rows
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ? LIMIT 1', [id])
    return rows[0] || null
  }
}

export default Service
