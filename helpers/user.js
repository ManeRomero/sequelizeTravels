const bcrypt = require('bcrypt')
const model = require('../models')
const SALT_ROUNDS = 10
const email = require('../config/nodemailer')
const hbs = require('nodemailer-express-handlebars')
const helper = require('./nodemailer')

checkMail = async (email) => {
    let result = await model.User.findAll({
        where: {
            email
        }
    })

    if (result.length == 0) {
        return 'OKAY'
    } else if (result[0]['isNewRecord'] === false) {
        return -1
    }
}

encryptPassword = async (password) => {
    let newPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return newPassword
}

comparePass = async (password, encrypted) => {
    let checking = await bcrypt.compare(password, encrypted)
    return checking
}

mailToLogIn = async (email) => {
    let result = await model.User.findAll({
        where: {
            email
        }
    })

    if (result.length == 0) {
        return -1
    }

    return result[0]['password']
}

getUserDataByEmail = async (email) => {
    let result = await model.User.findAll({
        where: {
            email
        }
    })

    return result[0]['dataValues']
}

getUserDatabyId = async (id) => {
    let result = await model.User.findOne({
        where: {
            id
        }
    })

    return result.dataValues
}


goAdmin = async (id) => {
    await model.User.update({
        admin: 1
    }, {
        where: {
            id
        }
    })

    return 'OK'
}

sendMail = async (dataEmail) => {
    let userData = await getUserDataByEmail(dataEmail)
    const hash = `${helper.codexName()}-${Date.now()}`
    let save = await saveHash(hash, userData.id)
    const userName = userData.name

    if (save) {

        let message = {
            to: dataEmail,
            subject: 'sequelizeTravels: Valida tu cuenta!',
            template: 'email',
            context: {
                texto: `El mail fue enviado en ${new Date()}.`,
                hash,
                userName
            }
        }

        email.transporter.use('compile', hbs(helper.transporter))
        email.transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(500).send(err, message)
            } else {
                email.transporter.close()
            }
        })
    } else {
        return 'UNA MIERDA PINCHÁ EN UN PALO'
    }
}

saveHash = (code, UserId) => {
    return model.Hash.create({
        code,
        UserId
    })
}

checkActivation = async (id) => {
    let data = await getUserDatabyId(id)
    return data.active
}

updateActive = async (id) => {
    await model.User.update({
        active: 1
    }, {
        where: {
            id
        }
    })
}

isAdmin = async (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        req.flash('error_msg', 'Debes ser Admin para realizar esta acción')
        res.redirect('/user/logIn')
    }
}

module.exports = {
    checkMail,
    encryptPassword,
    comparePass,
    mailToLogIn,
    getUserDataByEmail,
    goAdmin,
    sendMail,
    getUserDatabyId,
    checkActivation,
    updateActive,
    isAdmin
}