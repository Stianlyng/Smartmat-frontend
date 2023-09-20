<script setup>
import { ref } from 'vue'
const emit = defineEmits(['nextStep'])
let questions = [
  {
    text: 'Spiser du bare halal?',
    answer: false,
    allergy_name: ['Alcohol', 'Pork']
  },
  {
    text: 'Er du vegetarianer?',
    answer: false,
    allergy_name: ['Meat', 'Fish', 'Chicken']
  },
  {
    text: 'Er du veganer?',
    answer: false,
    allergy_name: ['Meat', 'Fish', 'Chicken', 'Lactose', 'Eggs', 'Honey']
  }
]

let question = ref(0)
let questionText = ref(questions[question.value].text)
let start = ref(false)

// Goes to the next question
function nextQuestion(answer) {
  questions[question.value].answer = answer
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
  <h1 v-if="!start">Har du noen andre matpreferanser?</h1>
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
