const TypeModel = require('../models/Type')
const ProductModel = require('../models/Product')

class TypeService {
  async create({ name }) {
    return await TypeModel.create({ name })
  }

  async delete(types) {
    types.forEach(async type => {
      await TypeModel.deleteOne({ name: type.name })
      await ProductModel.deleteMany({ type: type._id })
    })

    return 'Has been deleted'
  }

  async edit(type) {
    return await TypeModel.findByIdAndUpdate(type._id, { ...type }, { new: true })
  }

  async getAll() {
    return await TypeModel.find({})
  }
}

module.exports = new TypeService()
