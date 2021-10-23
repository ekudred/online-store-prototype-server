const { model, Schema } = require('mongoose')

const ProductInfoSchema = new Schema({
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('ProductInfo', ProductInfoSchema)