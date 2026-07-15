const express = require("express");
const morgan = require('morgan')
const toursRouter = require('./routes/tourRoutes')
const usersRouter = require('./routes/userRoutes')

const app = express();

// Use Morgan logging middleware
app.use(morgan('dev'))

// express.json middleware
app.use(express.json());

// Routes
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app