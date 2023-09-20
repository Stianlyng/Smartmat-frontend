<script setup>
import '@/assets/css/statistics/column-comparison.css'
import { ref, computed, onMounted } from 'vue'
import InfoButton from '@/components/InfoButton.vue'

const lastMonths = ref([])

//Gets the name of the last 4 months
onMounted(() => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()
  const months = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]
  for (let i = 0; i < 4; i++) {
    if (month - i < 0) {
      lastMonths.value.push(months[month - i + 12] + ' ' + (year - 1))
    } else {
      lastMonths.value.push(months[month - i].substring(0, 3))
    }
  }
})

//Defines the props for the progress
const props = defineProps({
  values: {
    type: Array,
    required: true
  }
})


//Computes the series for the chart
const seriesComputed = computed(() => {
  return [
    {
      title: 'Ditt matavfall',
      type: 'column',
      data: props.values
    },
    {
      title: 'Ditt matavfall',
      type: 'line',
      data: props.values
    }
  ]
})

//Configures the chart
const chartOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '75%',
      borderRadius: 20,
      colors: {
        ranges: [
          {
            from: 0,
            to: 1000,
            color: '#328165'
          }
        ]
      }
    }
  },
  stroke: {
    width: [0, 4],
    curve: 'smooth',
    colors: ['#31C48D', '#31C48D']
  },
  title: {
    text: 'Ditt matavfall'
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
    formatter: function (val) {
      return val.toFixed(2) + 'kg'
    },
    style: {
      fontSize: '12px',
      colors: ['#328165']
    }
  },
  legend: {
    show: false
  },
  labels: lastMonths.value,
  xaxis: {
    type: 'string'
  },
  yaxis: {
    title: {
      show: false
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    labels: {
      show: false
    }
  },
  tooltip: {
    enabled: false
  }
}
</script>

<template>
  <div class="column-comparison">
    <apexchart
      width="300"
      height="300"
      type="line"
      :options="chartOptions"
      :series="seriesComputed"
    >
    </apexchart>
    <InfoButton message="Dette er en oversikt over ditt matavfall de siste 4 månedene." />
  </div>
</template>
