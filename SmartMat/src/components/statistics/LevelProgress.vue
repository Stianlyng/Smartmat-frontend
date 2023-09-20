<script setup>
import '@/assets/css/statistics/column-comparison.css'
import { ref, computed } from 'vue'
import InfoButton from '@/components/InfoButton.vue'


//Defines the props for the component which is info about the user level
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
})

const series = ref([props.value])

//Computes the series for the chart
const seriesComputed = computed(() => {
  return [props.value]
})

//Configures the chart
const chartOptions = computed(() => {
  return {
    chart: {
      height: 300,
      type: 'radialBar'
    },
    title: {
      text: 'Nivå ' + props.level,
      align: 'center',
      style: {
        fontSize: '22px',
        color: '#328165'
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#333',
            offsetY: 120
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color: '#328165',
            formatter: function (val) {
              return val + '%'
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
        colorStops: [
          {
            offset: 0,
            color: '#328165',
            opacity: 1
          },
          {
            offset: 50,
            color: '#328165',
            opacity: 1
          },
          {
            offset: 65,
            color: '#328165',
            opacity: 1
          },
          {
            offset: 91,
            color: '#328165',
            opacity: 1
          }
        ]
      }
    },
    stroke: {
      dashArray: 4
    },
    labels: ['På vei til nivå ' + (parseInt(props.level) + 1)]
  }
})
</script>

<template>
  <div class="column-comparison">
    <apexchart width="300" type="radialBar" :options="chartOptions" :series="seriesComputed">
    </apexchart>
    <InfoButton
      message="Nivået er basert på hvor flink gruppen er til å unngå matsvinn. Jo mindre matsvinn, jo høyere nivå."
    ></InfoButton>
  </div>
</template>
