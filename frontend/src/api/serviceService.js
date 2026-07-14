import axiosClient from './axiosClient'

// Master catalog of comparable services (X-Ray, Ultrasound, MRI, ...)
export async function fetchServiceCatalog() {
  const { data } = await axiosClient.get('/services')
  return data
}

// All crowdsourced price/experience entries for one hospital
export async function fetchPriceEntriesByHospital(hospitalId) {
  const { data } = await axiosClient.get('/prices', {
    params: { hospitalId }
  })
  return data
}

// Every entry a given user has personally submitted
export async function fetchPriceEntriesByUser(userId) {
  const { data } = await axiosClient.get('/prices', {
    params: { submittedBy: userId }
  })
  return data
}

// Submit a new price + experience entry (submittedBy/submittedByName are
// derived server-side from the auth token, so we don't send them here)
export async function submitPriceEntry({ hospitalId, serviceId, price, rating, experience }) {
  const { data } = await axiosClient.post('/prices', { hospitalId, serviceId, price, rating, experience })
  return data
}

// Compute min / max / average price for each service at a hospital
export function summarizeEntriesByService(entries) {
  const grouped = {}
  entries.forEach((entry) => {
    if (!grouped[entry.serviceId]) grouped[entry.serviceId] = []
    grouped[entry.serviceId].push(entry)
  })

  return Object.entries(grouped).map(([serviceId, list]) => {
    const prices = list.map((e) => Number(e.price))
    const ratings = list.map((e) => Number(e.rating)).filter((r) => !Number.isNaN(r))
    return {
      serviceId,
      count: list.length,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      avgRating: ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null,
      entries: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  })
}
