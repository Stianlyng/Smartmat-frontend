import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('waste')

//Fetches the waste with the given waste ID
export async function fetchWasteByID(wasteId) {
  try {
    const response = await apiClient.get('/' + wasteId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne avfallet med ID: ' + wasteId)
  }
}

//Fetches the waste for the group with the given group ID
export async function fetchGroupWaste(groupId) {
  try {
    const response = await apiClient.get('/group/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne avfallet med til gruppen med ID: ' + groupId)
  }
}

//Fetches the cake graph data for the group with the given group ID
export async function fetchCakeGraphData(groupId) {
  try {
    const response = await apiClient.get('/statistic/cakeGraph/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne avfallet med til gruppen med ID: ' + groupId)
  }
}
//Fetches waste for the last months for the group with the given group ID
export async function fetchLastMonthsData(groupId) {
  try {
    const response = await apiClient.get('/statistic/lastMonths/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne avfallet med til gruppen med ID: ' + groupId)
  }
}

//Fetches the anual CO2 data for the group with the given group ID
export async function fetchAnualCO2Data(groupId) {
  try {
    const response = await apiClient.get('/statistic/annuallyCO2/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne avfallet for gruppen med ID: ' + groupId)
  }
}

export async function fetchLostMoney(groupId) {
  try {
    const response = await apiClient.get('/statistic/lostMoney/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne penger tapt for gruppen med ID: ' + groupId)
  }
}
