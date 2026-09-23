const Tour = require("../models/tourModel")
const factory = require("./handlerFactory")

exports.getAllTours = factory.getAll(Tour)
exports.getSingleTour = factory.getOne(Tour)
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

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
