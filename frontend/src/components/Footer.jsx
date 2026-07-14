export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12.5, color: 'var(--muted-soft)' }}>
          © {new Date().getFullYear()} Sehat Setu. Prices are patient-reported and may vary.
        </span>
        <span style={{ fontSize: 12.5, color: 'var(--muted-soft)' }}>Built for transparent healthcare pricing.</span>
      </div>
    </footer>
  )
}
