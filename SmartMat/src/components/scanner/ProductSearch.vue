<script setup>
import '@/assets/css/scanner/product-search.css'
import { ref, watch, onMounted, toRaw } from 'vue'
import { fetchProducts, eanFetchProduct } from '@/services/externalApi/ProductService.js'
import { fetchInternalProductByName } from '@/services/smartmatApi/ProductService.js'
import { convertProducts } from '@/utils/ProductConverter.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'
import prods from '@/JSON/Products.json'

const emit = defineEmits(['foundProduct'])

//Emits the found product
function foundProduct(ean) {
  emit('foundProduct', ean)
}

const freshProducts = ref([])
const searchWord = ref('')
const products = ref([])
const currentId = ref(0)
const timeout = ref(null)

onMounted(async () => {
  freshProducts.value = prods.products
  freshProducts.value = toRaw(freshProducts.value)
})

watch(searchWord, async () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }

  currentId.value++

  const thisId = currentId.value

  timeout.value = setTimeout(async () => {
    searchWord.value = searchWord.value.toLowerCase()
    if (freshProducts.value.includes(searchWord.value)) {
      try {
        const response = await fetchInternalProductByName(searchWord.value)
        products.value = [
          {
            name: response.data.name,
            image: response.data.url,
            ean: response.data.ean
          }
        ]
      } catch (error) {
        throwErrorPopup(error)
      }
    } else if (!isNaN(searchWord.value) && searchWord.value.length > 7) {
      try {
        //Searches for the product with the given EAN in the external API
        const response = await eanFetchProduct(searchWord.value)
        if (thisId === currentId.value) {
          products.value = [
            {
              name: response.data.data.products[0].name,
              image: response.data.data.products[0].image,
              ean: response.data.data.ean
            }
          ]
          if (products.value.length === 0) throw new Error('Fant ingen produkter med gitt EAN')
        }
      } catch (error) {
        throwErrorPopup(error)
      }
    } else {
      try {
        const response = await fetchProducts(searchWord.value)
        if (thisId === currentId.value) {
          products.value = convertProducts(response.data.data)
        }
        if (products.value.length === 0) throw new Error('Fant ingen produkter med gitt søkeord')
      } catch (error) {
        throwErrorPopup(error)
      }
    }
  }, 600)
})
</script>

<template>
  <div class="product-search">
    <div class="product-search-input">
      <input type="text" v-model="searchWord" placeholder="Søk på navn eller EAN" />
    </div>
    <div class="product-search-results">
      <div class="product-search-result" v-for="product in products" :key="product.ean">
        <div class="product-search-result-image">
          <img :src="product.image" />
        </div>
        <div class="product-search-result-info">
          <div class="product-search-result-name">{{ product.name }}</div>
          <div class="product-search-result-ean">{{ product.ean }}</div>
        </div>
        <div class="product-search-result-button">
          <button @click="foundProduct(product.ean)">Velg</button>
        </div>
      </div>
    </div>
  </div>
</template>
