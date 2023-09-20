import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('recipe')

//Fetches the recipe with the given recipe ID
export async function fetchRecipeByID(recipeId) {
  try {
    const response = await apiClient.get('/id/' + recipeId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne oppskriften med ID: ' + recipeId)
  }
}

//Fetches the recipe with the given recipe name
export async function fetchRecipeByName(recipeName) {
  try {
    const response = await apiClient.get('/name/' + recipeName)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne oppskriften: ' + recipeName)
  }
}
