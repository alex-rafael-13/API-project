const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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

// backend/app.js
const routes = require('./routes');

// Connect all the routes
app.use(routes); 


module.exports = app;
