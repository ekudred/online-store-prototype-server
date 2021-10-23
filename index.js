const express = require('express')
require('dotenv').config()
const http = require('http')
const useSocket = require('socket.io')
const IOConnect = require('./sockets')
const DBconnect = require('./DBconnection')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index.routes')
const errorMiddleware = require('./middleware/error.middleware')
const socketAuthMiddleware = require('./middleware/socket-auth.middleware')

const PORT = process.env.PORT

const app = express()
const server = http.createServer(app)
const io = useSocket(server, { cors: { origin: process.env.CLIENT_URL } })

app
  .use(cookieParser())
  .use(express.json())
  .use(express.static(path.resolve(__dirname, 'static')))
  .use(fileUpload({}))
  .use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  )
  .use('/api', router)
  .use(errorMiddleware)

io.use(socketAuthMiddleware)

const start = async () => {
  try {
    await DBconnect()
    await IOConnect(io)
    server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

start()
