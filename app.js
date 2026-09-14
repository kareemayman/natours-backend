const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const { xss } = require("express-xss-sanitizer")
const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")
const toursRouter = require("./routes/tourRoutes")
const usersRouter = require("./routes/userRoutes")

const app = express()

app.use(helmet()) // Set security HTTP headers

// Express 5 defaults to the 'simple' query parser, which leaves bracket
// notation (?price[gte]=500) as a flat key. 'extended' uses qs to nest it.
app.set("query parser", "extended")

// Use Morgan logging middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"))

const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
})
app.use("/api", limiter) // Apply rate limiting to all /api routes

// express.json middleware
app.use(express.json())

// Data sanitization against XSS attacks
app.use(xss())

// Routes
app.use("/api/v1/tours", toursRouter)
app.use("/api/v1/users", usersRouter)

// Unhandled routes — runs only if nothing above matched
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404))
})

// Global error handling middleware
app.use(globalErrorHandler)

module.exports = app
