import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/auth', //   http://localhost:8080/api/auth    |   https://api.smartmat.app/api/auth
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

//Fetches the token for the user with the given credentials
export async function fetchToken(credentials) {
  try {
    const response = await apiClient.post('/credentials', credentials)
    return response
  } catch (error) {
    throw error
  }
}
