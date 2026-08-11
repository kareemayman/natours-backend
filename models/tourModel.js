const mongoose = require("mongoose")
const slugify = require("slugify")

const tourSchema = new mongoose.Schema(
  {
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
      default: Date.now,
      select: false, // Hide this field and only use internally
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true })
})

// QUERY MIDDLEWARE: runs before queries
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } })
})

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})

// Virtual property: durationWeeks
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour
