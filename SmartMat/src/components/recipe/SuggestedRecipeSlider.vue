<script setup>
import '@/assets/css/recipe/suggested-recipe-slider.css'
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import 'swiper/swiper-bundle.css'
import { fetchWeeklyMenuByFridgeID } from '@/services/smartmatApi/WeeklyMenuService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { fetchFridgeByGroupID } from '@/services/smartmatApi/FridgeService.js'
import InfoButton from '../InfoButton.vue'

const router = useRouter()
const groupId = useGroupStore().getGroupID
let fridgeId = null
const recipes = ref([])

//Fetch recipes from weekly menu that match the ingredients in the fridge
onMounted(async () => {
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
      if (recipe.matchCount != 0) {
        recipes.value.push({
          recipeId: recipe.recipeDetails.recipeId,
          recipeName: recipe.recipeDetails.recipeName,
          recipeImage: recipe.recipeDetails.recipeImage
        })
      }
    }

    console.log(recipes.value)
  } catch (error) {
    console.log(error)
  }
})

// Go to recipe page
const goToRecipe = (id) => {
  router.push({ name: 'recipe', params: { id: id } })
}
</script>

<template>
  <h1 class="suggested-recipe-slider-title">
    Anbefalte oppskrifter for ditt kjøleskap
    <InfoButton
      message="Dette er oppskrifter som er basert på hva du har i kjøleskapet ditt. Hvis du har flere produkter i kjøleskapet ditt, vil du få flere oppskrifter."
    />
  </h1>
  <div class="suggested-recipe-slider" v-if="recipes.length > 0">
    <Swiper
      :slides-per-view="2.5"
      :space-between="10"
      v-if="recipes.length > 3"
      :breakpoints="{
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10
        },
        500: {
          slidesPerView: 1.5,
          spaceBetween: 10
        },
        720: {
          slidesPerView: 2.5,
          spaceBetween: 10
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 10
        }
      }"
    >
      <SwiperSlide v-for="recipe in recipes" :key="recipe.id">
        <div class="suggested-recipe-slider-slide">
          <div class="slide-content" @click="goToRecipe(recipe.recipeId)">
            <img :src="recipe.recipeImage" alt="recipe image" />
            <h3>{{ recipe.recipeName }}</h3>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <Swiper
      :slides-per-view="2"
      :space-between="10"
      v-else-if="recipes.length == 2 || recipes.length == 3"
      :breakpoints="{
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10
        },
        500: {
          slidesPerView: 1.5,
          spaceBetween: 10
        },
        720: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 10
        }
      }"
    >
      <SwiperSlide v-for="recipe in recipes" :key="recipe.id">
        <div class="suggested-recipe-slider-slide">
          <div class="slide-content" @click="goToRecipe(recipe.recipeId)">
            <img :src="recipe.recipeImage" alt="recipe image" />
            <h3>{{ recipe.recipeName }}</h3>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <Swiper :slides-per-view="1" :space-between="10" v-else-if="recipes.length == 1">
      <SwiperSlide v-for="recipe in recipes" :key="recipe.id">
        <div class="suggested-recipe-slider-slide">
          <div class="slide-content" @click="goToRecipe(recipe.recipeId)">
            <img :src="recipe.recipeImage" alt="recipe image" />
            <h3>{{ recipe.recipeName }}</h3>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
  <p class="no-found-text" v-else>Ingen oppskrifter funnet</p>
</template>
