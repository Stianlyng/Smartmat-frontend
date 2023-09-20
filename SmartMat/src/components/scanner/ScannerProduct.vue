<script setup>
import '@/assets/css/scanner/scanner-product.css'
import { ref, onMounted, computed } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController'
import { fetchInternalProductByEAN, addToProducts } from '@/services/smartmatApi/ProductService.js'
import { eanFetchProduct } from '@/services/externalApi/ProductService.js'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import { useGroupStore } from '@/stores/GroupStore.js'
import { addProductToFridge } from '@/services/smartmatApi/FridgeService.js'
import { useRouter } from 'vue-router'

const emit = defineEmits(['scannerDelete'])
const router = useRouter()
const eanSet = ref('')
const name = ref('')
const price = ref('')
const image = ref('')
const unit = ref('')
const isLoading = ref(true)

// Fetches the product data from the database or external api
const fetchProductData = async (ean) => {
  let prodUnit = 'stk'
  try {
    showLoadingPopup()
    const response = await fetchInternalProductByEAN(ean)

    if (response.data.unit) prodUnit = response.data.unit

    eanSet.value = response.data.ean
    name.value = response.data.name
    image.value = response.data.url
    expiration.value = response.data.expirationDate
    unit.value = prodUnit
    isLoading.value = false
  } catch (error) {
    try {
      let allergens = []
      let allergensList = []

      const response = await eanFetchProduct(ean)
      console.log(response)

      eanSet.value = response.data.data.ean
      name.value = response.data.data.products[0].name
      image.value = response.data.data.products[0].image
      allergens = response.data.data.allergens
      unit.value = 'stk'
      price.value = response.data.data.products[0].current_price.price

      isLoading.value = false

      for (let i = 0; i < allergens.length; i++) {
        allergensList.push(allergens[i].display_name)
        console.log(allergens[i].display_name)
      }
      console.log(allergensList)

      const body = {
        ean: parseInt(eanSet.value),
        name: name.value,
        description: name.value,
        image: image.value,
        price: response.data.data.products[0].current_price.price,
        allergies: allergensList
      }
      console.log(body)
      const response2 = await addToProducts(body)
    } catch (error) {
      throwErrorPopup('Kunne ikke finne produktet med ean')
      hideLoadingPopup()
    }
  }
  hideLoadingPopup()
}

// Test product
const testProduct = computed(() => ({
  name: name.value,
  image: image.value,
  unit: unit.value
}))

console.log(testProduct)

const amount = ref(1)
const expiration = ref(12)
const props = defineProps({
  ean: {
    type: String,
    required: true
  }
})

onMounted(async () => {
  await fetchProductData(props.ean)
})

// Adds amount to the product
function addAmount() {
  amount.value++
}

// Removes amount from the product
function removeAmount() {
  if (amount.value > 1) {
    amount.value--
  }
}

// Adds the product to the fridge
async function addProduct() {
  //Check if amount is more than 0
  if (amount.value < 1) {
    throwErrorPopup('Du må legge til minst 1 produkt')
    return
  }

  //Check if both amount and expiration are numbers¨
  if (isNaN(amount.value) || isNaN(expiration.value)) {
    throwErrorPopup('Antall og holdbarhet må være tall')
    return
  }

  const currentProduct = {
    groupId: useGroupStore().getGroupID,
    ean: props.ean,
    amount: amount.value,
    days: expiration.value,
    price: price.value
  }

  console.log(currentProduct)
  try {
    const response = await addProductToFridge(currentProduct)
    console.log(response)
    throwErrorPopup('La til produkt i kjøleskapet')
    router.push('/list')
    selfDelete()
  } catch (error) {
    throwErrorPopup('Kunne ikke legge til produkt i kjøleskapet')
  }
  router.push('/list')
}

// Emits an event to delete the scanner product
function selfDelete() {
  emit('scannerDelete')
}
</script>

<template>
  <div v-if="!isLoading" class="scanner-product">
    <div class="product-image">
      <img :src="testProduct.image" />
    </div>
    <div class="product-info">
      <h1>{{ testProduct.name }}</h1>
      <p>{{ props.ean }}</p>
    </div>
    <p class="label">Holdbarhet</p>
    <div class="product-amount">
      <button class="amount-button" @click="expiration--">-</button>
      <input type="tel" class="amount-input" v-model="expiration" length="2" />
      <p class="amount-unit">dager</p>
      <button class="amount-button" @click="expiration++">+</button>
    </div>
    <p class="label">Antall</p>
    <div class="product-amount">
      <button class="amount-button" @click="removeAmount">-</button>
      <input type="tel" class="amount-input" v-model="amount" length="2" />
      <p class="amount-unit">stk</p>
      <button class="amount-button" @click="addAmount">+</button>
    </div>
    <div class="product-buttons">
      <button class="product-button" @click="addProduct">Legg til i kjøleskapet</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
