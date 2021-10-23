const Router = require('express').Router
const router = new Router()
const TypeController = require('../controllers/TypeController')
const authMiddleware = require('../middleware/auth.middleware')

// router.post('/create', authMiddleware('ADMIN'), TypeController.create)
// router.post('/delete', authMiddleware('ADMIN'), TypeController.delete)
router.post('/create', TypeController.create)
router.post('/delete', TypeController.delete)
router.post('/get', TypeController.getAll)

module.exports = router