<script setup>
import '@/assets/css/settings.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useUserStore } from '@/stores/UserStore.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import router from '@/router/index.js'
</script>

<script>
const userStore = useUserStore()

export default {
  methods: {
    async logout() {
      if (confirm('Er du sikker på at du vil logge ut?')) {
        try {
          // Sends a request to log out the user
          await userStore.logout()
          // Redirects the user to the login page
          router.push('/login')
          throwErrorPopup('Logget ut')
        } catch (error) {
          throwErrorPopup('Kunne ikke logge ut')
          console.error('Logout failed:', error)
        }
      }
    }
  }
}
</script>

<template>
  <div class="settings">
    <router-link to="/" class="back-button">
      <font-awesome-icon :icon="faArrowLeft" />
    </router-link>
    <div class="settings-container">
      <h1>Profil</h1>
      <h2>Velkommen, {{ userStore.getUsername }}!</h2>
      <router-link to="/profile/profile"
        ><button class="profile-settings-button">Profil</button></router-link
      >
      <router-link to="/profile/groups"
        ><button class="group-settings-button">Grupper</button></router-link
      >
      <router-link to="/profile/allergens"
        ><button class="allergens-settings-button">Allergener</button></router-link
      >

      <button class="logout-button" @click="logout">Logg ut</button>
    </div>
  </div>
</template>
