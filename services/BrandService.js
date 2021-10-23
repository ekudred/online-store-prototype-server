const BrandModel = require('../models/Brand')
const ProductModel = require('../models/Product')

class BrandService {
  async create({ name }) {
    return await BrandModel.create({ name })
  }

  async delete(brands) {
    brands.forEach(async brand => {
      await BrandModel.deleteOne({ name: brand.name })
      await ProductModel.deleteMany({ brand: brand._id })
    })

    return 'Has been deleted'
  }

  async edit(brand) {
    return await BrandModel.findByIdAndUpdate(brand._id, { ...brand }, { new: true })
  }

  async getAll() {
    return await BrandModel.find({})
  }
}

module.exports = new BrandService()
