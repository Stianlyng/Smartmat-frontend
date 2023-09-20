import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('weeklymenu')

//Fetches the weekly menu associated with the given fridge ID
export async function fetchWeeklyMenuByFridgeID(fridgeId) {
  try {
    const response = await apiClient.get('/' + fridgeId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne ukesmenyen tilhørende kjøleskapet med ID: ' + fridgeId)
  }
}
