const TypeService = require('../services/TypeService')
const ErrorAPI = require('../exceptions/ErrorAPI')

class TypeController {
  async create(req, res, next) {
    try {
      // const { name } = req.body
      const type = await TypeService.create({ ...req.body })

      res.json(type)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async delete(req, res, next) {
    try {
      // const { name } = req.body
      const type = await TypeService.delete({ ...req.body })

      res.json(type)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }

  async getAll(req, res, next) {
    try {
      const types = await TypeService.getAll()

      res.json(types)
    } catch (e) {
      next(ErrorAPI.badRequest(e.message))
    }
  }
}

module.exports = new TypeController()
