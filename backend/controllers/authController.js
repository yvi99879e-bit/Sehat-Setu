import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, city: user.city }
}

export async function register(req, res) {
  const { name, email, password, city } = req.body

  if (!name || !email || !password || !city) {
    return res.status(400).json({ message: 'Name, email, password, and city are all required.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const existing = await User.findByEmail(email)
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, city })
  const token = signToken({ id: user.id })

  res.status(201).json({ user: toPublicUser(user), token })
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password.' })
  }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    return res.status(401).json({ message: 'Incorrect email or password.' })
  }

  const token = signToken({ id: user.id })
  res.json({ user: toPublicUser(user), token })
}

export async function me(req, res) {
  res.json({ user: req.user })
}
