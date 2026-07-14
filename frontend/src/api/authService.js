import axiosClient from './axiosClient'

export async function registerUser({ name, email, password, city }) {
  const { data } = await axiosClient.post('/auth/register', { name, email, password, city })
  return storeSession(data)
}

export async function loginUser({ email, password }) {
  const { data } = await axiosClient.post('/auth/login', { email, password })
  return storeSession(data)
}

function storeSession({ user, token }) {
  localStorage.setItem('hc_token', token)
  localStorage.setItem('hc_user', JSON.stringify(user))
  return { user, token }
}

export function logoutUser() {
  localStorage.removeItem('hc_token')
  localStorage.removeItem('hc_user')
}

export function getStoredSession() {
  const token = localStorage.getItem('hc_token')
  const rawUser = localStorage.getItem('hc_user')
  if (!token || !rawUser) return null
  try {
    return { token, user: JSON.parse(rawUser) }
  } catch {
    return null
  }
}
