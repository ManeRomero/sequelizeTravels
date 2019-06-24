const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
const helper = require('../helpers/user')
const { isAdmin } = require('../helpers/user')

router.get('/register', registerForm);
router.post('/register', register)
router.get('/logIn', logInForm)
router.post('/logIn', logIn)
router.get('/logOut', logOut)
router.put('/goAdmin', admin)
router.get('/activate/:hash', activateUser)
router.get('/list', isAdmin, listUsers)
router.get('/edit/:userId', isAdmin, editFormUser)
router.put('/edit/:userId/', isAdmin, updateUser)
router.delete('/delete/:idToDelete/', isAdmin, deleteUser)

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

async function listUsers (req, res) {
    let users = await helper.listUsers()
    req.session.admin = true

    res.render('user/usersList', {
        users
    })
}

async function deleteUser (req, res) {
    let id = req.params.idToDelete
    let erase = await helper.deleteUser(id)
    
    if (erase === 1) {
        req.flash('success_msg', 'Usuario eliminado satisfactoriamente')
        res.redirect('/user/list')
    } else {
        req.flash('error_msg', 'Hubo problemas con la eliminación del usuario')
        res.redirect('/user/list')
    }
}

async function editFormUser (req, res) {
    let id = req.params.userId
    let user = await helper.getUserDatabyId(id)
    
    let success_msg = `Edición de usuario: ${user.name}`
    req.session.admin = true

    res.render('user/editForm', {
        user,
        success_msg
    })
}

async function updateUser (req, res) {
    let id = req.params.userId
    let {
        name,
        email,
        userPassword,
        active,
        admin
    } = req.body

    let password = await helper.encryptPassword(userPassword)

    let user = {
        name,
        email,
        password,
        active,
        admin,
        id
    }

    let update = await helper.userUpdate(id, user)
    console.log(update, 'C L  G  G  G');
    if (update === 1) {
        req.flash('success_msg', 'Usuario actualizado satisfactoriamente')
        res.redirect('/user/list')
    } else {
        user.password = userPassword
        let error_msg = 'Hubo problemas con la actualización del usuario'

        res.render('user/editForm', {
            user,
            error_msg
        })
    }
}

module.exports = router;