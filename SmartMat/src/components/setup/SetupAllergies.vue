<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/UserStore.js'
import { addUserAllergy } from '@/services/smartmatApi/UserService.js'
import { throwErrorPopup } from '@/utils/ErrorController'

const emit = defineEmits(['nextStep'])
let questions = [
  {
    text: 'Er du allergisk mot laktose?',
    answer: false,
    allergy_name: ['Melk']
  },
  {
    text: 'Er du allergisk mot gluten?',
    answer: false,
    allergy_name: ['Gluten']
  },
  {
    text: 'Er du allergisk mot nøtter?',
    answer: false,
    allergy_name: ['Nøtter', 'Peanøtter']
  },
  {
    text: 'Er du allergisk mot egg?',
    answer: false,
    allergy_name: ['Egg']
  },
  {
    text: 'Er du allergisk mot skalldyr?',
    answer: false,
    allergy_name: ['Skalldyr']
  },
  {
    text: 'Er du allergisk mot fisk?',
    answer: false,
    allergy_name: ['Fisk']
  }
]

let question = ref(0)
let questionText = ref(questions[question.value].text)
let start = ref(false)

// Goes to the next question
async function nextQuestion(answer) {
  questions[question.value].answer = answer
  try {
    const username = useUserStore().getUsername
    for (let i = 0; i < questions[question.value].allergy_name.length; i++) {
      let body = {
        username: username,
        allergyName: questions[question.value].allergy_name[i]
      }
      console.log(body)
      try {
        const response = await addUserAllergy(body)
        //throwErrorPopup("Allergi registrert:" + questions[question.value].allergy_name[i])
      } catch (error) {
        throwErrorPopup('Allergi allerede registrert')
      }
    }
  } catch (error) {
    console.log('Error' + error)
  }
  question.value++
  if (question.value < questions.length) {
    questionText.value = questions[question.value].text
  } else {
    console.log(questions)
    emit('nextStep')
  }
}

//Emits nextStep
function nextStep() {
  emit('nextStep')
}
</script>

<template>
  <h1 v-if="!start">Har du noen allergier?</h1>
  <h1 v-else>
    {{ questionText }}
  </h1>
  <div class="button-row" v-if="!start">
    <button class="setup__button" @click="nextStep">Nei</button>
    <button class="setup__button" @click="start = true">Ja</button>
  </div>
  <div class="button-row" v-else>
    <button class="setup__button" @click="nextQuestion(false)">Nei</button>
    <button class="setup__button" @click="nextQuestion(true)">Ja</button>
  </div>
</template>
