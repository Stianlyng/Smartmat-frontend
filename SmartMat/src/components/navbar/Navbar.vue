<script setup>
import '@/assets/css/navbar.scss'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const scrolledNav = ref(null)
const mobile = ref(null)
const mobileNav = ref(null)
const windowWidth = ref(null)

//Toggle mobile nav
const toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value
}

//Update scroll
const updateScroll = () => {
  const scrollPosition = window.scrollY
  if (scrollPosition > 80) {
    scrolledNav.value = true
    return
  }
  scrolledNav.value = false
}

//Check screen size
const checkScreen = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value <= 750) {
    mobile.value = true
    return
  }
  mobile.value = false
  mobileNav.value = false
  return
}

watch(windowWidth, checkScreen)

//Add event listeners
onMounted(() => {
  window.addEventListener('resize', checkScreen)
  checkScreen()
  window.addEventListener('scroll', updateScroll)
})

//Remove event listeners
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
  window.removeEventListener('scroll', updateScroll)
})

//when the user clicks anywhere outside of the dropdown, close it
window.onclick = function (event) {
  if (mobileNav.value) {
    if (!event.target.matches('.fa-bars') && !event.target.matches('.dropdown-nav')) {
      mobileNav.value = false
    }
  }
}
</script>
<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    />
    <nav>
      <div class="branding">
        <router-link :to="{ name: 'home' }">
          <img src="@/assets/img/SmartMat_logo_transparent.png" alt="" />
        </router-link>
      </div>
      <ul v-show="!mobile" class="navigation">
        <li>
          <a class="link" href="/">Hjem</a>
        </li>
        <li>
          <router-link class="link" :to="{ name: 'login' }">Logg inn</router-link>
        </li>
      </ul>
      <div class="icon">
        <i
          @click="toggleMobileNav"
          v-show="mobile"
          class="fa fa-bars"
          :class="{ 'icon-active': mobileNav }"
        ></i>
      </div>
      <transition name="mobile-nav"></transition>
      <ul v-show="mobileNav" class="dropdown-nav">
        <div class="branding">
          <router-link :to="{ name: 'home' }">
            <img src="@/assets/img/SmartMat_logo_transparent.png" alt="" />
          </router-link>
        </div>
        <li>
          <a class="link" href="/">Hjem</a>
        </li>
        <li>
          <router-link class="link" :to="{ name: 'login' }">Logg inn</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
