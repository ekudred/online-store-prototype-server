const Router = require('express').Router
const router = new Router()
const BasketController = require('../controllers/BasketController')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/add', authMiddleware('USER'), BasketController.add)
router.post('/delete', authMiddleware('USER'), BasketController.delete)
router.put('/edit', authMiddleware('USER'), BasketController.edit)
router.post('/get_basket', authMiddleware('USER'), BasketController.getBasket)

module.exports = router
