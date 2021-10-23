module.exports = class productDTO {
  _id
  name
  type
  brand
  price
  info
  rating
  img

  constructor(model) {
      this._id = model._id
      this.name = model.name
      this.type = model.type
      this.brand = model.brand
      this.price = model.price
      this.info = model.info
      this.rating = model.rating
      this.img = model.img
  }
}

