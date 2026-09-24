const Review = require("../models/reviewModel")
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError")
const Tour = require("../models/tourModel")
const factory = require("./handlerFactory")

// Gets all reviews or reviews for a specific tour
exports.getReviews = async (req, res, next) => {
  const query = req.params.tourId ? { tour: req.params.tourId } : {}

  const features = new APIFeatures(Review.find(query), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  let reviews

  // If a tourId is provided, we don't need to populate the tour field since we already know which tour it is
  if (req.params.tourId) {
    reviews = await features.query
  } else {
    reviews = await features.query.populate("tour")
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  })
}

exports.createReview = async (req, res, next) => {
  if ((await Tour.findById(req.params.tourId)) === null)
    return next(new AppError("No tour found with that ID", 404))

  if (!req.body) return next(new AppError("Please provide review data", 400))

  const reviewData = {
    ...req.body,
    tour: req.params.tourId,
    user: req.userId,
  }

  const review = await Review.create(reviewData)

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  })
}

exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.getSingleReview = factory.getOne(Review, "tour")
