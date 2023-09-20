import axios from 'axios'
import { useUserStore } from '../../stores/UserStore.js'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/user', //   http://localhost:8080/api/user    |   https://api.smartmat.app/api/user
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

//Registers the user with the given information
export async function register(information) {
  try {
    const response = await apiClient.post('/register', information)
    return response
  } catch (error) {
    throw error
  }
}

//Fetches the group for the user with the given username
export async function fetchGroup(username) {
  try {
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
    const response = await apiClient.get('/get/' + username, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data.group
  } catch (error) {
    throw new Error('Kunne ikke finne gruppen til bruker: ' + username + ' Feilmelding: ' + error)
  }
}

//Verifies the token for the user with the given username
export async function verifyToken(username) {
  try {
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
    await apiClient.get('/get/' + username, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return
  } catch (error) {
    throw error
  }
}

//Fetches the allergens for the user with the given username
export async function fetchUserAllergens(username) {
  try {
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
    const response = await apiClient.get('/get/' + username, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data.allergies
  } catch (error) {
    throw new Error('Kunne ikke finne gruppen til bruker: ' + username + ' Feilmelding: ' + error)
  }
}

//Adds an allergy to the user with the given username
export async function addUserAllergy(body) {
  try {
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
    const response = await apiClient.post('/addAllergy', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    throw new Error('Kunne ikke legge til allergi til bruker: ' + body.username)
  }
}

//Removes an allergy from the user with the given username
export async function deleteUserAllergy(body) {
  try {
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
    const response = await apiClient.delete('/deleteAllergy', {
      data: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    throw new Error('Kunne ikke fjerne allergi for bruker: ' + body.username)
  }
}

//Change user settings for the user with the given username
export async function changeUserSettings(body) {
  try {
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
    const response = await apiClient.put('/update/' + useUserStore().getUsername, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    throw new Error('Kunne ikke endre innstillinger for bruker: ' + body.username)
  }
}
