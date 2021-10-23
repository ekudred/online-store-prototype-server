const RoleModel = require('../models/Role')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const MailService = require('./MailService')
const TokenService = require('./TokenService')
const userDTO = require('../dtos/userDTO')
const ErrorAPI = require('../exceptions/ErrorAPI')
const BasketModel = require('../models/Basket')
const UserModel = require('../models/User')

class AuthService {
  async registration({ username, email, password }) {
    const candidate = (await UserModel.findOne({ username })) || (await UserModel.findOne({ email }))

    if (candidate) {
      throw ErrorAPI.badRequest('Такой пользователь уже существует')
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const userRole = await RoleModel.findOne({ value: 'USER' })
    const activationLink = uuid.v4()

    const user = await UserModel.create({
      username,
      email,
      avatar: 'user_avatar.png',
      password: hashPassword,
      role: userRole.value,
      activationLink,
    })

    const basketOfUser = await BasketModel.create({ user: user._id })

    user.basket = basketOfUser._id
    user.save()

    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

    const message = 'На данную электронную почту выслано письмо для активации аккаунта'
    const UserDTO = new userDTO(user)

    return { user: UserDTO, message }
  }

  async login({ username, password }) {
    const user = await UserModel.findOne({ username })

    if (!user) {
      throw ErrorAPI.unAuthError()
    }

    const isPass = await bcrypt.compare(password, user.password)

    if (!JSON.parse(user.isActivated)) {
      throw ErrorAPI.badRequest('Электронная почта не подтверждена')
    }

    if (!isPass) {
      throw ErrorAPI.badRequest('Неправильный пароль')
    }

    const UserDTO = new userDTO(user)

    const tokens = TokenService.generateTokens({ ...UserDTO })
    await TokenService.createToken(UserDTO._id, tokens.refreshToken)

    return { ...tokens, user: UserDTO }
  }

  async logout({ refreshToken }) {
    const token = await TokenService.removeToken(refreshToken)

    return token
  }

  async refresh({ refreshToken }) {
    if (!refreshToken) {
      throw ErrorAPI.unAuthError()
    }

    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await TokenService.findToken(refreshToken)

    if (!userData || !tokenFromDB) {
      throw ErrorAPI.unAuthError()
    }

    const user = await UserModel.findById(userData._id)
    const UserDTO = new userDTO(user)

    const tokens = TokenService.generateTokens({ ...UserDTO })
    await TokenService.saveToken(UserDTO._id, tokens.refreshToken)

    return { ...tokens, user: UserDTO }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink })

    if (!user) {
      throw ErrorAPI.badRequest('Invalid activation link')
    }

    user.isActivated = true
    await user.save()
  }
}

module.exports = new AuthService()
