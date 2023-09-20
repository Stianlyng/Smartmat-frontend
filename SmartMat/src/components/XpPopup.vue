<script setup>
import '@/assets/css/xpPopup.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

// Delete the error popup after 10 seconds
setTimeout(() => {
  deleteSelf()
}, 6000)

//Deletes the error popup from the DOM
function deleteSelf() {
  const xpPopup = document.querySelector('.xp-popup')
  xpPopup.remove()
}
</script>

<template>
  <div class="xp-popup">
    <div class="xp-popup-content">
      <div class="xp-popup-message">
        <font-awesome-icon :icon="faStar" />
      </div>
    </div>
  </div>
</template>
