const nodemailer = require('nodemailer')
const personalData = require('./personal')

let email = {}

email.transporter = nodemailer.createTransport(personalData, {
    from: 'holaTorreJuana@gmail.com',
    headers: {}
})

module.exports = email