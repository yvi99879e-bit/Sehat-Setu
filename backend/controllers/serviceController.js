import Service from '../models/Service.js'

export async function getServices(req, res) {
  res.json(await Service.findAll())
}
