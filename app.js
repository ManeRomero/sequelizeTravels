const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const override = require('method-override')
const moment = require('moment');
const cors = require('cors')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const travelRouter = require('./routes/travel');
const APIRouter = require('./API/routesAPI');

const app = express();
const userHelper = require('./helpers/user')

// view engine setup

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbars({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: {
    format: function (price) {
      return (Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(price))
    },
    extra: function (discount) {
      return `${discount}% Descuento`
    },
    time: function (time) {
      return moment(time).locale('es').format("dddd, MMMM Do YYYY, h:mm").toUpperCase();
    }
  }
}))
app.set('view engine', '.hbs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(override('_method'))

app.use(session({
  name: 'userSession',
  secret: 'myS3cr3tK3y',
  resave: true,
  saveUninitialized: true,
  // cookie: {maxAge: 60*1000}
}))

app.use(cors())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.session.user;
  next()
})

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/travel', travelRouter)
app.use('/API', APIRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

module.exports = app;