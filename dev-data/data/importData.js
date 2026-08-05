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

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

(async () => {
  try {
    await Tour.deleteMany()
    console.log("old tours deleted")
    await Tour.create(tours)
    console.log("tours data added")
  } catch (err) {
    console.log(err)
  }
  process.exit()
})()
