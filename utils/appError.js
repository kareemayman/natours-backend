class AppError extends Error {
  constructor (message, statusCode) {
    super(message)
    
    this.statusCode = statusCode
    this.status = statusCode >= 500 ? 'error' : 'fail'
    this.isOperational = true // all errors created with this class are operational errors

    Error.captureStackTrace(this, this.constructor) // to save the error stack in all objects (error object, error class)
  }
}

module.exports = AppError