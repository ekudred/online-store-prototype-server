const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '7d' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

    return { accessToken, refreshToken }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

      return userData
    } catch (e) {
      return null
    }
  }

  async createToken(user_id, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: user_id })

    if (tokenData) {
      tokenData.refreshToken = refreshToken

      return tokenData.save()
    }

    const token = await TokenModel.create({ user: user_id, refreshToken })

    return token
  }

  async saveToken(user_id, refreshToken) {
    return await TokenModel.updateOne({ user: user_id }, { refreshToken })
  }

  async removeToken(refreshToken) {
    return await TokenModel.deleteOne({ refreshToken })
  }

  async findToken(refreshToken) {
    return await TokenModel.findOne({ refreshToken })
  }
}

module.exports = new TokenService()
