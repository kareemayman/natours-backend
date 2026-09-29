const mongoose = require("mongoose")
const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "You must provide review message"],
    },
    rating: {
      type: Number,
      min: [1, "rating must be higher than or equal to 1.0"],
      max: [5, "rating must be less than or equal to 5.0"],
      required: [true, "You must provide rating"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // use internally
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// static methods point to the model itself, not the document instance. So we can use this keyword to refer to the model in static methods
reviewSchema.statics.getReviewStats = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ])

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  })
}

reviewSchema.post("save", async function () {
  // this points towards current review document
  await this.constructor.getReviewStats(this.tour)
})

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name photo",
  })
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
