import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './HospitalCard.css'

export default function HospitalCard({ hospital, entryCount = 0 }) {
  return (
    <Link to={`/hospitals/${hospital.id}`} className="hospital-card card">
      <div className="hospital-card-top">
        <div>
          <h3>{hospital.name}</h3>
          <p className="hospital-card-address">{hospital.address}, {hospital.city}</p>
        </div>
        <span className="hospital-card-type eyebrow">{hospital.type}</span>
      </div>

      <div className="hospital-card-bottom">
        <div className="hospital-card-rating">
          <StarRating value={hospital.rating} />
          <span className="mono hospital-card-rating-value">{hospital.rating.toFixed(1)}</span>
        </div>
        <span className="hospital-card-entries">
          {entryCount > 0 ? `${entryCount} price report${entryCount === 1 ? '' : 's'}` : 'No prices yet'}
        </span>
      </div>
    </Link>
  )
}
