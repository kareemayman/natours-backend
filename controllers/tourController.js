const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError")

exports.getAllTours = async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
  const tours = await features.query

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  })
}

exports.getSingleTour = async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) return next(new AppError("No tour found with that ID", 404))
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

exports.createTour = async (req, res, next) => {
  const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: "success",
    data: newTour,
  })
}

exports.updateTour = async (req, res, next) => {
  const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  })

  if (!newTour) return next(new AppError("No tour found with that ID", 404))

  res.status(200).json({
    status: "success",
    data: newTour,
  })
}

exports.deleteTour = async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) return next(new AppError("No tour found with that ID", 404))
  res.status(204).json({
    status: "success",
  })
}

// Data aggregation
exports.getTourStats = async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: { $toUpper: "$difficulty" },
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        toursCount: { $sum: 1 },
        totalRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
}
