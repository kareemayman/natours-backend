const User = require("../models/userModel")
const jose = require("jose")
const AppError = require("../utils/appError")

const secret = new TextEncoder().encode(process.env.JWT_SECRET) // encode it for jose

exports.signUp = async (req, res) => {
  // Create the user using only the data we need
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  const token = await new jose.SignJWT({ userId: newUser._id.toString() })
    .setProtectedHeader({ alg: "HS256" }) // declare th signing algo
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(secret)

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  })
}

exports.login = async (req, res, next) => {
  if (!req.body.email) return next(new AppError("Please enter your email", 401))
  if (!req.body.password) return next(new AppError("Please enter your password", 401))

  const user = await User.findOne({ email: req.body.email }).select("+password")
  if (!user || !(await user.comparePassword(req.body.password, user.password)))
    return next(new AppError("Invalid email or password", 401))

  const token = await new jose.SignJWT({ userId: user._id.toString() })
    .setProtectedHeader({ alg: "HS256" }) // declare th signing algo
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(secret)

  res.status(201).json({
    status: "success",
    token,
  })
}

exports.protect = async (req, res, next) => {
  // Checking if token exists
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token)
    return next(new AppError("You're not logged in! Please log in to access this resource.", 401))

  // Token Verification
  let verifiedToken
  try {
    verifiedToken = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })
  } catch (err) {
    return next(new AppError("Invalid or expired token. Please log in again.", 401))
  }

  const { payload } = verifiedToken
  req.userId = payload.userId

  // Check if user still exists
  const currentUser = await User.findById(payload.userId)
  if (!currentUser) return next(new AppError("User no longer exists.", 401))

  // Check if password isn't changed
  if (currentUser.changedPasswordAfter(payload.iat))
    return next(new AppError("Password changed recently. Please log in again.", 401))

  req.user = currentUser
  next()
}
