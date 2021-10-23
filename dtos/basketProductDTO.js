module.exports = class basketProductDTO {
  _id
  product
  amount
  price

  constructor(model) {
    this._id = model._id
    this.product = model.product
    this.amount = model.amount
    this.price = model.price
  }
}
