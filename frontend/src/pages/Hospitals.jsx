import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCities, fetchHospitals } from '../api/hospitalService'
import { fetchPriceEntriesByHospital } from '../api/serviceService'
import HospitalCard from '../components/HospitalCard'
import './Hospitals.css'

export default function Hospitals() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cityParam = searchParams.get('city') || ''

  const [cities, setCities] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [entryCounts, setEntryCounts] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchHospitals({ city: cityParam, search })
      .then(async (list) => {
        if (cancelled) return
        setHospitals(list)
        const counts = {}
        await Promise.all(
          list.map(async (h) => {
            const entries = await fetchPriceEntriesByHospital(h.id)
            counts[h.id] = entries.length
          })
        )
        if (!cancelled) setEntryCounts(counts)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [cityParam, search])

  function handleCityChange(e) {
    const value = e.target.value
    setSearchParams(value ? { city: value } : {})
  }

  return (
    <div className="page">
      <div className="container">
        <div className="hospitals-header">
          <div>
            <span className="eyebrow">Directory</span>
            <h1>Compare hospitals{cityParam ? ` in ${cityParam}` : ''}</h1>
          </div>

          <div className="hospitals-filters">
            <select value={cityParam} onChange={handleCityChange}>
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search hospital name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p>Loading hospitals…</p>
        ) : hospitals.length === 0 ? (
          <div className="empty-state">
            <p>No hospitals found{cityParam ? ` in ${cityParam}` : ''}.</p>
            <p>Try a different city or clear your search.</p>
          </div>
        ) : (
          <div className="hospitals-grid">
            {hospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} entryCount={entryCounts[h.id] || 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
