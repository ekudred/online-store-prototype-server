const AuthService = require('../services/AuthService')
const { validationResult } = require('express-validator')
const ErrorAPI = require('../exceptions/ErrorAPI')

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(ErrorAPI.badRequest('Ошибка при валидации', errors.array()))
      }

      // const { username, email, password } = req.body
      const userData = await AuthService.registration({ ...req.body })

      res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logIn(req, res, next) {
    try {
      // const { username, password } = req.body
      const userData = await AuthService.login({ ...req.body })
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true })

      res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logOut(req, res, next) {
    try {
      // const { refreshToken } = req.cookies
      const token = await AuthService.logout({ ...req.cookies })
      res.clearCookie('refreshToken')

      res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      // const { refreshToken } = req.cookies
      const userData = await AuthService.refresh({ ...req.cookies })
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true })

      res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      // const activationLink = req.params.link
      await AuthService.activate(req.params.link)

      res.redirect(process.env.CLIENT_URL + '/login')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AuthController()