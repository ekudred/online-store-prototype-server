const Router = require('express').Router
const router = new Router()
const UserController = require('../controllers/UserController')

router.post('/get_users', UserController.getUsers)

module.exports = router