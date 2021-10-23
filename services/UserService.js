const userDTO = require('../dtos/userDTO')
const UserModel = require('../models/User')
const BasketProductModel = require('../models/BasketProduct')
const RatingModel = require('../models/Rating')
const Basket = require('../models/Basket')
const { createImg, deleteImg } = require('../utils')

class UserService {
  async find({ skip, limit }) {
    const users = await UserModel.find({}).sort({ created_at: -1 }).skip(JSON.parse(skip)).limit(JSON.parse(limit))

    return users.map(user => new userDTO(user))
  }

  async edit(user) {
    const newUser = await UserModel.findById(user._id)
    if (newUser.username !== user.username && user.username !== 'undefined') {
      newUser.username = user.username
    }
    if (newUser.role !== user.role && user.role !== 'undefined') {
      newUser.role = user.role
    }
    newUser.save()

    return new userDTO(newUser)
  }

  async delete(users) {
    users.forEach(async user => {
      await Basket.findOneAndDelete({ user: user._id })
      await BasketProductModel.deleteMany({ basket: user.basket })
      await RatingModel.deleteMany({ user: user._id })
      await UserModel.findByIdAndDelete(user._id)
      if (user.avatar !== 'user_avatar.png') {
        await deleteImg(user.avatar)
      }
    })
  }

  async editAvatar(img, id) {
    const fileName = await createImg(img)
    // product.img.includes('base64')
    const user = await UserModel.findByIdAndUpdate(id, { avatar: fileName })

    if (user.avatar !== 'user_avatar.png') {
      await deleteImg(user.avatar)
    }

    return fileName
  }

  async getTotalLength() {
    return await UserModel.countDocuments({})
  }
}

module.exports = new UserService()
