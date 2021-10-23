const Router = require('express').Router
const router = new Router()
const BrandController = require('../controllers/BrandController')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/create', authMiddleware('ADMIN'), BrandController.create)
router.post('/delete', authMiddleware('ADMIN'), BrandController.delete)
router.post('/get', BrandController.getAll)

module.exports = router