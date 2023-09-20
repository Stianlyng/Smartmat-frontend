<script setup>
import '@/assets/css/login/login.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useUserStore } from '@/stores/UserStore.js'
import { useGroupStore } from '@/stores/GroupStore.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const groupStore = useGroupStore()

const username = ref(null)
const password = ref(null)

//Logs the user in
async function login() {
  if (!checkInputs()) return
  try {
    //Logs the user in and saved the info in session storage
    await userStore.verifyLogin(username.value, password.value)
    if (userStore.loggedIn) {
      throwErrorPopup('Logget inn bruker: ' + username.value)
      router.push('/')
      //Sets the user group to the user's group
      await groupStore.setUserGroup(userStore.username)
    } else {
      throwErrorPopup('Et problem skjedde under login, vennligst prøv på nytt')
    }
  } catch (error) {
    if (error.response.status == 401) {
      throwErrorPopup('Feil brukernavn eller passord')
    } else {
      throwErrorPopup(error)
    }
  }
}

//Checks if the inputs are valid
function checkInputs() {
  if (username.value == null || password.value == null) {
    throwErrorPopup('Vennligst fyll ut alle feltene')
    return false
  }
  return true
}
</script>

<template>
  <div class="login">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="username">Brukernavn</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Brukernavn"
          v-model="username"
        />
        <label for="password">Passord</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Passord"
          v-model="password"
        />
        <button type="submit">Login</button>
      </form>
      <div class="links">
        <router-link to="/register">Ny bruker?</router-link>
      </div>
    </div>
  </div>
</template>
