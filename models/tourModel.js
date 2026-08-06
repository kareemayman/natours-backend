const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "a tour must have a name!"],
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "a tour must have a price!"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: [String],
  startDates: [Date],
  duration: {
    type: Number,
    required: [true, "a tour must have a duration!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "a tour must have maxGroupSize"],
  },
  difficulty: {
    type: String,
    required: [true, "a tour must have difficulty"],
  },
  summary: {
    type: String,
    required: [true, "a tour must have a summary"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "a tour must have imageCover"],
  },
  priceDiscount: Number,
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour
