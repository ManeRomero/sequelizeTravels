const model = require('../models')
const helper = require('../helpers/user')

signUpProccess = async (name, email, password) => {
    if (name.lenght < 2 || password.length < 6 || email.length < 6) {
        return -1
    } else {
        let checking = await helper.checkMail(email)

        if (checking === -1) {
            return checking
        } else if (checking === 'OKAY') {

            let newPassword = await helper.encryptPassword(password)
            password = newPassword

            let toInsert = {
                name,
                email,
                password
            }

            return model.User.create(toInsert)
        }
    }
}

logInProccess = async (email, password) => {
    if (password.lenght < 6 || email.length < 6) {
        return -1
    } else {

        let checking = await helper.mailToLogIn(email)
        if (checking === -1) {
            return checking
        } else {
            let compare = await helper.comparePass(password, checking)
            if (compare === false) {
                return -1
            } else {
                return compare
            }
        }
    }
}

findHash = async (code) => {
    let result = await model.Hash.findOne({
        where: {
            code
        }
    })

    if (result === null) {
        return -1
    }

    return result
}

startSession = (req, res, data) => {
    req.session.name = data.name
    req.session.email = data.email
    req.session.userId = data.id
    req.session.admin = data.admin
    req.session.user = data;

    req.flash('success_msg', `Hola ${req.session.name}, qué quieres hacer hoy?`)
    res.redirect('/')
}

module.exports = {
    signUpProccess,
    logInProccess,
    startSession,
    findHash
}