const ErrorAPI = require('../exceptions/ErrorAPI')
const ProductService = require('../services/ProductService')

class ProductController {
  async getSome(req, res, next) {
    try {
      // let { type_id, brand_id, limit, skip } = req.body
      const data = await ProductService.getSome({ ...req.body })

      res.json(data)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getOne(req, res, next) {
    try {
      // const { id } = req.params
      const product = await ProductService.getOne({ ...req.params })

      res.json(product)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getRating(req, res, next) {
    try {
      const { id: product_id } = req.params
      const rating = await ProductService.getRating(product_id)

      res.json(rating)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getRate(req, res, next) {
    try {
      // const { user_id, product_id } = req.body
      const rate = await ProductService.getRate({ ...req.body })

      res.json(rate)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async findPopular(req, res, next) {
    try {
      const { amount } = req.body
      const products = await ProductService.findPopular(amount)

      res.json(products)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }
}

module.exports = new ProductController()
