const { model, Schema } = require('mongoose')

const UserSchema = new Schema({
    basket: { type: Schema.Types.ObjectId, ref: 'Basket'},
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: [{ type: String, ref: 'Role' }],
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = model('User', UserSchema)