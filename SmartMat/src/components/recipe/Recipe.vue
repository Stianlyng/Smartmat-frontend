<script setup>
import '@/assets/css/recipe/recipe.css'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { throwErrorPopup } from '@/utils/ErrorController'
import { fetchRecipeByID } from '@/services/smartmatApi/RecipeService'
import { throwXpPopup } from '@/utils/XpController'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import {
  fetchFridgeByGroupID,
  removeFridgeProductByID,
  addFridgeProductToWaste
} from '@/services/smartmatApi/FridgeService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { convertFridgeProducts } from '@/utils/ProductConverter'
import {
  fetchShoppingListByGroupID,
  addProductToShoppingList,
  deleteProductFromShoppingList
} from '@/services/smartmatApi/ShoppingListService.js'
import { eanFetchProduct } from '@/services/externalApi/ProductService.js'
import InfoButton from '../InfoButton.vue'
import { addToProducts } from '@/services/smartmatApi/ProductService.js'

const router = useRouter()
const shoppingListId = ref(null)
const groupId = useGroupStore().getGroupID
const displayGuide = ref(false)
const ownsAllIngredients = ref(false)
const makingRecipe = ref(false)

const recipe = ref({})
const ownedProducts = ref([])
const recipeGuide = ref([])

// onmounted do fetchRecipeByID and set recipe
onMounted(async () => {
  showLoadingPopup()
  await fetchShoppingListID()
  await fetchRecipe()
  await fetchOwnedProducts()
  await matchOwnedProducts()
  checkIfOwnsAllIngredients()
  hideLoadingPopup()
})

//Fetches the shopping list
async function fetchShoppingListID() {
  try {
    const response = await fetchShoppingListByGroupID(groupId)

    shoppingListId.value = response.data.shoppingListID
  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      throwErrorPopup('Fant ikke handlelisten')
    } else {
      throwErrorPopup('Kunne ikke hente handlelisten')
    }
  }
}

// fetch recipe
async function fetchRecipe() {
  const recipeID = router.currentRoute.value.params.id
  const recipeResponse = await fetchRecipeByID(recipeID)
  recipe.value = recipeResponse.data

  for (let i = 0; i < recipe.value.products.length; i++) {
    const product = recipe.value.products[i]
    product.showProducts = false
    product.matchingProduct = null
    product.matchingProductID = null

    if (product.unit == 'STK') {
      product.unit = 'stk'
    }
  }

  console.log(recipe.value.products)

  const recipeGuideUnfiltered = recipe.value.guide

  // Split the recipe guide at every :: and remove empty strings
  const recipeGuideFiltered = recipeGuideUnfiltered.split('::').filter((item) => item)

  // Split the recipe guide at every \n and remove empty strings
  recipeGuide.value = recipeGuideFiltered.map((item) => item.split('\n').filter((item) => item))
}

// fetch owned products
async function fetchOwnedProducts() {
  const groupId = useGroupStore().getGroupID
  try {
    const response = await fetchFridgeByGroupID(groupId)
    //console.log(response.data);
    //console.log(convertFridgeProducts(response.data));
    ownedProducts.value = convertFridgeProducts(response.data)
  } catch (error) {
    throwErrorPopup('Kunne ikke hente innholdet i kjøleskapet')
    console.log(error)
  }
}

// match owned products with recipe products
async function matchOwnedProducts() {
  for (const product of recipe.value.products) {
    for (const ownedProduct of ownedProducts.value) {
      if (ownedProduct.name.toLowerCase().includes(product.name.toLowerCase())) {
        product.owns = true
        product.matchingProduct = ownedProduct.name
        product.matchingProductID = ownedProduct.productId
        break
      }
    }
  }
}

// Select matching product
function selectMatchingProduct(product, matchingProduct) {
  product.matchingProduct = matchingProduct.name
  product.matchingProductID = matchingProduct.productId
  product.showProducts = false
  checkIfOwnsAllIngredients()
}

// Remove matching product
function clearMatchingProduct(product) {
  product.matchingProduct = null
  product.matchingProductID = null
  product.showProducts = false
  checkIfOwnsAllIngredients()
}

// Check if all ingredients are owned
function checkIfOwnsAllIngredients() {
  ownsAllIngredients.value = true
  for (const product of recipe.value.products) {
    if (product.matchingProduct == null) {
      ownsAllIngredients.value = false
      break
    }
  }
}

// Adds the ingredients to the shopping list
async function addRecipeToShoppingList() {
  showLoadingPopup()

  for (const product of recipe.value.products) {
    if (!product.owns) {
      try {
        await addToShoppingList(product.ean)
      } catch (error) {
        console.log(error)
        if (error.response.status === 404) {
          throwErrorPopup('Fant ikke handlelisten')
        } else {
          throwErrorPopup('Kunne ikke legge til produktet i handlelisten')
        }
      }
    }
  }
  hideLoadingPopup()
  throwXpPopup()
  router.push('/list')
}

// Adds one ingredient to the shopping list
async function addToShoppingList(ean) {
  //Add product to products
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

  //Add product to shopping list
  try {
    const response = await addProductToShoppingList(shoppingListId.value, ean) //TODO: ADD price to endpoint req body
  } catch (error) {
    throwErrorPopup('Kunne ikke legge til produktet i handlelisten')
  }
}

