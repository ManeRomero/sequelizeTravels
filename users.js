const router = require('express').Router();
const passport = require('passport');

// Models
const User = require('../models/User');

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Las contraseñas no coinciden.'});
  }
  if(password.length < 4) {
    errors.push({text: 'La contraseña debe contener al menos 4 caracteres.'})
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, name, email, password, confirm_password});
  } else {

    console.log('SE REGISTRA USUARIO')
    
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'Este correo ya está en uso.');
      res.redirect('/users/signup');
    } else {
      
      const newUser = new User({name, email, password});
      newUser.password = await newUser.encryptPassword(password);      
      await newUser.save();
      req.flash('success_msg', 'Registrado! Te damos la bienvenida al sistema.');
      res.redirect('/users/signin');
    }
  }
});

router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/procesos',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Te has desconectado. Hasta pronto!');
  res.redirect('/users/signin');
});

router.get('/cuentaAdmin', async (req, res) => {
  const tituloWeb = 'Cuenta Standard > Admin'
  res.render('vistaAdmin/formAdmin', {
    tituloWeb
  })
})

module.exports = router;
