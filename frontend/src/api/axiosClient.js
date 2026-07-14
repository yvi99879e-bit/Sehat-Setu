import axios from 'axios'

// Points at the real Node/Express + MySQL backend (see hospital-compare-backend-mysql).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the auth token (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize error messages so components can just read err.message
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject({ ...error, message })
  }
)

export default axiosClient
