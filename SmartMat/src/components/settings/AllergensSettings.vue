<script setup>
import '@/assets/css/settings/allergens-settings.css'
import { ref, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { fetchUserAllergens } from '@/services/smartmatApi/UserService'
import { useUserStore } from '@/stores/UserStore.js'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import { addUserAllergy, deleteUserAllergy } from '@/services/smartmatApi/UserService.js'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useRouter } from 'vue-router'

const router = useRouter()

const allergens = [
  'Bløtdyr',
  'Egg',
  'Fisk',
  'Gluten',
  'Lupiner',
  'Melk',
  'Nøtter',
  'Peanøtter',
  'Selleri',
  'Sennep',
  'Sesam',
  'Skalldyr',
  'Soya',
  'Sulfitt'
]
const selectedAllergens = ref([])
const prevAllergens = ref([])
const hasUnsavedChanges = ref([true])

// Fetches the users allergens from the database
onMounted(async () => {
  showLoadingPopup()
  let loadedAllergens = await fetchUserAllergens(useUserStore().getUsername)

  for (let i = 0; i < loadedAllergens.length; i++) {
    loadedAllergens[i] = loadedAllergens[i].name
  }
  selectedAllergens.value = loadedAllergens
  prevAllergens.value = loadedAllergens
  hideLoadingPopup()
})

//Adds all the allergens that the user has selected
const addAllergens = async () => {
  const username = useUserStore().getUsername
  for (let i = 0; i < selectedAllergens.value.length; i++) {
    if (!prevAllergens.value.includes(selectedAllergens.value[i])) {
      try {
        let body = {
          username: username,
          allergyName: selectedAllergens.value[i]
        }
        const response = await addUserAllergy(body)
      } catch (error) {
        throwErrorPopup('Lagring av allergen feilet')
      }
    }
  }
}

//Deletes all the allergens that the user has deselected
const deleteAllergens = async () => {
  const username = useUserStore().getUsername
  for (let i = 0; i < prevAllergens.value.length; i++) {
    if (!selectedAllergens.value.includes(prevAllergens.value[i])) {
      try {
        let body = {
          username: username,
          allergyName: prevAllergens.value[i]
        }
        const response = await deleteUserAllergy(body)
      } catch (error) {
        throwErrorPopup('Noe gikk galt ved fjerning av allergen')
      }
    }
  }
}

//Saves all the allergens that the user has selected
const saveAllergens = async () => {
  await addAllergens()
  await deleteAllergens()
  throwErrorPopup('Allergener lagret')
  prevAllergens.value = selectedAllergens.value
  await useUserStore().setUserAllergens()
  hasUnsavedChanges.value = false
  router.push('/profile')
}

watch(selectedAllergens, (newVal) => {
  if (newVal.toString() !== prevAllergens.value.toString()) {
    hasUnsavedChanges.value = true
  } else {
    hasUnsavedChanges.value = false
  }
})

const checkUnsavedChanges = () => {
  if (!hasUnsavedChanges.value) {
    router.push('/profile')
  }
  if (hasUnsavedChanges.value) {
    const confirmMessage = 'Du har ulagrede endringer. Er du sikker på at du vil forlate siden?'
    if (confirm(confirmMessage)) {
      // Reset the flag and go back
      hasUnsavedChanges.value = false
      router.push('/profile')
    }
  } else {
    // Do something to go back
  }
}
</script>

<template>
  <div class="allergens">
    <button class="back-button" @click="checkUnsavedChanges">
      <font-awesome-icon :icon="faArrowLeft" />
    </button>
    <div class="allergens-settings">
      <h1>Allergener</h1>
      <div class="allergens-settings-container">
        <h2>Velg dine allergener:</h2>
        <div class="allergens-selection">
          <div class="allergen-container" v-for="(allergen, index) in allergens" :key="index">
            <label>
              <input type="checkbox" :value="allergen" v-model="selectedAllergens" />
              <span class="checkmark">
                <font-awesome-icon :icon="faCheck" />
              </span>
              {{ allergen }}
            </label>
          </div>
        </div>
      </div>
      <div class="allergens-selected">
        <div>Allergener valgt: {{ selectedAllergens.join(', ') }}</div>
      </div>

      <div class="save-button-container">
        <button class="save-button" @click="saveAllergens">Lagre endringer</button>
      </div>
    </div>
  </div>
</template>
