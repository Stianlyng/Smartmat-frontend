import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('allergies')

//Fetches an allergy with the given allergy name
export async function fetchAllergyByName(allergyName) {
  try {
    const response = await apiClient.get('/id/' + allergyName)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne allergen med navn: ' + allergyName)
  }
}

//Fetches all allergies
export async function fetchAllAllergies() {
  try {
    const response = await apiClient.get('/all')

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne allergener.')
  }
}
