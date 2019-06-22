var express = require('express');
var router = express.Router();
const controller = require('../controller/travel')
const helper = require('../helpers/user')

router.get('/', manageIntro)

async function manageIntro(req, res) {

  let travels = await controller.getTravels()

  if (req.session.name === undefined) {
    res.render('index', {
      travels
    })
  } else if (req.session.name) {

    let user = {
      name: req.session.name,
      admin: req.session.admin
    }

    res.render('index', {
      user,
      travels
    })
  }
}

module.exports = router