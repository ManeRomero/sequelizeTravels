const express = require('express');
const router = express.Router();
const controller = require('../controller/travel')
const multerConfig = require('../config/multer')
const imageController = require('../controller/image')
const userHelper = require('../helpers/user')
const { isAdmin } = require('../helpers/user')

router.get('/create', isAdmin, travelForm)
router.post('/create', isAdmin, multerConfig.array('travelPics', 10), createTravel)
router.get('/detail/:id', showTravel)
router.get('/edit/:id', isAdmin, editTravelForm)
router.post('/create/mainPic', isAdmin, postMainPic)
router.put('/update/', isAdmin, updateTravel)
router.delete('/delete/:idToDelete', isAdmin, deleteTravel)

function travelForm(req, res) {

    if (!req.session.user.id) {
        req.flash('error_msg', 'ERROR!! Necesitas ser ADMIN para crear un Destino.')
        res.redirect('/')
    } else {
        res.render('travel/form')
    }
}

async function createTravel(req, res) {

    let UserId = req.session.userId
    let author = await userHelper.getUserDatabyId(UserId)

    let {
        destiny,
        price,
        discount,
        dateInit,
        dateTurn
    } = req.body

    let insert = {
        destiny,
        price,
        discount,
        dateInit,
        dateTurn,
        UserId,
        author: author.name
    }

    let save = await controller.saveTravel(insert)
    let uploadedImages = await imageController.managePics(req, save.id)

    if (uploadedImages) {
        res.render('travel/choosePic', {
            uploadedImages
        })

    } else {
        req.flash('error_msg', 'ERROR!! No pudimos registrar tu nuevo Destino.')
        res.redirect('/travel/create')
    }
}

async function showTravel(req, res) {
    let travel = await controller.detail(req.params.id)
    let images = await imageController.getImagesById(req.params.id)
    
    res.render('travel/detail', {
        travel,
        images
    })
}

async function editTravelForm(req, res) {
    let travel = await controller.detail(req.params.id)

    res.render('travel/editForm', {
        travel
    })
}

async function postMainPic(req, res) {

    let data = req.body.select.split('-')
    let insert = {
        ImageId: data[0],
        TravelId: data[1]
    }

    let save = await controller.saveMainPic(insert)

    if (save) {
        req.flash('success_msg', `GENIAL!! Has creado un nuevo Destino, ${req.session.name}!`)
        res.redirect('/')
    } else {
        req.flash('error_msg', 'ERROR!! No Se ha determinado la imagen principal.')
        /* toDo - función que elimine el viaje creado previamente */
        res.redirect('/travel/create')
    }
}

async function updateTravel (req, res) {
    let id = req.body.id
    let {
        destiny,
        price,
        discount,
        dateInit,
        dateTurn
    } = req.body

    let author = req.session.name
    let UserId = req.session.userId
    
    let travel = {
        destiny,
        price,
        discount,
        dateInit,
        dateTurn,
        UserId,
        author
    }

    let update = await controller.updateTravel(id, travel)
    
    if (update === 1) {
        req.flash('success_msg', `Genial! Viaje con destino a ${destiny} actualizado exitosamente.`)
        res.redirect('/')
    } else {
        req.flash('error_msg', 'Error en la actualización del Viaje. Introduzca de nuevo los datos.')
        res.redirect('')
    }
}

async function deleteTravel (req, res) {
    let id = req.params.idToDelete
    let erase = await controller.deleteTravel(id)

    if (erase === 1) {
        req.flash('success_msg', 'Viaje eliminado satisfactoriamente')
        res.redirect('/')
    } else {
        req.flash('error_msg', 'Hubo problemas con la eliminación del viaje')
        res.redirect('/')
    }
}

module.exports = router;