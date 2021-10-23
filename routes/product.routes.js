const Router = require('express').Router
const router = new Router()
const ProductController = require('../controllers/ProductController')
// const authMiddleware = require('../middleware/auth.middleware')

router.post('/get', ProductController.getSome)
router.post('/get/:id', ProductController.getOne)
router.post('/popular/find', ProductController.findPopular)
router.post('/rating/get/:id', ProductController.getRating)
router.post('/rate/get', ProductController.getRate)

module.exports = router
