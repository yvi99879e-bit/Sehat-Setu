import { useState } from 'react'
import StarRating from './StarRating'
import PriceBand from './PriceBand'
import './ServiceTable.css'

export default function ServiceTable({ summaries, catalog, cityRangeByService }) {
  const [openId, setOpenId] = useState(null)
  const catalogById = Object.fromEntries(catalog.map((c) => [c.id, c]))

  if (summaries.length === 0) {
    return (
      <div className="empty-state">
        <p>No prices have been reported for this hospital yet.</p>
        <p>Be the first to share what you paid.</p>
      </div>
    )
  }

  return (
    <div className="service-table">
      {summaries.map((s) => {
        const service = catalogById[s.serviceId] || { name: 'Unknown service' }
        const cityRange = cityRangeByService[s.serviceId] || { min: s.min, max: s.max }
        const isOpen = openId === s.serviceId

        return (
          <div className="service-row" key={s.serviceId}>
            <button
              className="service-row-header"
              onClick={() => setOpenId(isOpen ? null : s.serviceId)}
              aria-expanded={isOpen}
            >
              <div className="service-row-name">
                <strong>{service.name}</strong>
                <span className="service-row-count">{s.count} report{s.count === 1 ? '' : 's'}</span>
              </div>

              <PriceBand min={s.min} avg={s.avg} max={s.max} cityMin={cityRange.min} cityMax={cityRange.max} />

              <div className="service-row-rating">
                {s.avgRating && (
                  <>
                    <StarRating value={s.avgRating} size={13} />
                    <span className="mono">{s.avgRating}</span>
                  </>
                )}
              </div>

              <span className={`service-row-chevron ${isOpen ? 'open' : ''}`}>⌄</span>
            </button>

            {isOpen && (
              <ul className="service-entries">
                {s.entries.map((e) => (
                  <li key={e.id} className="service-entry">
                    <div className="service-entry-top">
                      <span className="price mono service-entry-price">₹{Number(e.price).toLocaleString('en-IN')}</span>
                      {e.rating && <StarRating value={e.rating} size={12} />}
                      <span className="service-entry-date">
                        {new Date(e.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {e.experience && <p className="service-entry-text">{e.experience}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
