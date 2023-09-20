<script setup>
import '@/assets/css/login/login.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useUserStore } from '@/stores/UserStore.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'

const userStore = useUserStore()
const router = useRouter()

const firstname = ref(null)
const lastname = ref(null)
const birthdate = ref(null)
const username = ref(null)
const email = ref(null)
const password = ref(null)
const confirmPassword = ref(null)

/**
 * Register a new user
 */
async function register() {
  if (!checkInputs()) return
  try {
    showLoadingPopup()
    await userStore.registerUser(
      username.value,
      password.value,
      email.value,
      firstname.value,
      lastname.value,
      birthdate.value
    )

    if (userStore.loggedIn) {
      hideLoadingPopup()
      throwErrorPopup('Du er nå registrert og logget inn')
      router.push('/setup')
    } else {
      hideLoadingPopup()
      throwErrorPopup('Et problem skjedde under registrering, vennligst prøv på nytt')
    }
  } catch (error) {
    hideLoadingPopup()
    if (error.response.status == 409) {
      throwErrorPopup('Brukernavnet eller e-posten er allerede i bruk')
      return
    }
    throwErrorPopup('Et problem skjedde under registrering, vennligst prøv på nytt')
  }
}

/**
 * Check if all inputs are filled out
 * Check if password is at least 8 characters and max 50 characters
 * Checks if password contains a number and a letter (upper or lower case)
 * Check if password and confirm password are the same
 * Check if email is valid
 */
function checkInputs() {
  if (
    firstname.value == null ||
    lastname.value == null ||
    birthdate.value == null ||
    username.value == null ||
    email.value == null ||
    password.value == null ||
    confirmPassword.value == null
  ) {
    throwErrorPopup('Vennligst fyll ut alle feltene')
    return false
  }

  //Check if birthdate is in the future
  if (new Date(birthdate.value) > new Date()) {
    throwErrorPopup('Fødselsdatoen kan ikke være i fremtiden')
    return false
  }

  if (password.value.length < 8) {
    throwErrorPopup('Passordet må være minst 8 tegn')
    return false
  }

  if (password.value.length > 50) {
    throwErrorPopup('Passordet kan ikke være mer enn 50 tegn')
    return false
  }

  if (username.value.length > 50) {
    throwErrorPopup('Brukernavnet kan ikke være mer enn 50 tegn')
    return false
  }

  //Check if password contains a number and a letter (upper or lower case)
  let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!re.test(password.value)) {
    throwErrorPopup('Passordet må inneholde minst en bokstav og et tall')
    return false
  }

  if (password.value != confirmPassword.value) {
    throwErrorPopup('Passordene er ikke like')
    return false
  }

  //Chek if email is valid
  if (!validateEmail(email.value)) {
    throwErrorPopup('E-posten er ikke gyldig')
    return false
  }

  return true
}

/**
 * Check if email is valid
 * @param {*} email
 */
function validateEmail(email) {
  let re = /\S+@\S+\.\S+/
  return re.test(email)
}
</script>

<template>
  <div class="login register">
    <div class="login-container">
      <h1>Opprett ny bruker</h1>
      <form @submit.prevent="register">
        <div class="row-inputs">
          <div class="first-name">
            <label for="first-name">Fornavn</label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              placeholder="Fornavn"
              v-model="firstname"
            />
          </div>
          <div class="last-name">
            <label for="last-name">Etternavn</label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              placeholder="Etternavn"
              v-model="lastname"
            />
          </div>
        </div>
        <div class="date-picker">
          <label for="date-picker">Fødselsdato</label>
          <input type="date" id="date-picker" name="date-picker" v-model="birthdate" />
        </div>
        <div class="row-inputs">
          <div class="username">
            <label for="username">Brukernavn</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Brukernavn"
              v-model="username"
            />
          </div>
          <div class="email">
            <label for="email">E-post</label>
            <input type="email" id="email" name="email" placeholder="E-post" v-model="email" />
          </div>
        </div>
        <div class="row-inputs">
          <div class="password">
            <label for="password">Passord</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Passord"
              v-model="password"
            />
          </div>
          <div class="confirm-password">
            <label for="confirm-password">Bekreft passord</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Bekreft passord"
              v-model="confirmPassword"
            />
          </div>
        </div>
        <button type="submit">Registrer ny bruker</button>
        <p class="terms-notice">
          Ved å registrere deg godtar du våre <a href="#">vilkår og betingelser</a>
        </p>
      </form>
      <div class="links">
        <router-link to="/login">Har du allerede en bruker?</router-link>
        <router-link to="/forgot-password">Glemt passord?</router-link>
      </div>
    </div>
  </div>
</template>
