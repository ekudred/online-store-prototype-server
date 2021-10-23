const { model, Schema } = require('mongoose')

const ProductSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: Schema.Types.ObjectId, required: true, ref: 'Type' },
    brand: { type: Schema.Types.ObjectId, required: true, ref: 'Brand' },
    price: { type: Number, required: true },
    info: { type: Schema.Types.ObjectId, ref: 'ProductInfo' },
    rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    img: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('Product', ProductSchema)