export default function StarRating({ value = 0, size = 14 }) {
  const rounded = Math.round(Number(value) * 2) / 2 // nearest half
  const stars = [1, 2, 3, 4, 5]

  return (
    <span style={{ display: 'inline-flex', gap: 2, verticalAlign: 'middle' }} aria-label={`${value} out of 5 stars`}>
      {stars.map((s) => {
        const fill = rounded >= s ? 1 : rounded >= s - 0.5 ? 0.5 : 0
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id={`half-${s}-${value}`}>
                <stop offset={`${fill * 100}%`} stopColor="#e8623d" />
                <stop offset={`${fill * 100}%`} stopColor="#e1e6ea" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.6 1-5.79-4.21-4.1 5.82-.85z"
              fill={`url(#half-${s}-${value})`}
            />
          </svg>
        )
      })}
    </span>
  )
}
