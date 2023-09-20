import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('product')

//Fetches the product with the given product EAN
export async function fetchInternalProductByEAN(productEAN) {
  try {
    const response = await apiClient.get('/ean/' + productEAN)

    return response
  } catch (error) {
    throw error
  }
}

//Adds a product to the database
export async function addToProducts(productInfo) {
  try {
    const response = await apiClient.post('/', productInfo)

    return response
  } catch (error) {
    throw error
  }
}

//Fetches the product with the given product name
export async function fetchInternalProductByName(productName) {
  try {
    const response = await apiClient.get('/name/' + productName)

    return response
  } catch (error) {
    throw error
  }
}
