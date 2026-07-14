import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchHospitalById, fetchHospitals } from '../api/hospitalService'
import {
  fetchPriceEntriesByHospital,
  fetchServiceCatalog,
  summarizeEntriesByService
} from '../api/serviceService'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import ServiceTable from '../components/ServiceTable'
import './HospitalDetail.css'

export default function HospitalDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [hospital, setHospital] = useState(null)
  const [summaries, setSummaries] = useState([])
  const [catalog, setCatalog] = useState([])
  const [cityRangeByService, setCityRangeByService] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([
      fetchHospitalById(id),
      fetchPriceEntriesByHospital(id),
      fetchServiceCatalog()
    ])
      .then(([hospitalData, entries, catalogData]) => {
        if (cancelled) return
        setHospital(hospitalData)
        setCatalog(catalogData)
        setSummaries(summarizeEntriesByService(entries))
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [id])

  // City-wide min/max per service, so a single hospital's band shows in context
  useEffect(() => {
    if (!hospital) return
    let cancelled = false

    async function loadCityRanges() {
      const cityHospitals = await fetchHospitals({ city: hospital.city })
      const allEntries = (
        await Promise.all(cityHospitals.map((h) => fetchPriceEntriesByHospital(h.id)))
      ).flat()

      const ranges = {}
      allEntries.forEach((e) => {
        const p = Number(e.price)
        if (!ranges[e.serviceId]) ranges[e.serviceId] = { min: p, max: p }
        ranges[e.serviceId].min = Math.min(ranges[e.serviceId].min, p)
        ranges[e.serviceId].max = Math.max(ranges[e.serviceId].max, p)
      })
      if (!cancelled) setCityRangeByService(ranges)
    }

    loadCityRanges()
    return () => {
      cancelled = true
    }
  }, [hospital])

  if (loading) return <div className="page container"><p>Loading hospital…</p></div>
  if (error) return <div className="page container"><div className="alert alert-error">{error}</div></div>
  if (!hospital) return null

  return (
    <div className="page">
      <div className="container">
        <div className="hd-header">
          <div>
            <Link to="/hospitals" className="hd-back">← Back to hospitals</Link>
            <h1>{hospital.name}</h1>
            <p className="hd-address">{hospital.address}, {hospital.city}</p>
            <div className="hd-rating">
              <StarRating value={hospital.rating} size={16} />
              <span className="mono">{hospital.rating.toFixed(1)}</span>
              <span className="hd-type eyebrow">{hospital.type}</span>
            </div>
          </div>

          <Link
            to={isAuthenticated ? `/add-price?hospitalId=${hospital.id}` : '/login'}
            className="btn btn-accent"
          >
            + Add a price you paid
          </Link>
        </div>

        <section className="hd-section">
          <h2>Services &amp; pricing</h2>
          <p className="hd-section-sub">
            Prices below are reported directly by patients. The marker shows the average; the bar
            shows the full range reported across {hospital.city}.
          </p>
          <ServiceTable summaries={summaries} catalog={catalog} cityRangeByService={cityRangeByService} />
        </section>
      </div>
    </div>
  )
}
