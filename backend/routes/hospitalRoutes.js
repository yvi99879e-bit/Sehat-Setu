import { Router } from 'express'
import { getHospitals, getHospitalById, getCities } from '../controllers/hospitalController.js'

const router = Router()

router.get('/', getHospitals)
router.get('/meta/cities', getCities)
router.get('/:id', getHospitalById)

export default router
