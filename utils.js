const path = require('path')
const fs = require('fs')
const uuid = require('uuid')
const ErrorAPI = require('./exceptions/ErrorAPI')

async function createImg(img) {
  try {
    if (img.includes('base64')) {
      const image = typeof img === 'string' ? img.replace(/.*base64,/, '') : null
      const fileName = uuid.v4() + '.jpg'

      await fs.writeFile(path.resolve(__dirname, 'static', fileName), image, { encoding: 'base64' }, error => {
        if (error) {
          throw ErrorAPI.badRequest('Error while writing image')
        }
      })

      return fileName
    }
  } catch (e) {
    console.log(e)
  }
}

async function deleteImg(name) {
  await fs.unlink(path.resolve(__dirname, 'static', name), error => {
    if (error) {
      throw ErrorAPI.badRequest('Failed to delete image')
    }
  })
}

module.exports = { createImg, deleteImg }
