<script setup>
import Camera from './Camera.vue'
import ScannerProduct from './ScannerProduct.vue'
import ProductSearch from './ProductSearch.vue'
import '@/assets/css/scanner/scanner.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

const eanScan = ref(0)

// Sets the eanScan value to the ean of the found product
function foundProduct(ean) {
  eanScan.value = ean
}
</script>

<template>
  <div class="scanner">
    <router-link to="/" class="back-button">
      <font-awesome-icon :icon="faArrowLeft" />
    </router-link>
    <Camera @foundProduct="foundProduct($event)" v-if="eanScan == 0" />
    <button v-if="eanScan == 0" class="manual-button" @click="eanScan = -1">Søk manuelt</button>
    <ProductSearch v-if="eanScan == -1" @foundProduct="foundProduct($event)" />
    <ScannerProduct v-if="eanScan > 0" :ean="eanScan" />
  </div>
</template>
