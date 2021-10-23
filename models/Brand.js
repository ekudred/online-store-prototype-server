const { model, Schema } = require('mongoose')

const BrandSchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('Brand', BrandSchema)