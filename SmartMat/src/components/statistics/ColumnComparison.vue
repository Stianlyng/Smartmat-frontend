<script setup>
import '@/assets/css/statistics/column-comparison.css'
import { ref, computed } from 'vue'
import InfoButton from '../InfoButton.vue'

//Defines the props for the component which is info about the user waste
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

//Defines the configuration for the chart
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '75%',
      borderRadius: 20,
      colors: {
        ranges: [
          {
            from: 1,
            to: 117,
            color: '#328165'
          },
          {
            from: 118,
            to: 118,
            color: '#333333'
          },
          {
            from: 118.01,
            to: 2000,
            color: '#000'
          }
        ]
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + 'kg CO2'
    },
    style: {
      fontSize: '12px',
      colors: ['#FDFEFE']
    }
  },
  xaxis: {
    categories: ['Deg', 'Gjennomsnittet'],
    labels: {
      style: {
        fontWeight: 'bold'
      }
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + 'kg CO2'
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + 'kg CO2'
      }
    }
  },
  title: {
    text: 'Beregnet utslipp per år'
  }
})

//Computes the series of data for the chart
const seriesComputed = computed(() => {
  return [
    {
      name: 'Utslipp',
      data: [props.value, 118]
    }
  ]
})
</script>

<template>
  <div class="column-comparison">
    <apexchart width="300" height="300" type="bar" :options="chartOptions" :series="seriesComputed">
    </apexchart>
    <InfoButton
      message="Dette er en sammenligning av ditt utslipp og gjennomsnittet for en nordmann. Gjennomsnittet er basert på tall fra en rapport av miljødirektoratet."
    ></InfoButton>
  </div>
</template>
