//Converts the response from the API to a list of products
function convertProducts(response) {
  let products = []
  for (let i = 0; i < response.length; i++) {
    if (response[i].ean != null) {
      products.push({
        name: response[i].name,
        image: response[i].image,
        ean: response[i].ean
      })
    }
  }
  return products
}

//Converts the response from the API to a list of products in the fridge
function convertFridgeProducts(response) {
  let products = []
  for (let i = 0; i < response.products.length; i++) {
    let amount = response.products[i].amount
    if (amount == null) {
      amount = 1
    }

    let unit = response.products[i].ean.unit
    if (unit == null) {
      unit = 'stk'
    }

    let pDate = new Date(response.products[i].purchaseDate)

    let expire = pDate
    expire.setDate(pDate.getDate() + response.products[i].daysToExpiration)

    let today = new Date()

    let remainingDays = Math.ceil((expire - today) / (1000 * 60 * 60 * 24))

    products.push({
      productId: response.products[i].id,
      name: response.products[i].ean.name,
      image: response.products[i].ean.url,
      ean: response.products[i].ean.ean,
      daysToExpiration: response.products[i].daysToExpiration,
      remainingDays: remainingDays,
      purchaseDate: response.products[i].purchaseDate,
      amount: amount,
      unit: unit.toLowerCase(),
      allergies: response.products[i].ean.allergies
    })
  }
  return products
}

//Converts the response from the API to a list of products in the shopping list
function convertShoppingListProducts(response) {
  let products = []
  for (let i = 0; i < response.products.length; i++) {
    let price = response.products[i].price
    if (price == null) {
      price = '?'
    }

    products.push({
      productId: i,
      name: response.products[i].name,
      image: response.products[i].url,
      ean: response.products[i].ean,
      amount: response.products[i].amount,
      price: price
    })
  }
  return products
}

export { convertProducts, convertFridgeProducts, convertShoppingListProducts }