// Removes all ingredients from fridge and displays guide
async function makeRecipe() {
  showLoadingPopup()

  let productsToBeRemoved = []

  for (const product of recipe.value.products) {
    //If the user owns the product and its not already in productsToBeRemoved
    if (product.owns && !productsToBeRemoved.includes(product.matchingProductID)) {
      productsToBeRemoved.push(product.matchingProductID)
    }
  }

  console.log(productsToBeRemoved)

  for (const product of productsToBeRemoved) {
    try {
      const response = await removeFridgeProductByID(product, 1)
      if (response.status != 200) {
        throwErrorPopup('Kunne ikke fjerne produktet')
        return
      }
    } catch (error) {
      throwErrorPopup('Kunne ikke fjerne produktet')
    }
  }

  makingRecipe.value = true
  displayGuide.value = true
  hideLoadingPopup()
  throwErrorPopup('Alle ingrediensene er fjernet fra kjøleskapet')
  throwXpPopup()
}
</script>

<template>
  <div class="recipe">
    <div class="recipe-header">
      <h1 class="recipe-header-title">{{ recipe.name }}</h1>
      <img class="recipe-header-image" :src="recipe.imageUrl" alt="Bilde av retten" />
    </div>
    <div class="recipe-content">
      <div class="recipe-content-description">
        <p>{{ recipe.description }}</p>
      </div>
      <div class="recipe-content-ingredients" v-if="!makingRecipe">
        <h2 class="recipe-content-ingredients-title">
          Ingredienser (2 porsjoner)
          <InfoButton
            message="Her kan du se hvilke ingredienser du har i kjøleskapet ditt. Du kan også velge hvilke produkter du vil bruke til å lage retten. Hvis du ikke har alle ingrediensene kan du legge dem til i handlelisten din."
          />
        </h2>
        <ul class="recipe-content-ingredients-list">
          <li
            v-for="product in recipe.products"
            :key="product.id"
            class="recipe-content-ingredients-list-item"
            :class="{
              'recipe-content-ingredients-list-item-owns': product.owns,
              'matching-product-selector-active': product.showProducts
            }"
          >
            <div class="recipe-basics" @click="product.showProducts = !product.showProducts">
              <span class="recipe-content-ingredients-list-item-amount"
                >{{ product.amount }}{{ product.unit }}</span
              >
              <span class="recipe-content-ingredients-list-item-name">{{ product.name }}</span>
              <font-awesome-icon
                :icon="faCheck"
                class="recipe-content-ingredients-list-item-check"
                v-if="product.matchingProduct"
              />
            </div>
            <span
              class="recipe-content-ingredients-list-item-matching-product"
              v-if="product.matchingProduct"
              >({{ product.matchingProduct }})</span
            >
            <div class="matching-product-selector" v-if="product.showProducts">
              <div class="matching-product-selector-header">
                <h3 class="matching-product-selector-header-title">Velg produkt:</h3>
                <font-awesome-icon
                  :icon="faTimes"
                  class="matching-product-selector-header-close"
                  @click="product.showProducts = false"
                />
              </div>
              <ul class="matching-product-selector-list">
                <li
                  class="matching-product-selector-list-item"
                  @click="clearMatchingProduct(product)"
                >
                  <h4 class="matching-product-selector-list-item-name">Ingen</h4>
                </li>
                <li
                  v-for="ownedProduct in ownedProducts"
                  :key="ownedProduct.id"
                  class="matching-product-selector-list-item"
                  :class="{
                    'matching-product-selector-list-item-selected':
                      product.matchingProductID == ownedProduct.productId
                  }"
                  @click="selectMatchingProduct(product, ownedProduct)"
                >
                  <h4 class="matching-product-selector-list-item-name">{{ ownedProduct.name }}</h4>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="recipe-footer" v-if="!makingRecipe">
      <button
        class="recipe-footer-button"
        v-if="!ownsAllIngredients"
        @click="addRecipeToShoppingList()"
      >
        <p class="recipe-footer-button-text">Legg til i handleliste</p>
        <p class="recipe-footer-button-subtext">
          Manglende ingredienser blir lagt til i handlelisten
        </p>
      </button>
      <button class="recipe-footer-button" v-else @click="makeRecipe()" v-if="!makingRecipe">
        <p class="recipe-footer-button-text">Lag rett</p>
        <p class="recipe-footer-button-subtext">
          Alle ingrediensene vil bli fjernet fra kjøleskapet
        </p>
      </button>
    </div>
    <div class="recipe-guide">
      <button
        class="recipe-guide-button"
        @click="displayGuide = !displayGuide"
        v-if="!makingRecipe"
      >
        <span class="recipe-guide-button-text">Vis guide</span>
        <font-awesome-icon
          :icon="faChevronDown"
          class="recipe-guide-button-icon"
          :class="{ 'recipe-guide-button-icon-active': displayGuide }"
        />
      </button>
      <div class="recipe-guide-content" v-if="displayGuide">
        <div class="recipe-guide-content-step" v-for="(step, index) in recipeGuide" :key="index">
          <h3 class="recipe-guide-content-step-title">Steg {{ index + 1 }}</h3>
          <ul class="recipe-guide-content-step-list">
            <li
              v-for="(item, index) in step"
              :key="index"
              class="recipe-guide-content-step-list-item"
            >
              <span class="recipe-guide-content-step-list-item-text">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
