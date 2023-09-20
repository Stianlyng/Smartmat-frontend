import { defineStore } from 'pinia'
import { fetchToken } from '../services/smartmatApi/AuthService.js'
import { register, fetchUserAllergens } from '../services/smartmatApi/UserService.js'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'

//Stores the user's token and username
export const useUserStore = defineStore({
  id: 'UserStore',
  state: () => ({
    token: null,
    username: null,
    allergies: null
  }),
  persist: {
    // Persists the user token and username in the browser's session storage
    storage: sessionStorage
  },
  actions: {
    async setUserAllergens() {
      //Fetches the user's allergies
      try {
        let allergiesFetched = []
        const response = await fetchUserAllergens(this.username)
        //Mmaps all the allergies to a list
        response.map((allergy) => {
          allergiesFetched.push(allergy.name)
        })

        this.allergies = allergiesFetched
      } catch (error) {
        throw new Error('Kunne ikke hente allergier for bruker: ' + this.username)
      }
    },

    login(status, token, username) {
      //If the response is 200, the user is logged in
      if (status === 200) {
        this.token = token
        this.username = username
      } else {
        throw new Error('Brukernavn og/eller passord er matcher ingen registrerte brukere.')
      }
    },

    //Sends an api call to backend via post call which logs the user in
    async verifyLogin(username, password) {
      showLoadingPopup()
      try {
        const response = await fetchToken({
          username: username,
          password: password
        })

        this.login(response.status, response.data, username)
        await this.setUserAllergens()
      } catch (error) {
        hideLoadingPopup()
        throw error
      }
      hideLoadingPopup()
    },

    //Sends an api call to backend via post call which registers the user
    async registerUser(username, password, email, firstName, lastName, birthDate) {
      try {
        const response = await register({
          username: username,
          password: password,
          email: email,
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate
        })

        await this.verifyLogin(username, password)
      } catch (error) {
        throw error
      }
    },

    //Logs the current user out, and resets state to default
    logout() {
      this.token = null
      this.username = null
    }
  },
  getters: {
    //Returns true if the user is logged in, false otherwise
    loggedIn() {
      return this.token != null
    },

    //Gets the username of the current user
    getUsername() {
      return this.username
    },

    //Gets the token of the current user
    getToken() {
      return this.token
    },

    //Gets the allergies of the current user
    getAllergies() {
      return this.allergies
    }
  }
})
