import { Router } from 'express'
import { getPriceEntries, createPriceEntry } from '../controllers/priceController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', getPriceEntries)
router.post('/', protect, createPriceEntry)

export default router
