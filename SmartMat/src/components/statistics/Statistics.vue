<script setup>
import ColumnComparison from './ColumnComparison.vue'
import ProgressChart from './ProgressChart.vue'
import WastePieChart from './WastePieChart.vue'
import LevelProgress from './LevelProgress.vue'
import MoneyStat from './MoneyStat.vue'
import '@/assets/css/statistics/statistics.css'
import { useGroupStore } from '@/stores/GroupStore'
import { useUserStore } from '@/stores/UserStore'
import { ref, onMounted, watch } from 'vue'
import {
  fetchCakeGraphData,
  fetchLastMonthsData,
  fetchLostMoney,
  fetchAnualCO2Data
} from '@/services/smartmatApi/WasteService.js'
import { fetchGroupProgress, fetchGroupLevel } from '@/services/smartmatApi/GroupService.js'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import { throwErrorPopup } from '@/utils/ErrorController'

const groupId = ref('')
const groupLevel = ref('')
const groupProgress = ref('')
const lostMoney = ref(0)
const groupCakeGraphData = ref([])
const groupLastMonthsData = ref([])
const groupAnualCO2Data = ref(0)
const isDataFetched = ref(false)

//Fetches the data for the statistics
const fetchData = async () => {
  try {
    //Fetches the group progress and level
    const response2 = await fetchGroupProgress(groupId.value)
    groupProgress.value = response2.data + ''
    const response3 = await fetchGroupLevel(groupId.value)
    groupLevel.value = response3.data + ''
    isDataFetched.value = true
  } catch (error) {
    throw error
  }

  try {
    //Fetches the data for the cake graph
    const response = await fetchCakeGraphData(groupId.value)
    groupCakeGraphData.value = response.data
  } catch (error) {
    throwErrorPopup('Kunne ikke hente data for kakediagrammet')
  }

  try {
    //Fetches the data for the last months
    const response = await fetchLastMonthsData(groupId.value)
    groupLastMonthsData.value = response.data
  } catch (error) {
    throwErrorPopup('Kunne ikke hente data')
  }

  try {
    //Fetches the data for the anual co2
    const response = await fetchAnualCO2Data(groupId.value)
    groupAnualCO2Data.value = response.data.toFixed(2)
  } catch (error) {
    throwErrorPopup('Kunne ikke hente data')
  }

  try {
    //Fetches the data for the lost money
    const response = await fetchLostMoney(groupId.value)
    lostMoney.value = response.data
  } catch (error) {
    throwErrorPopup('Kunne ikke laste inn data')
  }
}

//Watches the group id and fetches the data when it changes
watch(groupId, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    showLoadingPopup()
    await fetchData()
    hideLoadingPopup()
  }
})

//Fetches the data when the component is mounted
onMounted(async () => {
  showLoadingPopup()
  try {
    await useGroupStore().setUserGroup(useUserStore().getUsername)
    groupId.value = useGroupStore().getGroupID
  } catch (error) {
    throwErrorPopup(error)
  }
  hideLoadingPopup()
})
</script>

<template>
  <div class="statistics">
    <MoneyStat :value="lostMoney" />
    <ColumnComparison :value="groupAnualCO2Data" />
    <ProgressChart :values="groupLastMonthsData" />
    <WastePieChart :values="groupCakeGraphData" />
    <LevelProgress :value="groupProgress" :level="groupLevel" />
  </div>
</template>
