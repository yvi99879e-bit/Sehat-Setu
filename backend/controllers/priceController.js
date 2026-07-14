import PriceEntry from '../models/PriceEntry.js'
import Hospital from '../models/Hospital.js'
import Service from '../models/Service.js'

export async function getPriceEntries(req, res) {
  const { hospitalId, submittedBy } = req.query
  res.json(await PriceEntry.findAll({ hospitalId, submittedBy }))
}

export async function createPriceEntry(req, res) {
  const { hospitalId, serviceId, price, rating, experience } = req.body

  if (!hospitalId || !serviceId || !price) {
    return res.status(400).json({ message: 'hospitalId, serviceId, and price are required.' })
  }
  if (Number(price) <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' })
  }
  if (!(await Hospital.findById(hospitalId))) {
    return res.status(404).json({ message: 'Hospital not found.' })
  }
  if (!(await Service.findById(serviceId))) {
    return res.status(404).json({ message: 'Service not found.' })
  }

  const entry = await PriceEntry.create({
    hospitalId,
    serviceId,
    price: Number(price),
    rating: Number(rating) || null,
    experience,
    submittedBy: req.user.id,
    submittedByName: req.user.name
  })

  res.status(201).json(entry)
}
