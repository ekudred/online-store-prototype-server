const { model, Schema } = require('mongoose')

const BasketProductSchema = new Schema(
  {
    basket: { type: Schema.Types.ObjectId, required: true, ref: 'Basket' },
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    amount: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'created_at' } }
)

module.exports = model('BasketProduct', BasketProductSchema)
