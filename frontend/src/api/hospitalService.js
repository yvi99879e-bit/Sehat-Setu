import axiosClient from './axiosClient'

export async function fetchHospitals({ city, search } = {}) {
  const { data } = await axiosClient.get('/hospitals', { params: { city, search } })
  return data
}

export async function fetchHospitalById(id) {
  const { data } = await axiosClient.get(`/hospitals/${id}`)
  return data
}

export async function fetchCities() {
  const { data } = await axiosClient.get('/hospitals/meta/cities')
  return data
}
