const bcrypt = require('bcrypt')
const model = require('../models')
const SALT_ROUNDS = 10
const email = require('../config/nodemailer')
const hbs = require('nodemailer-express-handlebars')
const mailHelper = require('./nodemailer')

let checkMail = async (email) => {
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

let encryptPassword = async (password) => {
    let newPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return newPassword
}

let comparePass = async (password, encrypted) => {
    let checking = await bcrypt.compare(password, encrypted)
    return checking
}

let mailToLogIn = async (email) => {
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

let getUserDataByEmail = async (email) => {
    let result = await model.User.findAll({
        where: {
            email
        }
    })

    if (result[0] === undefined) {
        return -1
    } else {
        return result[0]['dataValues']
    }
}

let getUserDatabyId = async (id) => {
    let result = await model.User.findOne({
        where: {
            id
        }
    })

    return result.dataValues
}


let goAdmin = async (id) => {
    await model.User.update({
        admin: 1
    }, {
        where: {
            id
        }
    })

    return 'OK'
}

let sendMail = async (dataEmail) => {
    let userData = await getUserDataByEmail(dataEmail)
    const hash = `${mailHelper.codexName()}-${Date.now()}`
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

        email.transporter.use('compile', hbs(mailHelper.transporter))
        email.transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(500).send(err, message)
            } else {
                email.transporter.close()
            }
        })
    } else {
        return -1
    }
}

let mailToForgotten = async (dataEmail) => {
    let userData = await getUserDataByEmail(dataEmail)
    let userName = userData.name
    let id = userData.id

    let hash = await getHashById(id)
    console.log(hash, 'C LC C C HASH');

    let message = {
        to: dataEmail,
        subject: 'sequelizeTravels: Recupera tu contraseña!',
        template: 'forgottenPassword',
        context: {
            texto: `El mail fue enviado en ${new Date()}.`,
            userName,
            hash,
            id
        }
    }

    email.transporter.use('compile', hbs(mailHelper.transporter))
    email.transporter.sendMail(message, (err, info) => {
        if (err) {
            res.status(500).send(err, message)
        } else {
            email.transporter.close()
        }
    })
}

let saveHash = (code, UserId) => {
    return model.Hash.create({
        code,
        UserId
    })
}

let checkActivation = async (id) => {
    let data = await getUserDatabyId(id)
    return data.active
}

let updateActive = async (id) => {
    let result = await model.User.update({
        active: 1
    }, {
        where: {
            id
        }
    })

    return result[0]
}

let isAdmin = async (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        req.flash('error_msg', 'Debes ser Admin para realizar esta acción')
        res.redirect('/user/logIn')
    }
}

let listUsers = async () => {
    let data = await model.User.findAll()
    return data
}

let deleteUser = async (id) => {
    let delUser = await model.User.destroy({
        where: {
            id
        },
        force: true // evita el problema con el atributo paranoid: true
    })
    return delUser
}

let userUpdate = async (id, data) => {
    let update = await model.User.update({
        name: data.name,
        email: data.email,
        password: data.password,
        admin: data.admin,
        active: data.active
    }, {
        where: {
            id
        }
    })

    return update[0]
}

let getHashById = async (UserId) => {
    let result = await model.Hash.findOne({
        where: {
            UserId
        }
    })

    return result['dataValues'].code
}

let updatePassword = async (id, password) => {
    let result = await model.User.update({
        password
    }, {
        where: {
            id
        }
    })

    return result[0]
}

let checkHash = async (UserId, code) => {
    let checking = await model.Hash.findOne({
        code
    }, {
        where: {
            UserId
        }
    })

    return checking['dataValues'].code
}

let changeHash = async (UserId) => {
    const code = `${mailHelper.codexName()}-${Date.now()}`
    let update = await model.Hash.update({
        code
    }, {
        where: {
            UserId
        }
    })

    return update[0]
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
    isAdmin,
    listUsers,
    deleteUser,
    userUpdate,
    mailToForgotten,
    updatePassword,
    checkHash,
    changeHash
}