const multer  = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + Date.now()+ ext)
    }
  })
   
module.exports = multer({ storage })