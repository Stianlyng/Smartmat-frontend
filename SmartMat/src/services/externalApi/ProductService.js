import axios from 'axios'
import { provideToken } from '../../utils/TokenProvider.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = axios.create({
  baseURL: 'https://kassal.app/api/v1/products', //URL for external API-endpoints
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + provideToken()
  }
})

//Fetches products from the API that fuzzy matches the search word
export async function fetchProducts(searchWord) {
  try {
    const response = await apiClient.get('?search=' + searchWord + '&sort=name_asc')
    return response
  } catch (error) {
    throw new Error('Et problem oppsto ved henting av produkter: ' + error)
  }
}

//Fetches products from the API associated with the search word brand name
export async function fetchProductsFromBrand(searchWord) {
  try {
    const response = await apiClient.get('?brand=' + searchWord)
    return response
  } catch (error) {
    throw new Error('Et problem oppsto ved henting av produkter: ' + error)
  }
}

//Fetches a product from the API that matches the EAN
export async function eanFetchProduct(ean) {
  try {
    const response = await apiClient.get('/ean/' + ean)
    return response
  } catch (error) {
    throw new Error('Et problem oppsto ved henting av produktet: ' + ean)
  }
}

//Fetches the price for a product from the API that matches the EAN
export async function eanFetchProductPrice(ean) {
  try {
    const response = await apiClient.get('/ean/' + ean)

    return response.data.data.products[0].current_price.price
  } catch (error) {
    throw new Error('Et problem oppsto ved henting av prisen til produktet med EAN: ' + ean)
  }
}
