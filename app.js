var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
require('dotenv').config();
var logger = require('morgan');

//import routes
const userRouter = require('./routes/userRouter');
const productRouter=require('./routes/productRouter')
const reviewRouter=require('./routes/reviewRouter')


const { connectToDatabase } = require('./helpers/connection');
const validateResponse = require('./middlewares.js/validator');

var app = express();


//DB connection
connectToDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(validateResponse);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/v1/user', userRouter);
// app.use('/api/v1/user', locationRouter);

// product
 app.use('/api/v1/product', productRouter);
 app.use('/api/v1/review',reviewRouter)
// test route
app.get('/api/test', (req, res) => {
  res.send('I am responding!');
});

app.use('/public', express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    // If headers have already been sent, do nothing further
    return next('Something went wrong'); // You can choose the message you want to send.
  }

  if (error.message) {
    console.error("Error:", error.message);
    return res.status(500).send(error.message);
  } else {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message || 'There was an error!',
    });
  }
});


app.use((err, req, res, next) => {
  //console.error("error tushar",err.message);
  res.status(500).json({ message: err.message });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).json({ message: err.message });
  // res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
