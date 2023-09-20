<script setup>
import '@/assets/css/statistics/column-comparison.css'
import { ref, computed } from 'vue'
import InfoButton from '@/components/InfoButton.vue'

//Defines the props for the component which is info about the waste categories
const props = defineProps({
  values: {
    type: Array,
    required: true
  }
})

const series = props.values

//Computes the series for the chart
const seriesComputed = computed(() => {
  return props.values
})

//Configures the chart
const chartOptions = {
  chart: {
    width: 300,
    type: 'pie'
  },
  labels: ['Kjøtt og fisk', 'Brød og korn', 'Egg og melkeprodukter', 'Frukt og grønt', 'Annet'],
  responsive: [
    {
      breakpoint: 2000,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  colors: ['#355070', '#e56b6f', '#6d597a', '#b56576', '#333533'],
  dataLabels: {
    enabled: false
  },
  title: {
    text: 'Hva som blir kastet'
  }
}
</script>

<template>
  <div class="column-comparison">
    <apexchart width="300" height="300" type="pie" :options="chartOptions" :series="seriesComputed">
    </apexchart>
    <InfoButton
      message="Denne grafen viser hvilken type mat som blir kastet. Den viser hvor mye av matavfallet ditt som er kjøtt og fisk, brød og korn, egg og melkeprodukter, frukt og grønt og annet."
    />
  </div>
</template>
