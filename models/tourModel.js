const mongoose = require("mongoose")
const slugify = require("slugify")

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "a tour must have a name!"],
      trim: true,
      minlength: [10, "Name must be at least 10 characters"],
      maxlength: [40, "Name must be maximum 40 characters"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be higher than or equal to 1.0"],
      max: [5, "rating must be less than or equal to 5.0"],
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price!"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "ratingsAverage must be higher than or equal to 1.0"],
      max: [5, "ratingsAverage must be less than or equal to 5.0"],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be easy, medium, or difficult",
      },
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
    startLocation: {
      // GeoJSON for geospatial data
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
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
  this.find({ secretTour: mongoose.trusted({ $ne: true }) })
})

tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetToken -passwordResetExpires",
  })
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
