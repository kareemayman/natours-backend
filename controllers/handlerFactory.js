const AppError = require("../utils/appError")
const APIFeatures = require("../utils/apiFeatures")

exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id)
  if (!doc) return next(new AppError(`No document found with that ID`, 404))
  res.status(204).json({
    status: "success",
  })
}

exports.updateOne = (Model) => async (req, res, next) => {
  const newDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  })

  if (!newDoc) return next(new AppError("No document found with that ID", 404))

  res.status(200).json({
    status: "success",
    data: newDoc,
  })
}

exports.createOne = (Model) => async (req, res, next) => {
  const newDoc = await Model.create(req.body)
  res.status(201).json({
    status: "success",
    data: newDoc,
  })
}

exports.getOne = (Model) => async (req, res, next) => {
  const doc = await Model.findById(req.params.id)
  if (!doc) return next(new AppError("No document found with that ID", 404))
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  })
}

exports.getAll = (Model) => async (req, res, next) => {
  const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate()
  const docs = await features.query

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  })
}
