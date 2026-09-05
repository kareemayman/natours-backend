const User = require("../models/userModel")
const jose = require("jose")

const secret = new TextEncoder().encode(process.env.JWT_SECRET) // encode it for jose

exports.signUp = async (req, res, next) => {
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
