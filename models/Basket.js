const { model, Schema } = require('mongoose')

const BasketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at' } }
)

module.exports = model('Basket', BasketSchema)
