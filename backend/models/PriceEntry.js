import { v4 as uuid } from 'uuid'
import pool from '../config/db.js'

function toCamel(row) {
  if (!row) return null
  return {
    id: row.id,
    hospitalId: row.hospital_id,
    serviceId: row.service_id,
    price: Number(row.price),
    rating: row.rating === null ? null : Number(row.rating),
    experience: row.experience,
    submittedBy: row.submitted_by,
    submittedByName: row.submitted_by_name,
    createdAt: row.created_at
  }
}

const PriceEntry = {
  async findAll({ hospitalId, submittedBy } = {}) {
    let sql = 'SELECT * FROM price_entries WHERE 1=1'
    const params = []

    if (hospitalId) {
      sql += ' AND hospital_id = ?'
      params.push(hospitalId)
    }
    if (submittedBy) {
      sql += ' AND submitted_by = ?'
      params.push(submittedBy)
    }
    sql += ' ORDER BY created_at DESC'

    const [rows] = await pool.query(sql, params)
    return rows.map(toCamel)
  },

  async create({ hospitalId, serviceId, price, rating, experience, submittedBy, submittedByName }) {
    const id = uuid()
    await pool.query(
      `INSERT INTO price_entries
        (id, hospital_id, service_id, price, rating, experience, submitted_by, submitted_by_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, hospitalId, serviceId, price, rating, experience || null, submittedBy, submittedByName]
    )
    const [rows] = await pool.query('SELECT * FROM price_entries WHERE id = ?', [id])
    return toCamel(rows[0])
  }
}

export default PriceEntry
