import Hospital from '../models/Hospital.js'

export async function getHospitals(req, res) {
  const { city, search } = req.query
  res.json(await Hospital.findAll({ city, search }))
}

export async function getHospitalById(req, res) {
  const hospital = await Hospital.findById(req.params.id)
  if (!hospital) return res.status(404).json({ message: 'Hospital not found.' })
  res.json(hospital)
}

export async function getCities(req, res) {
  res.json(await Hospital.distinctCities())
}
