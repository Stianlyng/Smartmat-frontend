import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('fridges')

//Adds a product to the fridge associated with the group ID
export async function addProductToFridge(body) {
  try {
    const response = await apiClient.post('/group/product', body)

    return response
  } catch (error) {
    throw new Error('Kunne ikke legge til produktet til kjøleskapet.')
  }
}

//Fetches the fridge associated with the group ID
export async function fetchFridgeByGroupID(groupId) {
  try {
    const response = await apiClient.get('/group/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne kjøleskapet til gruppen med ID: ' + groupId)
  }
}

//Removes a product from the fridge associated with the fridgeproduct ID
export async function removeFridgeProductByID(fridgeProductId, amount) {
  try {
    const response = await apiClient.delete(
      '/group/delete/product/' + fridgeProductId + '/' + amount.toFixed(2)
    )

    return response
  } catch (error) {
    throw new Error('Kunne ikke fjerne produktet med ID: ' + fridgeProductId + ' fra kjøleskapet.')
  }
}

//Removes a product from the fridge associated with the fridgeproduct ID
export async function addFridgeProductToWaste(fridgeProductId) {
  try {
    const response = await apiClient.delete('/waste/product/' + fridgeProductId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke fjerne produktet med ID: ' + fridgeProductId + ' fra kjøleskapet.')
  }
}
