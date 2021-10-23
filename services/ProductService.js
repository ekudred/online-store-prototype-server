const ErrorAPI = require('../exceptions/ErrorAPI')
const productDTO = require('../dtos/productDTO')
const ProductModel = require('../models/Product')
const ProductInfoModel = require('../models/ProductInfo')
const RatingModel = require('../models/Rating')
const BasketProductModel = require('../models/BasketProduct')
const { createImg, deleteImg } = require('../utils')

class ProductService {
  async create({ name, type_id, brand_id, img, price, info }) {
    const checkProduct = await ProductModel.findOne({ name })

    if (checkProduct) {
      throw ErrorAPI.badRequest('This product already exists')
    }

    const fileName = await createImg(img)
    const product = await ProductModel.create({ name, type: type_id, brand: brand_id, price, img: fileName })

    if (info) {
      const productInfo = await ProductInfoModel.create({ product: product._id, title: info.title, description: info.description })
      product.info = productInfo._id
      product.save()
    }

    await ProductModel.populate(product, populate)

    return new productDTO(product)
  }

  async delete(products) {
    products.forEach(async product => {
      await ProductModel.findByIdAndDelete(product._id)
      await ProductInfoModel.deleteOne({ product: product._id })
      await RatingModel.deleteMany({ product: product._id })
      await BasketProductModel.deleteMany({ product: product._id })
      await deleteImg(product.img)
    })

    return 'Has been deleted'
  }

  async edit(product) {
    const prod = await ProductModel.findById(product._id)

    let fileName = product.img
    if (prod.img !== product.img) {
      await deleteImg(prod.img)
      // product.img.includes('base64')
      fileName = await createImg(product.img)
    }

    await ProductInfoModel.findByIdAndUpdate(product.info._id, { ...product.info })

    const newProduct = await ProductModel.findByIdAndUpdate(product._id, { ...product, img: fileName }, { new: true })
    await ProductModel.populate(newProduct, populate)
    return new productDTO(newProduct)
  }

  async getSome({ type_id, brand_id, limit, skip }) {
    let obj = {}

    if (!brand_id && !type_id) obj = await getProducts({}, limit, skip)
    if (brand_id && !type_id) obj = await getProducts({ brand: brand_id }, limit, skip)
    if (!brand_id && type_id) obj = await getProducts({ type: type_id }, limit, skip)
    if (brand_id && type_id) obj = await getProducts({ type: type_id, brand: brand_id }, limit, skip)

    const products = obj.products.map(item => new productDTO(item))
    const totalLength = obj.totalCount

    return { products, totalLength }
  }

  async getOne({ id }) {
    const product = await ProductModel.findById(id).populate(populate)

    return new productDTO(product)
  }

  async addRate({ user_id, product_id, rate }) {
    const checkRating = await RatingModel.findOne({ user: user_id, product: product_id })

    if (checkRating) {
      checkRating.rate = rate
      return checkRating.save()
    }

    const rating = await RatingModel.create({ user: user_id, product: product_id, rate })
    const product = await ProductModel.findOne({ _id: product_id })
    product.rating = [...product.rating, rating._id]
    product.save()

    return rating
  }

  async getRating(product_id) {
    const rates = await RatingModel.find({ product: product_id })
    const rating = Math.round(rates.reduce((accum, current) => (accum += current.rate), 0) / rates.length)

    return { rating, product_id }
  }

  async getRate({ user_id, product_id }) {
    const doc = await RatingModel.findOne({ user: user_id, product: product_id })

    if (!doc) return 0

    return doc.rate
  }

  async findPopular(amount) {
    const products = await ProductModel.find().populate({ path: 'rating' })

    const ratings = products.reduce((accumProducts, currentProduct) => {
      if (currentProduct.rating.length !== 0) {
        const rating = currentProduct.rating.reduce((accum, current) => (accum += current.rate), 0)
        const average = Math.round(rating / currentProduct.rating.length)

        return (accumProducts = [...accumProducts, { rating: average, product: new productDTO(currentProduct) }])
      } else {
        return (accumProducts = [...accumProducts, { rating: 0, product: new productDTO(currentProduct) }])
      }
    }, [])

    const sorted = ratings.sort((a, b) => b.rating - a.rating)

    return sorted.slice(0, amount)
  }
}

const populate = [{ path: 'type' }, { path: 'brand' }, { path: 'info' }]

async function getProducts(param, limit, skip) {
  const docs = await ProductModel.find(param)
  const products = await ProductModel.find(param).sort({ created_at: -1 }).skip(JSON.parse(skip)).limit(JSON.parse(limit)).populate(populate)

  return { products, totalCount: docs.length }
}

module.exports = new ProductService()
