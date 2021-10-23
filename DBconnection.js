const mongoose = require('mongoose')

async function DBconnect() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = DBconnect
