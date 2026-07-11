const fs = require('fs')
const express = require("express");

const app = express();

// express.json middleware
app.use(express.json())

// File Reading
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// Base endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Base endpoint" });
});

// tours
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: Array.isArray(tours) ? tours.length : 0,
    data: {
      tours
    },
  });
});

// starting the server
app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
