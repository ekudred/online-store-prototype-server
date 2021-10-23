const { model, Schema } = require('mongoose')

const TypeSchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('Type', TypeSchema)