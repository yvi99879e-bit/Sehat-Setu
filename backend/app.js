import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/authRoutes.js'
import hospitalRoutes from './routes/hospitalRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import priceRoutes from './routes/priceRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.json({ status: 'ok', service: 'hospital-compare-backend' }))

app.use('/api/auth', authRoutes)
app.use('/api/hospitals', hospitalRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/prices', priceRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
