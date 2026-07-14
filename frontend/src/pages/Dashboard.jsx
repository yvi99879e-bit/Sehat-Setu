import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchPriceEntriesByUser } from '../api/serviceService'
import { fetchHospitals } from '../api/hospitalService'
import { fetchServiceCatalog } from '../api/serviceService'
import StarRating from '../components/StarRating'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [hospitalsById, setHospitalsById] = useState({})
  const [catalogById, setCatalogById] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([fetchPriceEntriesByUser(user.id), fetchHospitals(), fetchServiceCatalog()])
      .then(([userEntries, hospitals, catalog]) => {
        if (cancelled) return
        setEntries(userEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        setHospitalsById(Object.fromEntries(hospitals.map((h) => [h.id, h])))
        setCatalogById(Object.fromEntries(catalog.map((c) => [c.id, c])))
      })
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [user.id])

  return (
    <div className="page">
      <div className="container">
        <div className="dash-header">
          <div>
            <span className="eyebrow">Your contributions</span>
            <h1>My submissions</h1>
            <p>{entries.length} price report{entries.length === 1 ? '' : 's'} submitted so far.</p>
          </div>
          <Link to="/add-price" className="btn btn-accent">+ Add a price</Link>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any price reports yet.</p>
            <Link to="/add-price" className="btn btn-primary" style={{ marginTop: 12 }}>
              Add your first price report
            </Link>
          </div>
        ) : (
          <div className="dash-list">
            {entries.map((e) => {
              const hospital = hospitalsById[e.hospitalId]
              const service = catalogById[e.serviceId]
              return (
                <div key={e.id} className="dash-item card">
                  <div className="dash-item-main">
                    <strong>{service?.name || 'Service'}</strong>
                    <span className="dash-item-hospital">
                      {hospital ? (
                        <Link to={`/hospitals/${hospital.id}`}>{hospital.name}</Link>
                      ) : 'Unknown hospital'}
                    </span>
                  </div>
                  <div className="dash-item-meta">
                    <span className="price mono">₹{Number(e.price).toLocaleString('en-IN')}</span>
                    <StarRating value={e.rating} size={13} />
                    <span className="dash-item-date">
                      {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {e.experience && <p className="dash-item-text">{e.experience}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
