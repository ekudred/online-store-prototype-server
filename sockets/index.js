const BasketService = require('../services/BasketService')
const ProductService = require('../services/ProductService')
const TypeService = require('../services/TypeService')
const BrandService = require('../services/BrandService')
const UserService = require('../services/UserService')
const TokenService = require('../services/TokenService')

module.exports = function (io) {
  io.on('connection', socket => {
    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnect')
    })

    // ==========

    socket.on('user/login', async ({ accessToken }) => {
      socket.handshake.auth.user = TokenService.validateAccessToken(accessToken)
    })

    socket.on('user/avatar:edit', async img => {
      const image = await UserService.editAvatar(img, socket.handshake.auth.user._id)
      emitToAuthSocket('user/avatar:edited', image, socket)
    })

    socket.on('user/basket:add', async ({ basket_id, product_id, amount }) => {
      const basketProduct = await BasketService.add({ basket_id, product_id, amount })
      emitToAuthSocket('user/basket:added', basketProduct, socket)
    })
    socket.on('user/basket:delete', async ({ basket_id, product_id }) => {
      await BasketService.delete({ basket_id, product_id })
      emitToAuthSocket('user/basket:deleted', product_id, socket)
    })
    socket.on('user/basket:edit', async ({ basket_id, product_id, amount }) => {
      const basketProduct = await BasketService.edit({ basket_id, product_id, amount })
      emitToAuthSocket('user/basket:edited', basketProduct, socket)
    })

    // ==========

    socket.on('user/product/rate:add', async ({ user_id, product_id, rate }) => {
      await ProductService.addRate({ user_id, product_id, rate })
      const rating = await ProductService.getRating(product_id)
      io.sockets.emit('user/product/rating:update', rating)
    })

    // ==========

    socket.on('admin/product:create', async data => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const product = await ProductService.create({ ...data })
        emitToRoleSocket('admin/product:created', product, 'ADMIN')
      }
    })
    socket.on('admin/product:delete', async ({ products }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        await ProductService.delete(products)
        emitToRoleSocket('admin/product:deleted', products, 'ADMIN')
      }
    })
    socket.on('admin/product:edit', async ({ product }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const newProduct = await ProductService.edit(product)
        emitToRoleSocket('admin/product:edited', newProduct, 'ADMIN')
      }
    })

    // ==========

    socket.on('admin/type:create', async data => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const type = await TypeService.create({ ...data })
        emitToRoleSocket('admin/type:created', type, 'ADMIN')
      }
    })
    socket.on('admin/type:delete', async ({ types }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        await TypeService.delete(types)
        emitToRoleSocket('admin/type:deleted', types, 'ADMIN')
      }
    })
    socket.on('admin/type:edit', async ({ type }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const newType = await TypeService.edit(type)
        emitToRoleSocket('admin/type:edited', newType, 'ADMIN')
      }
    })

    // ==========

    socket.on('admin/brand:create', async data => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const brand = await BrandService.create({ ...data })
        emitToRoleSocket('admin/brand:created', brand, 'ADMIN')
      }
    })
    socket.on('admin/brand:delete', async ({ brands }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        await BrandService.delete(brands)
        emitToRoleSocket('admin/brand:deleted', brands, 'ADMIN')
      }
    })
    socket.on('admin/brand:edit', async ({ brand }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const newBrand = await BrandService.edit(brand)
        emitToRoleSocket('admin/brand:edited', newBrand, 'ADMIN')
      }
    })

    // ==========

    socket.on('admin/users/user:register', async ({ user }) => {
      emitToRoleSocket('admin/users/user:registered', user, 'ADMIN')
    })
    socket.on('admin/users/user:edit', async ({ user }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        const newUser = await UserService.edit(user)
        emitToRoleSocket('admin/users/user:edited', newUser, 'ADMIN')
      }
    })
    socket.on('admin/users/user:delete', async ({ users }) => {
      if (socket.handshake.auth.user.role[0] === 'ADMIN') {
        await UserService.delete(users)
        emitToRoleSocket('admin/users/user:deleted', users, 'ADMIN')
      }
    })
  })

  async function emitToAuthSocket(event, data, socket) {
    await io.sockets.sockets.forEach((value, key, map) => {
      if (map.get(key).handshake.auth.user && map.get(key).handshake.auth.user._id === socket.handshake.auth.user._id) {
        io.to(map.get(key).id).emit(event, data)
      }
    })
  }

  async function emitToRoleSocket(event, data, role) {
    await io.sockets.sockets.forEach((value, key, map) => {
      if (map.get(key).handshake.auth.user && map.get(key).handshake.auth.user.role[0] === role) {
        io.to(map.get(key).id).emit(event, data)
      }
    })
  }
}
