<script setup>
import '@/assets/css/settings.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useUserStore } from '@/stores/UserStore.js'
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { changeUserSettings } from '@/services/smartmatApi/UserService.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')

// Saves changes to user settings
async function saveChanges() {
  if (email.value !== confirmEmail.value) {
    throwErrorPopup('E-postene er ikke like')
    return
  }
  if (password.value !== confirmPassword.value) {
    throwErrorPopup('Passordene er ikke like')
    return
  }

  if (email.value === '' && password.value === '') {
    throwErrorPopup('Du må fylle inn minst ett felt')
    return
  }

  if (email.value !== '' && !isValidEmail(email.value)) {
    throwErrorPopup('E-posten er ikke gyldig')
    return
  }

  if (password.value !== '' && password.value.length < 8) {
    throwErrorPopup('Passordet må være minst 8 tegn')
    return
  }

  //Check if password contains at least one number and one letter
  if (password.value !== '' && !/\d/.test(password.value)) {
    throwErrorPopup('Passordet må inneholde minst ett tall')
    return
  }

  if (password.value !== '' && !/[a-zA-Z]/.test(password.value)) {
    throwErrorPopup('Passordet må inneholde minst en bokstav')
    return
  }

  try {
    await changeUserSettings({
      email: email.value,
      password: password.value
    })
    throwErrorPopup('Endringer lagret')
    router.push('/profile')
  } catch (error) {
    console.log(error)
    throwErrorPopup('Kunne ikke lagre endringer')
  }
}

// Checks if email is valid
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>

<template>
  <div class="settings">
    <router-link to="/profile" class="back-button">
      <font-awesome-icon :icon="faArrowLeft" />
    </router-link>
    <div class="settings-container">
      <h1>Profil</h1>
      <h2>Fyll inn feltene du ønsker å endre</h2>
      <div class="text-row-inputs">
        <div class="change-email">
          <label for="change-email">Ny e-post: </label>
          <input
            type="email"
            id="change-email"
            name="change-email"
            placeholder="Ny e-post"
            v-model="email"
          />
        </div>
        <div class="change-email-confirm">
          <label for="change-email-confirm">Bekreft e-post: </label>
          <input
            type="email"
            id="change-email-confirm"
            name="change-email"
            placeholder="Gjenta e-post"
            v-model="confirmEmail"
          />
        </div>
        <div class="change-password">
          <label for="change-password">Nytt passord: </label>
          <input
            type="password"
            name="change-password"
            id="change-password"
            placeholder="Nytt passord"
            v-model="password"
          />
        </div>
        <div class="change-password-confirm">
          <label for="change-password-confirm">Bekreft passord: </label>
          <input
            type="password"
            name="change-password-confirm"
            id="change-password-confirm"
            placeholder="Gjenta passord"
            v-model="confirmPassword"
          />
        </div>
      </div>
      <div>
        <button class="save-button" @click="saveChanges">Lagre endringer</button>
      </div>
    </div>
  </div>
</template>
