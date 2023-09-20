<script setup>
import '@/assets/css/nav-footer.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUser,
  faBarcode,
  faListNumeric,
  faCalendar
} from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="nav-footer">
    <router-link to="/">
      <font-awesome-icon :icon="faHome" />
      Hjem
    </router-link>
    <router-link to="/list">
      <font-awesome-icon :icon="faListNumeric" />
      Lister
    </router-link>
    <router-link to="/scan">
      <font-awesome-icon :icon="faBarcode" />
      Legg til
    </router-link>
    <router-link to="/plan">
      <font-awesome-icon :icon="faCalendar" />
      Ukeplan
    </router-link>
    <router-link to="/profile">
      <font-awesome-icon :icon="faUser" />
      Profil
    </router-link>
  </div>
</template>
