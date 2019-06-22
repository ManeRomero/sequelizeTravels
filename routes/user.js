const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
const helper = require('../helpers/user')

router.get('/register', registerForm);
router.post('/register', register)
router.get('/logIn', logInForm)
router.post('/logIn', logIn)
router.get('/logOut', logOut)
router.put('/goAdmin', admin)
router.get('/activate/:hash', activateUser)

async function registerForm(req, res, next) {
    res.render('user/signup')
}

async function register(req, res) {
    let {
        name,
        email,
        password
    } = req.body

    let result = await controller.signUpProccess(name, email, password)
    if (result === -1) {
        req.flash('error_msg', 'ERROR!! Datos mal introducidos.')
        res.redirect('/user/register')
    } else {
        await helper.sendMail(email)
        req.flash('success_msg', `Genial, ${name}. Verifica el mail que hemos enviado a ${email}!`)
        res.redirect('/user/logIn')
    }
}

async function logInForm(req, res) {
    res.render('user/logIn')
}

async function logIn(req, res) {
    let {
        email,
        password
    } = req.body

    let result = await controller.logInProccess(email, password)
    if (result === -1) {
        let error_msg = 'ERROR!! El usuario no se encuentra en la Base de Datos.'
        res.render('user/logIn', {
            error_msg,
            email
        })
    } else {
        let data = await helper.getUserDataByEmail(email)
        let isActive = await helper.checkActivation(data.id)

        if (isActive) {
            controller.startSession(req, res, data)
        } else {
            req.flash('error_msg', 'Debes validar tu cuenta para poder iniciar sesión.')
            res.redirect('/user/logIn')
        }
    }
}

async function logOut(req, res) {
    req.flash('success_msg', 'Adiós!! Vuelve pronto!!')
    req.session.destroy(function (err) {
        if (err) {
            res.send(err)
        }

        res.redirect('/')
    })
}

async function admin(req, res) {
    await helper.goAdmin(req.session.userId)
    let query = await helper.getUserDataByEmail(req.session.email)
    req.session.admin = query.admin

    req.flash('success_msg', `GUAU!! ${query.name}, eres ADMIN!!`)
    res.redirect('/')
}


async function activateUser(req, res) {

    let hash = req.params.hash
    let hashFound = await controller.findHash(hash)
    if (hashFound === -1) {
        req.flash('error_msg', 'ERROR!! Hash incorrecto para verificación!')
        res.redirect('/')
    }
    let id = hashFound.dataValues.UserId
    let data = await helper.getUserDatabyId(id)
    helper.updateActive(id)
    
    controller.startSession(req, res, data)
}

module.exports = router;