import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    navigate(city ? `/hospitals?city=${encodeURIComponent(city)}` : '/hospitals')
  }

  return (
    <div className="page">
      <section className="hero container">
        <span className="eyebrow">Crowdsourced, city by city</span>
        <h1 className="hero-title">
          Know the price of care <em>before</em> you walk in.
        </h1>
        <p className="hero-sub">
          Sehat Setu collects real bills and real experiences from patients — X-rays, ultrasounds,
          MRIs, blood work — so you can compare hospitals in your city before you book.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter your city — e.g. Varanasi, Lucknow, Patna"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="btn btn-accent">
            Compare hospitals
          </button>
        </form>

        <div className="hero-stats">
          <div>
            <span className="stat mono">15+</span>
            <span>price reports submitted</span>
          </div>
          <div>
            <span className="stat mono">10</span>
            <span>hospitals tracked</span>
          </div>
          <div>
            <span className="stat mono">03</span>
            <span>Tier 2 cities covered</span>
          </div>
        </div>
      </section>

      <section className="how container">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="how-card card">
            <span className="eyebrow">Search</span>
            <h3>Find your city</h3>
            <p>Browse hospitals near you and see how their pricing stacks up at a glance.</p>
          </div>
          <div className="how-card card">
            <span className="eyebrow">Compare</span>
            <h3>See real prices</h3>
            <p>Every service shows the range patients actually paid — not a rate card, the real spread.</p>
          </div>
          <div className="how-card card">
            <span className="eyebrow">Contribute</span>
            <h3>Share your bill</h3>
            <p>Sign up and add what you paid, plus your experience, to help the next patient decide.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
