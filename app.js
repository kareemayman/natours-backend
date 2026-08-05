const express = require("express");
const morgan = require('morgan')
const toursRouter = require('./routes/tourRoutes')
const usersRouter = require('./routes/userRoutes')

const app = express();

// Express 5 defaults to the 'simple' query parser, which leaves bracket
// notation (?price[gte]=500) as a flat key. 'extended' uses qs to nest it.
app.set('query parser', 'extended')

// Use Morgan logging middleware
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'))

// express.json middleware
app.use(express.json());

// Routes
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app