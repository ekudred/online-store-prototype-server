const BrandService = require('../services/BrandService')
const ErrorAPI = require('../exceptions/ErrorAPI')

class BrandController {
  async create(req, res, next) {
    try {
      // const { name } = req.body
      const type = await BrandService.create({ ...req.body })

      res.json(type)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async delete(req, res, next) {
    try {
      // const { name } = req.body
      const brand = await BrandService.delete({ ...req.body })

      res.json(brand)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getAll(req, res, next) {
    try {
      const types = await BrandService.getAll()

      res.json(types)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }
}

module.exports = new BrandController()