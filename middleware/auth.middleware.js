const ErrorAPI = require('../exceptions/ErrorAPI')
const TokenService = require('../services/TokenService')

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const authHeader = req.headers.authorization
      if (!authHeader) return next(ErrorAPI.unAuthError())

      const accessToken = authHeader.split(' ')[1]
      if (!accessToken) return next(ErrorAPI.unAuthError())

      const userData = TokenService.validateAccessToken(accessToken)
      if (!userData) return next(ErrorAPI.unAuthError())

      let access = false
      userData.role.forEach(item => item === role ? access = true : null)
      if (!access) return next(ErrorAPI.forbidden())

      req.user = userData

      next()
    } catch (e) {
      return next(ErrorAPI.unAuthError())
    }
  }
}
