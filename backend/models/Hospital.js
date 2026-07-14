import pool from '../config/db.js'

const Hospital = {
  async findAll({ city, search } = {}) {
    let sql = 'SELECT * FROM hospitals WHERE 1=1'
    const params = []

    if (city) {
      sql += ' AND city = ?'
      params.push(city)
    }
    if (search) {
      sql += ' AND name LIKE ?'
      params.push(`%${search}%`)
    }
    sql += ' ORDER BY name'

    const [rows] = await pool.query(sql, params)
    return rows.map((r) => ({ ...r, rating: Number(r.rating) }))
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM hospitals WHERE id = ? LIMIT 1', [id])
    if (!rows[0]) return null
    return { ...rows[0], rating: Number(rows[0].rating) }
  },

  async distinctCities() {
    const [rows] = await pool.query('SELECT DISTINCT city FROM hospitals ORDER BY city')
    return rows.map((r) => r.city)
  }
}

export default Hospital
