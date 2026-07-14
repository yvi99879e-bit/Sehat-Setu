import './PriceBand.css'

/**
 * Renders the min–avg–max spread for a service's crowdsourced prices
 * against a shared city-wide scale, so a hospital's position relative
 * to the cheapest/priciest entry in the city is visible at a glance.
 */
export default function PriceBand({ min, avg, max, cityMin, cityMax }) {
  const range = Math.max(cityMax - cityMin, 1)
  const pct = (val) => Math.min(100, Math.max(0, ((val - cityMin) / range) * 100))

  return (
    <div className="price-band">
      <div className="price-band-track">
        <div
          className="price-band-fill"
          style={{ left: `${pct(min)}%`, width: `${Math.max(pct(max) - pct(min), 2)}%` }}
        />
        <div className="price-band-avg" style={{ left: `${pct(avg)}%` }} title={`Average ₹${avg}`} />
      </div>
      <div className="price-band-labels mono">
        <span>₹{min.toLocaleString('en-IN')}</span>
        <span className="price-band-avg-label">avg ₹{avg.toLocaleString('en-IN')}</span>
        <span>₹{max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}
