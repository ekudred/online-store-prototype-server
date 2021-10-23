const Router = require('express').Router
const router = new Router()

const authRouter = require('./auth.routes')
const userRouter = require('./user.routes')
const productRouter = require('./product.routes')
const typeRouter = require('./type.routes')
const brandRouter = require('./brand.routes')
const basketRouter = require('./basket.routes')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/basket', basketRouter)

module.exports = router