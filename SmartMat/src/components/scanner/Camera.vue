<script setup>
import '@/assets/css/scanner/camera.css'
import { ref, onMounted, watchEffect } from 'vue'
import Quagga from 'quagga'

const emit = defineEmits(['foundProduct'], stopCamera)

const video = ref(null)
const detectedText = ref('Scanning...')

let eanScans = []

//Get screen size
const width = window.innerWidth
const height = window.innerHeight

// Initialize Quagga
onMounted(() => {
  Quagga.init(
    {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: video.value,
        constraints: {
          width: width * 2,
          height: height * 2,
          facingMode: 'environment',
          aspectRatio: { exact: 0.5625 },
          orientation: 'portrait'
        }
      },
      decoder: {
        readers: ['ean_reader', 'ean_8_reader'],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true
        }
      },
      locate: true
    },
    function (err) {
      if (err) {
        console.log(err)
        return
      }
      console.log('Initialization finished. Ready to start')
      Quagga.start()
    }
  )
})

watchEffect(() => {
  Quagga.onDetected((data) => {
    console.log(data.codeResult.code)
    detectedText.value = data.codeResult.code
    eanScans.push(data.codeResult.code)
    checkScans()
  })
})

//Check if the user has scanned the same product at least 5 times
function checkScans() {
  let foundProduct = ''
  let foundProductCount = 0
  for (let i = 0; i < eanScans.length; i++) {
    let currentProduct = eanScans[i]
    let currentProductCount = 0
    for (let j = 0; j < eanScans.length; j++) {
      if (currentProduct == eanScans[j]) {
        currentProductCount++
      }
    }
    if (currentProductCount > foundProductCount) {
      foundProduct = currentProduct
      foundProductCount = currentProductCount
    }
  }
  if (foundProductCount >= 5) {
    console.log('Found product: ' + foundProduct)
    Quagga.stop()
    emit('foundProduct', foundProduct)
  }
}

//Stop camera
function stopCamera() {
  Quagga.stop()
}
</script>

<template>
  <div class="camera" ref="video">
    <video autoplay="true" width="100%" height="100%"></video>
  </div>
  <div class="camera-overlay"></div>
  <div class="detected-text">
    <p>{{ detectedText }}</p>
  </div>
</template>
