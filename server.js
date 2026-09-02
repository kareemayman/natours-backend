const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  "<DB_PASSWORD>",
  process.env.MONGODB_PASSWORD,
)

mongoose.connect(DB).then((con) => console.log("Connected to MongoDB Atlas"))

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Backend server is running on port 3000")
})

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message)
  // shut the server gracefully first then end the application
  server.close(() => {
    process.exit(1) // code 1 for uncalled exception
  })
})
