const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  "<DB_PASSWORD>",
  process.env.MONGODB_PASSWORD,
)

mongoose
  .connect(DB)
  .then((con) => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection error:", err))

const fs = require("fs")
const Tour = require("../../models/tourModel")
const User = require("../../models/userModel")
const Review = require("../../models/reviewModel")

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours.json", "utf-8"))
const users = JSON.parse(fs.readFileSync("./dev-data/data/users.json", "utf-8"))
const reviews = JSON.parse(fs.readFileSync("./dev-data/data/reviews.json", "utf-8"))

;(async () => {
  try {
    await Tour.deleteMany()
    console.log("old tours deleted")
    await User.deleteMany()
    console.log("old users deleted")
    await Review.deleteMany()
    console.log("old reviews deleted")
    await Tour.create(tours)
    console.log("tours data added")
    await User.create(users, { validateBeforeSave: false })
    console.log("users data added")
    await Review.create(reviews)
    console.log("reviews data added")
  } catch (err) {
    console.log(err)
  }
  process.exit()
})()
