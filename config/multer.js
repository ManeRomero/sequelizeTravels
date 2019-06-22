const multer = require('multer')
const rename = require('../helpers/nodemailer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, rename.codexName() + Date.now() + 
        file.originalname.slice(file.originalname.lastIndexOf('.'),
        file.originalname.length))
    }
})

var upload = multer({
    storage
})

module.exports = upload