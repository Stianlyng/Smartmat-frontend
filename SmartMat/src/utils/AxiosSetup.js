import axios from 'axios'
import { useUserStore } from '../stores/UserStore.js'
import router from '../router'

//Utility method for creating an axios instance with the given endpointURL and headers
function createAxiosClient(endpointURL, includeToken = true) {
  const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/' + endpointURL, //   http://localhost:8080/api/    |   https://api.smartmat.app/api/  <-- for development
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  //Intercepts the request and adds the logged in user's token to the request if includeToken is true
  if (includeToken) {
    apiClient.interceptors.request.use(
      (config) => {
        try {
          const userStore = sessionStorage.getItem('UserStore')
          if (userStore) {
            const parsedUserStore = JSON.parse(userStore)
            const token = parsedUserStore.token

            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          }
        } catch (error) {
          console.error('Error parsing UserStore from sessionStorage', error)
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  //Intercepts the response and logs the user out if the response is a 401 Unauthorized error
  apiClient.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        useUserStore().logout()
        router.push('/login')
      }

      return Promise.reject(error)
    }
  )

  return apiClient
}

export { createAxiosClient }
