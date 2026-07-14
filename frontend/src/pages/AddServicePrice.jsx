import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchHospitals } from '../api/hospitalService'
import { fetchServiceCatalog, submitPriceEntry } from '../api/serviceService'
import { useAuth } from '../context/AuthContext'
import './Auth.css'
import './AddServicePrice.css'

export default function AddServicePrice() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [hospitals, setHospitals] = useState([])
  const [catalog, setCatalog] = useState([])
  const [form, setForm] = useState({
    hospitalId: searchParams.get('hospitalId') || '',
    serviceId: '',
    price: '',
    rating: '5',
    experience: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchHospitals().then(setHospitals).catch(() => {})
    fetchServiceCatalog().then(setCatalog).catch(() => {})
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.hospitalId || !form.serviceId || !form.price) {
      setError('Please fill in hospital, service, and price.')
      return
    }
    if (Number(form.price) <= 0) {
      setError('Price should be a positive number.')
      return
    }

    setSubmitting(true)
    try {
      await submitPriceEntry({
        hospitalId: form.hospitalId,
        serviceId: form.serviceId,
        price: Number(form.price),
        rating: Number(form.rating),
        experience: form.experience.trim(),
        submittedBy: user.id,
        submittedByName: user.name
      })
      setSuccess(true)
      setTimeout(() => navigate(`/hospitals/${form.hospitalId}`), 900)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="container">
        <form className="form-card wide" onSubmit={handleSubmit}>
          <span className="eyebrow">Help other patients</span>
          <h1>Share a price you paid</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Thanks! Your report has been added.</div>}

          <div className="field">
            <label htmlFor="hospitalId">Hospital</label>
            <select id="hospitalId" name="hospitalId" value={form.hospitalId} onChange={handleChange} required>
              <option value="">Select a hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="serviceId">Service</label>
            <select id="serviceId" name="serviceId" value={form.serviceId} onChange={handleChange} required>
              <option value="">Select a service</option>
              {catalog.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="price">Price paid (₹)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                required
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 800"
              />
            </div>

            <div className="field">
              <label htmlFor="rating">Your rating</label>
              <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Average</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Very poor</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="experience">Your experience (optional)</label>
            <textarea
              id="experience"
              name="experience"
              rows={4}
              value={form.experience}
              onChange={handleChange}
              placeholder="How was the wait time, staff, and report turnaround?"
            />
          </div>

          <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit price report'}
          </button>
        </form>
      </div>
    </div>
  )
}
