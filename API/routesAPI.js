const express = require('express');
const router = express.Router();
const controller = require('../controller/travel')

router.get('/', welcome)
router.get('/travels', allTravels)
router.post('/travels', addTravel)
router.get('/travels/:id', travelsByID)
router.get('/travelsByPrice/:maxPrice', travelsByPrice)
router.get('/travelsByDestiny/:place', travelsByPlace)
router.get('/travelsByAuthor/:author', travelsByAuthor)

/* FUNCTIONS */

function welcome(req, res) {
    user = req.session
    req.flash('success_msg', 'Te damos la Bienvenida a la API de sequelizeTravels')
    res.render('API/intro')
}

async function allTravels(req, res) {
    let results = await controller.getTravels()
    res.send(results)
}

async function addTravel(req, res) {

    let {
    destiny,
    price,
    discount,
    dateInit,
    dateTurn,
    imgpath
   } = req.body

    let insert = {
        destiny,
        price,
        discount,
        dateInit,
        dateTurn,
        imgpath
    }
 
    let results = await controller.saveTravel(insert)
    res.send(results)
}

async function travelsByID (req, res) {
    let id = req.params.id
    let result = await controller.detail(id)
    res.send(result)
}

async function travelsByPrice (req, res) {
    let maxPrice = req.params.maxPrice
    let data = await controller.getTravels()
    let results = data.filter((item) => {
        return item.price <= maxPrice
    })

    res.send(results)
}

async function travelsByPlace (req, res) {
    let destiny = req.params.destiny
    let data = await controller.getTravels()
    let results = data.filter((item) => {
        return item.destiny === destiny
    })

    res.send(results)
}

async function travelsByAuthor (req, res) {
    let author = req.params.author
    let data = await controller.getTravels()
    let results = data.filter((item) => {
        return item.author === author
    })

    res.send(results)
}

module.exports = router