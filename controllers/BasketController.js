const BasketModel = require('../models/Basket')
const ErrorAPI = require('../exceptions/ErrorAPI')
const BasketService = require('../services/BasketService')

class BasketController {
  async add(req, res, next) {
    try {
      // const { basket_id, product_id, amount } = req.body
      const basketProduct = await BasketService.add({ ...req.body })

      res.json(basketProduct)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async delete(req, res, next) {
    try {
      // const { basket_id, product_id } = req.body
      const basketProduct = await BasketService.delete({ ...req.body })

      res.json(basketProduct)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async edit(req, res, next) {
    try {
      // const { basket_id, product_id, amount } = req.body
      const basketProduct = await BasketService.edit({ ...req.body })

      res.json(basketProduct)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getBasket(req, res, next) {
    try {
      // const { basket_id } = req.body
      const basket = await BasketService.getBasket({ ...req.body })

      res.json(basket)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }
}

module.exports = new BasketController()
