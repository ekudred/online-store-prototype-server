const BasketProductModel = require('../models/BasketProduct')
const ProductModel = require('../models/Product')
const ErrorAPI = require('../exceptions/ErrorAPI')
const basketProductDTO = require('../dtos/basketProductDTO')

class BasketService {
  async add({ basket_id, product_id, amount }) {
    const checkBasketProduct = await BasketProductModel.findOne({ basket: basket_id, product: product_id })

    if (checkBasketProduct) {
      throw ErrorAPI.badRequest('Такой товар в корзине уже есть')
    }

    const product = await getProduct(product_id)
    const basketProduct = await BasketProductModel.create({ basket: basket_id, product: product_id, amount, price: amount * product.price })

    await BasketProductModel.populate(basketProduct, { path: 'product', populate: [{ path: 'type' }, { path: 'brand' }] })

    return new basketProductDTO(basketProduct)
  }

  async delete({ basket_id, product_id }) {
    await BasketProductModel.findOne({ basket: basket_id, product: product_id }).deleteOne()

    return 'Has been deleted'
  }

  async edit({ basket_id, product_id, amount }) {
    if (amount === 0) {
      await BasketProductModel.findOne({ basket: basket_id, product: product_id }).deleteOne()

      return 'Has been deleted'
    }

    const basketProduct = await getBasketProduct(basket_id, product_id)

    basketProduct.amount = amount
    basketProduct.price = amount * basketProduct.product.price
    basketProduct.save()

    return new basketProductDTO(basketProduct)
  }

  async getBasket({ basket_id }) {
    const basket = await BasketProductModel.find({ basket: basket_id }).populate({ path: 'product', populate: [{ path: 'type' }, { path: 'brand' }] })
    
    return basket.map(item => (item = new basketProductDTO(item)))
  }
}

module.exports = new BasketService()

async function getProduct(product_id) {
  return await ProductModel.findById(product_id).populate([{ path: 'type' }, { path: 'brand' }])
}

async function getBasketProduct(basket_id, product_id) {
  return await BasketProductModel.findOne({ basket: basket_id, product: product_id }).populate({
    path: 'product',
    populate: [{ path: 'type' }, { path: 'brand' }],
  })
}
