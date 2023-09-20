<script setup>
import '@/assets/css/recipe/week-planer.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWeeklyMenuByFridgeID } from '@/services/smartmatApi/WeeklyMenuService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { fetchFridgeByGroupID } from '@/services/smartmatApi/FridgeService.js'
import InfoButton from '../InfoButton.vue'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import { throwXpPopup } from '@/utils/XpController'
import { throwErrorPopup } from '@/utils/ErrorController'
import { convertFridgeProducts } from '@/utils/ProductConverter'
import { fetchRecipeByID } from '@/services/smartmatApi/RecipeService'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronCircleDown,
  faChevronCircleUp,
  faMinusCircle,
  faPlusCircle,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import { eanFetchProduct } from '@/services/externalApi/ProductService.js'
import {
  fetchShoppingListByGroupID,
  addProductToShoppingList
} from '@/services/smartmatApi/ShoppingListService.js'
import { addToProducts } from '@/services/smartmatApi/ProductService.js'

const router = useRouter()

const groupId = useGroupStore().getGroupID
let fridgeId = null
const shoppingListId = ref(null)
const recipes = ref([])
const ownedProducts = ref([])
const portions = ref(2)

onMounted(async () => {
  showLoadingPopup()
  await fetchShoppingListID()
  await fetchRecipeData()
  await fetchOwnedProducts()
  await matchOwnedProducts()

  console.log(recipes.value)

  hideLoadingPopup()
})

// Fetches the shopping list ID
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

// Matches the owned products with the ingredients
async function matchOwnedProducts() {
  for (const recipe of recipes.value) {
    for (const ingredient of recipe.recipeIngredients) {
      for (const ownedProduct of ownedProducts.value) {
        if (ownedProduct.name.toLowerCase().includes(ingredient.name.toLowerCase())) {
          ingredient.owns = true
          ingredient.matchingProduct = ownedProduct.name
          ingredient.matchingProductID = ownedProduct.productId
          //ownedProducts.value.splice(ownedProducts.value.indexOf(ownedProduct), 1);
          break
        }
      }
    }
  }
}

// Fetches the recipe data
async function fetchRecipeData() {
  try {
    const fridge = await fetchFridgeByGroupID(groupId)
    fridgeId = fridge.data.fridgeId
    console.log(fridgeId)
  } catch (error) {
    console.log(error)
  }

  try {
    const weeklyMenu = await fetchWeeklyMenuByFridgeID(fridgeId)
    console.log(weeklyMenu.data)
    //recipes.value = weeklyMenu.data;

    for (const recipe of weeklyMenu.data) {
      recipes.value.push({
        recipeId: recipe.recipeDetails.recipeId,
        recipeName: recipe.recipeDetails.recipeName,
        recipeDescription: recipe.recipeDetails.recipeDescription,
        recipeImage: recipe.recipeDetails.recipeImage,
        recipeIngredients: await fetchRecipeIngredients(recipe.recipeDetails.recipeId),
        ingredientMatches: recipe.matchCount,
        displayIngredients: false
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// Fetches the recipe ingredients
async function fetchRecipeIngredients(recipeID) {
  const recipeResponse = await fetchRecipeByID(recipeID)
  const recipe = recipeResponse.data

  for (let i = 0; i < recipe.products.length; i++) {
    const product = recipe.products[i]

    if (product.unit == 'STK') {
      product.unit = 'stk'
    }

    product.showProducts = false
    product.matchingProduct = null
    product.matchingProductID = null

    if (product.unit == 'STK') {
      product.unit = 'stk'
    }
  }

  return recipe.products
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

// Reduces the portions
function reducePortions() {
  if (portions.value == 2) {
    return
  }

  portions.value -= 2
}

// Increases the portions
function increasePortions() {
  if (portions.value == 10) {
    return
  }

  portions.value += 2
}

// Adds the products to the shopping list
async function addToShoppingList() {
  showLoadingPopup()

  for (const recipe of recipes.value) {
    for (const product of recipe.recipeIngredients) {
      if (!product.owns) {
        try {
          await addToShoppingListProduct(product.ean)
        } catch (error) {
          console.log(error)
          if (error.response.status === 404) {
            throwErrorPopup('Fant ikke handlelisten')
          } else {
            //throwErrorPopup("Kunne ikke legge til produktet i handlelisten");
          }
        }
      }
    }
  }

  hideLoadingPopup()
  throwXpPopup()
  throwErrorPopup('Handlelisten er fylt opp')
  router.push('/list')
}

// Adds a product to the shopping list
async function addToShoppingListProduct(ean) {
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
    //throwErrorPopup("Kunne ikke legge til produktet i handlelisten");
  }
}
</script>

<template>
  <div class="week-planer">
    <div class="week-planer-header">
      <h1>Generer ukesmeny for ditt kjøleskap</h1>
      <p class="week-planer-header-description">
        Ukesmenyen er basert på hva du har i kjøleskapet ditt, og vil generere en handleliste for
        deg
      </p>
    </div>
    <div class="week-planer-content">
      <div class="week-planer-recipes">
        <div v-for="(recipe, day) in recipes" :key="recipe.recipeId" class="week-planer-recipe">
          <div class="week-planer-recipe-header">
            <h2 class="week-planer-recipe-day">Dag: {{ day + 1 }}</h2>
          </div>
          <div class="week-planer-recipe-image">
            <img :src="recipe.recipeImage" alt="recipe image" />
          </div>
          <div class="week-planer-recipe-info">
            <h3 class="week-planer-recipe-name">
              {{ recipe.recipeName }}
            </h3>
            <p class="week-planer-recipe-description">
              Du har
              {{
                recipe.ingredientMatches > recipe.recipeIngredients.length
                  ? recipe.recipeIngredients.length
                  : recipe.ingredientMatches
              }}
              av {{ recipe.recipeIngredients.length }} ingredienser fra før
            </p>
            <p class="week-planer-recipe-description">
              {{ recipe.recipeDescription }}
            </p>
          </div>
          <button
            class="week-planer-recipe-button"
            @click="recipe.displayIngredients = !recipe.displayIngredients"
          >
            <FontAwesomeIcon
              :icon="recipe.displayIngredients ? faChevronCircleUp : faChevronCircleDown"
            />
          </button>
          <div class="recipe-ingredients" v-if="recipe.displayIngredients">
            <div
              class="recipe-ingredient"
              v-for="ingredient in recipe.recipeIngredients"
              :key="ingredient.productId"
            >
              <span>{{ ingredient.name }}: {{ ingredient.amount }} {{ ingredient.unit }}</span>
              <span v-if="ingredient.owns" class="recipe-ingredient-owns">
                <font-awesome-icon :icon="faCheck" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="week-planer-footer">
      <div class="portions-selector">
        <button class="portions-selector-button" @click="reducePortions()">
          <font-awesome-icon :icon="faMinusCircle" />
        </button>
        <span class="portions-selector-text"> {{ portions }} porsjoner </span>
        <button class="portions-selector-button" @click="increasePortions()">
          <font-awesome-icon :icon="faPlusCircle" />
        </button>
      </div>
      <button class="week-planer-footer-button" @click="addToShoppingList()">
        Fyll opp handlelisten
      </button>
    </div>
  </div>
</template>
