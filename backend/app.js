const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

//Checks if the environment is in production
const { environment } = require('./config');
const isProduction = environment === 'production';

//Initializing Express
const app = express();
//Connecting morgan middleware with Express
app.use(morgan('dev'));
//Adding cookie-parser middleware using Express
app.use(cookieParser());
//express.json() to parse JSON files
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}
// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);
  // Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);
    
// Connect all the routes
const routes = require('./routes');
app.use(routes);

//--------------- Error Handling Middleware: ---------------//
//Catches unhandled requests and fowards to error handling:
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

//Process sequelize errors:
const { ValidationError } = require('sequelize')

app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

//Error formatter: Formats all the errors before sending a json response
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});
//------------------------------------------------------------//

module.exports = app;
