const { model, Schema } = require('mongoose')

const RatingSchema = new Schema({
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    rate: { type: Number, required: true, default: 0 }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('Rating', RatingSchema)