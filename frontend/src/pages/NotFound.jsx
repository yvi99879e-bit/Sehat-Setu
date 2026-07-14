import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <span className="eyebrow">404</span>
      <h1>This page doesn't exist</h1>
      <p>The page you're looking for may have moved or never existed.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  )
}
