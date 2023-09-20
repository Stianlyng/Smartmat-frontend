<script setup>
import '@/assets/css/list/inventory-list.css'
import SuggestedRecipeSlider from '../recipe/SuggestedRecipeSlider.vue'
import { ref, onMounted, computed } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController'
import {
  fetchFridgeByGroupID,
  removeFridgeProductByID,
  addFridgeProductToWaste
} from '@/services/smartmatApi/FridgeService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { convertFridgeProducts } from '@/utils/ProductConverter'
import { useUserStore } from '@/stores/UserStore'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashAlt, faUtensils, faWarning } from '@fortawesome/free-solid-svg-icons'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
import { throwXpPopup } from '@/utils/XpController'
import { useRouter } from 'vue-router'
import InfoButton from '../InfoButton.vue'

const router = useRouter()

const search = ref('')
const selectedProductId = ref(null)
const confirmThrashing = ref(false)
const confirmEating = ref(false)
const eatingAmount = ref(1)

const sliderOptions = {
  min: 0,
  step: 0.25,
  tooltipPosition: 'top',
  tooltip: 'always',
  hideLimitLabels: true,
  hidePointerLabels: true
}

//Gets the allergies from the user
let allergies = computed(() => {
  return useUserStore().getAllergies
})

//Fetches the fridge products
onMounted(fetchProducts)

//Converts the products to a format that is easier to use
async function fetchProducts() {
  showLoadingPopup()
  const groupId = useGroupStore().getGroupID
  try {
    const response = await fetchFridgeByGroupID(groupId)
    console.log(response.data)
    console.log(convertFridgeProducts(response.data))
    products.value = convertFridgeProducts(response.data)
    hideLoadingPopup()
  } catch (error) {
    console.log(error)
    hideLoadingPopup()
  }
  hideLoadingPopup()
}

//Removes the product from the fridge and adds it to the waste
async function removeProduct() {
  try {
    const response = await addFridgeProductToWaste(selectedProductId.value)
    if (response.status != 200) {
      throwErrorPopup('Kunne ikke fjerne produktet')
      return
    } else {
      throwXpPopup()
      throwErrorPopup('Kastet produkt')
      await fetchProducts()
    }
  } catch (error) {
    throwErrorPopup('Kunne ikke fjerne produktet')
  }
  confirmThrashing.value = false
}

//Simulates that the product is eaten by removing it from the fridge
async function eatProduct() {
  try {
    const response = await removeFridgeProductByID(selectedProductId.value, eatingAmount.value)
    if (response.status != 200) {
      throwErrorPopup('Kunne ikke fjerne produktet')
      return
    } else {
      throwXpPopup()
      throwErrorPopup('Spiste produkt')
      await fetchProducts()
    }
  } catch (error) {
    throwErrorPopup('Kunne ikke fjerne produktet')
  }
  confirmEating.value = false
}
let products = ref([])

//Sorts the products by days left
let sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.remainingDays - b.remainingDays)
})

//Filters the products by search
let filteredProducts = computed(() => {
  if (!search.value) {
    return sortedProducts.value
  } else {
    return sortedProducts.value.filter((product) =>
      product.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }
})

//Filters the products by allergies
const isAllergicTo = (product) => {
  let prodAllergies = product.allergies
  if (prodAllergies == null) {
    return false
  }
  prodAllergies = prodAllergies.map((allergy) => allergy.name)
  if (prodAllergies.some((allergy) => allergies.value.includes(allergy)))
    console.log(prodAllergies.some((allergy) => allergies.value.includes(allergy)))

  return prodAllergies.some((allergy) => allergies.value.includes(allergy))
}

//Opens the trash confirm popup
function openThrashConfirm(productId) {
  selectedProductId.value = productId
  confirmThrashing.value = true
}

//Opens the eat confirm popup
function openEatConfirm(productId) {
  selectedProductId.value = productId
  confirmEating.value = true
}
</script>

<template>
  <SuggestedRecipeSlider />
  <div class="confirm-popup" v-if="confirmThrashing">
    <div class="confirm-popup-content">
      <div class="confirm-popup-text">Er du sikker på at du vil kaste produktet?</div>
      <div class="confirm-popup-buttons">
        <button class="btn btn-primary" @click="confirmThrashing = false">Nei</button>
        <button class="btn btn-primary" @click="removeProduct()">Ja</button>
      </div>
    </div>
  </div>
  <div class="confirm-popup" v-if="confirmEating">
    <div class="confirm-popup-content">
      <div class="confirm-popup-text">Hvor mye av produktet spiste du?</div>
      <div class="confirm-popup-slider">
        <Slider
          v-model="eatingAmount"
          v-bind="sliderOptions"
          :format="(value) => `${value} stk`"
          :max="products.find((product) => product.productId == selectedProductId)?.amount || 0"
        />
      </div>
      <div class="confirm-popup-buttons">
        <button class="btn btn-primary" @click="confirmEating = false">Nei</button>
        <button class="btn btn-primary" @click="eatProduct()">Ja</button>
      </div>
    </div>
  </div>
  <div class="inventory-list">
    <div class="search-bar">
      <input type="text" placeholder="Søk i kjøleskapet" v-model="search" />
      <InfoButton
        message="Her kan du se hva som er i kjøleskapet ditt. Du kan kaste produktene ved å trykke på søppelbøtten, eller spise dem ved å trykke på bestikkikonet. Du kan også se hvor mange dager det er igjen til produktene går ut på dato."
      />
    </div>
    <div class="product-list">
      <div
        class="product"
        :class="{ expired: product.remainingDays < 0, soon: product.remainingDays < 3 }"
        v-for="product in filteredProducts"
        :key="product.productId"
      >
        <div class="product-image">
          <img :src="product.image" />
        </div>
        <div class="product-info">
          <div class="product-name">{{ product.name }} ({{ product.amount }}stk)</div>
          <div class="product-days-left">{{ product.remainingDays }} dager igjen</div>
          <span v-if="isAllergicTo(product)" class="allergy">
            <FontAwesomeIcon :icon="faWarning" alt="Allergi" class="allergy-icon" />
            <p class="allergy-text">Kan inneholde allergener</p>
          </span>
        </div>
        <div class="product-action">
          <button class="btn btn-primary" @click="openEatConfirm(product.productId)">
            <FontAwesomeIcon :icon="faUtensils" alt="Spis produkt" />
          </button>
          <button
            class="btn btn-primary"
            @click="openThrashConfirm(product.productId)"
            v-if="!useGroupStore().isRestricted"
          >
            <FontAwesomeIcon :icon="faTrashAlt" alt="Fjern produkt" />
          </button>
        </div>
      </div>
    </div>
    <div class="empty-list" v-if="products.length === 0">
      <div class="empty-list-text">Det er ingen produkter registrert i lageret ditt.</div>
    </div>
  </div>
</template>
