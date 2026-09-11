const User = require("../models/userModel")
const AppError = require("../utils/appError")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      users: "users",
    },
  })
}

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "Success",
    data: {
      user: "newUser",
    },
  })
}

exports.getSingleUser = (req, res) => {
  const id = req.params.id

  res.status(200).json({
    status: "Success",
    data: {
      user: `user with id ${id}`,
    },
  })
}

exports.updateUser = async (req, res, next) => {
  if (!req.body) return next(new AppError("malformed/missing request data", 400))

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  })

  if (!user) return next(new AppError("No user found with that ID", 404))

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  })
}

exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "Success",
  })
}

exports.updateMe = async (req, res, next) => {
  if (!req.body) return next(new AppError("malformed/missing request data", 400))

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError("This route is not for password updates. Please use /updateMyPassword.", 400),
    )

  const filteredBody = filterObj(req.body, "name", "email") // only allow name and email to be updated

  const user = await User.findByIdAndUpdate(req.userId, filteredBody, {
    returnDocument: "after",
    runValidators: true,
  })

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  })
}

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.userId, { active: false })

  res.status(204).json({
    status: "Success",
  })
}
