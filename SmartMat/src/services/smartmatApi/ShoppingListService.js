import { useUserStore } from '@/stores/UserStore.js'
import { useGroupStore } from '@/stores/GroupStore.js'
import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('shoppinglist')

//Fetches the shopping list with the given shopping list ID
export async function fetchShoppingListByID(shoppingListID) {
  try {
    const response = await apiClient.get('/' + shoppingListID)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne handlelisten med ID: ' + shoppingListID)
  }
}

//Fetches the fridge associated with the group ID
export async function fetchShoppingListByGroupID(groupId) {
  try {
    const response = await apiClient.get('/group/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne handleliste til gruppen med ID: ' + groupId)
  }
}

//Add a product to the shopping list with the given shopping list ID
export async function addProductToShoppingList(shoppingListID, ean) {
  try {
    const response = await apiClient.post('/addProduct/' + shoppingListID + '/' + ean)

    return response
  } catch (error) {
    throw new Error('Kunne ikke legge til produktet til handlelisten med ID: ' + shoppingListID)
  }
}

//Delete a product from the shopping list with the given shopping list ID
export async function deleteProductFromShoppingList(shoppingListID, ean) {
  try {
    const response = await apiClient.delete('/removeProduct/' + shoppingListID + '/' + ean)

    return response
  } catch (error) {
    throw new Error('Kunne ikke legge til produktet til handlelisten med ID: ' + shoppingListID)
  }
}
