import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' })
  }

  try {
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }
    req.user = { id: user.id, name: user.name, email: user.email, city: user.city }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' })
  }
}
