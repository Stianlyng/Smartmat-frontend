<script setup>
import '@/assets/css/list/shopping-list.css'
import { ref, onMounted, toRaw, computed } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import ProductSearch from '../scanner/ProductSearch.vue'
import {
  fetchShoppingListByGroupID,
  addProductToShoppingList,
  deleteProductFromShoppingList
} from '@/services/smartmatApi/ShoppingListService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { convertShoppingListProducts } from '@/utils/ProductConverter'
import { eanFetchProduct } from '@/services/externalApi/ProductService.js'
import { addToProducts } from '@/services/smartmatApi/ProductService.js'
import ScannerProduct from '@/components/scanner/ScannerProduct.vue'
import { useRouter } from 'vue-router'
import InfoButton from '@/components/InfoButton.vue'

const router = useRouter()

const search = ref('')
let products = ref([])
let shoppingListId = ref(null)

const eanScan = ref(0)

onMounted(async () => {
  await fetchShoppingList()
})

//Fetches the shopping list
async function fetchShoppingList() {
  const groupId = useGroupStore().getGroupID
  try {
    const response = await fetchShoppingListByGroupID(groupId)

    shoppingListId.value = response.data.shoppingListID
    products.value = convertShoppingListProducts(response.data)
  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      throwErrorPopup('Fant ikke handlelisten')
    } else {
      throwErrorPopup('Kunne ikke hente handlelisten')
    }
  }
}

//Filters the products by search
let filteredProducts = computed(() => {
  if (!search.value) {
    return products.value
  } else {
    return products.value.filter((product) =>
      product.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }
})

const searchProduct = ref(false)

//Removes the product from the shopping list
const removeProduct = async (product) => {
  const productChosen = toRaw(product)
  const index = products.value.findIndex((prod) => prod.productId === productChosen.productId)
  if (index !== -1) {
    products.value.splice(index, 1)
  } else {
    throwErrorPopup('Kunne ikke fjerne produktet fra handlelisten')
  }
  try {
    const response = await deleteProductFromShoppingList(shoppingListId.value, productChosen.ean)
    console.log(response.data)
  } catch (error) {
    throwErrorPopup('Kunne ikke fjerne produktet fra handlelisten')
  }
}

//Accepts the product and adds it to the inventory
const acceptProduct = async (product) => {
  const productChosen = toRaw(product)

  const index = products.value.findIndex((prod) => prod.productId === productChosen.productId)

  if (index !== -1) {
    products.value.splice(index, 1)
  } else {
    throwErrorPopup('Kunne ikke fjerne produktet fra handlelisten')
  }

  eanScan.value = productChosen.ean + ''

  try {
    const response = await deleteProductFromShoppingList(shoppingListId.value, productChosen.ean)
    console.log(response.data)
  } catch (error) {
    throwErrorPopup('Kunne ikke fjerne produktet fra handlelisten')
  }
}

//Adds the product to the shopping list
async function foundProduct(ean) {
  searchProduct.value = false
  throwErrorPopup('La til produktet: ' + ean)

  try {
    const response = await eanFetchProduct(ean)
    let name = response.data.data.products[0].name
    let image = response.data.data.products[0].image

    const body = {
      ean: parseInt(ean),
      name: name,
      description: name,
      image: image,
      price: response.data.data.products[0].current_price.price
    }
    products.value.push(body)
    await addToProducts(body)
  } catch (error) {
    //If product already exists in database
    console.log('Product already exists in database')
  }

  try {
    console.log(shoppingListId.value)
    const response = await addProductToShoppingList(shoppingListId.value, ean)
    console.log(response.data)
    await fetchShoppingList()
  } catch (error) {
    throwErrorPopup('Kunne ikke legge til produktet i handlelisten')
  }
}

//Resets the scanner
function scannerDelete() {
  eanScan.value = 0
}
</script>

<template>
  <div class="shopping-list">
    <div class="search-bar" v-if="!searchProduct && products.length > 0">
      <input type="text" placeholder="Søk i handlelisten" v-model="search" />
    </div>
    <div class="add-product" v-if="!searchProduct && !useGroupStore().isRestricted">
      <button class="btn btn-primary" @click="searchProduct = true">Legg til et produkt</button>
      <InfoButton
        message="Legg til et produkt ved å trykke på knappen, så kan du søke etter produktet du ønsker å legge til."
      />
    </div>
    <div class="product-list" v-if="!searchProduct">
      <div
        class="product"
        :class="{ expired: product.daysLeft < 0, soon: product.daysLeft < 3 }"
        v-for="product in filteredProducts"
        :key="product.productId"
      >
        <div class="product-image">
          <img :src="product.image" />
        </div>
        <div class="product-info">
          <div class="product-name">
            {{ product.name }}
          </div>
        </div>
        <div class="product-action">
          <button class="btn btn-primary" @click="removeProduct(product)">
            <FontAwesomeIcon :icon="faTimes" />
          </button>
          <button class="btn btn-primary" @click="acceptProduct(product)">
            <FontAwesomeIcon :icon="faCheck" />
          </button>
        </div>
      </div>
    </div>
    <div class="empty-list" v-if="products.length === 0 && !searchProduct">
      <div class="empty-list-text">Det er ingen produkter registrert i handlelisten din.</div>
    </div>
    <ProductSearch v-if="searchProduct && eanScan <= 0" @foundProduct="foundProduct($event)" />
    <ScannerProduct
      v-if="eanScan > 0"
      :ean="eanScan"
      class="shopping-list-scanner-product"
      @scannerDelete="scannerDelete"
    />
  </div>
</template>

<style scoped>
.shopping-list-scanner-product {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
