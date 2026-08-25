const express = require("express");
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
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

// Unhandled routes — runs only if nothing above matched
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404))
})

// Global error handling middleware
app.use(globalErrorHandler)

module.exports = app