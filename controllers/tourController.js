const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures")

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

    res.status(200).json({
      status: "Success",
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "Tours not found!",
    })
  }
}

exports.getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "Couldn't find tour!",
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: "Success",
      data: newTour,
    })
  } catch (err) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    })

    res.status(200).json({
      status: "Success",
      data: newTour,
    })
  } catch (err) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "Success",
    })
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "Couldn't find tour!",
    })
  }
}

// Data aggregation
exports.getTourStats = async (req, res) => {
  try {
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
      status: "Success",
      data: {
        stats,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err,
    })
  }
}
