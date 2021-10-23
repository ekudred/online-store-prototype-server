const Router = require('express').Router
const router = new Router()
const AuthController = require('../controllers/AuthController')
const { body } = require('express-validator')
const authMiddleware = require('../middleware/auth.middleware')

router.post(
    '/registration', 
    [
        body('username').custom(value => {
            if (/^[a-zA-Z1-9]+$/.test(value) === false) return Promise.reject('Login must contain only Latin letters')
            if (value.length < 4 || value.length > 14) return Promise.reject('Login must contain from 4 to 14 characters')
            if (parseInt(value.substr(0, 1))) return Promise.reject('Login must start with a letter')

            return true
        }),
        body('email').isEmail(),
        body('password').isLength({ min: 8, max: 32 }),
    ],
    AuthController.registration
)

router.post('/login', AuthController.logIn)

router.post('/logout', AuthController.logOut)

router.get('/activate/:link', AuthController.activate)

router.get('/refresh', AuthController.refresh)

module.exports = router