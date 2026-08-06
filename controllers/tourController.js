const Tour = require("../models/tourModel")
const fs = require("fs")

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query }
    const excludedFields = ["sort", "limit", "page", "fields"]
    excludedFields.forEach((f) => delete queryObj[f])

    // Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    let query = Tour.find(JSON.parse(queryString))

    // Sorting
    if (req.query.sort) {
      const sortString = req.query.sort.split(",").join(" ")
      query = query.sort(sortString)
    } else {
      // Default behavior: sort by createdAt in descending order
      query = query.sort("-createdAt")
    }

    // Projection/Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // Pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const totalTours = await Tour.countDocuments()
      if (skip >= totalTours) {
        throw new Error("Page not found!")
      }
    }

    // Executing the query
    const tours = await query

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
