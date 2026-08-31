const AppError = require('../utils/appError')

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  })
}

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error(err)

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

const handleCastErrorDB = err => {
  return new AppError(`Inavlid ${err.path}: ${err.value}`, 400)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res)
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err}
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err)
    }
    sendErrProd(error, res)
  }
}
