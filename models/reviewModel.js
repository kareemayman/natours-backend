// review, rating, createdAt, ref to tour, ref to user
const mongoose = require("mongoose")

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

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name photo",
  })
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
