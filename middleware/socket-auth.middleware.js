const ErrorAPI = require('../exceptions/ErrorAPI')
const TokenService = require('../services/TokenService')

module.exports = function (socket, next) {
  try {
    if (socket.handshake.auth && socket.handshake.auth.accessToken) {
      const userData = TokenService.validateAccessToken(socket.handshake.auth.accessToken)

      socket.handshake.auth.user = userData
    }

    next()
  } catch (e) {
    console.log(e)

    next()
  }
}

// module.exports = function (socket, next) {
//   try {
//     if (socket.handshake.query && socket.handshake.query.accessToken) {
//       const userData = TokenService.validateAccessToken(socket.handshake.query.accessToken)

//       socket.handshake.auth.user = userData
//     }

//     next()
//   } catch (e) {
//     console.log(e)

//     next()
//   }
// }
