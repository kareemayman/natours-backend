const fs = require('fs')
const express = require("express");

const app = express();

// express.json middleware
app.use(express.json())

// File Reading
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// Base endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "Success", message: "Base endpoint" });
});

// tours
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "Success",
    results: Array.isArray(tours) ? tours.length : 0,
    data: {
      tours
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  if (!req.body) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data"
    })
    return
  }

  const newId = tours[tours.length - 1].id + 1
  const newTour = {...req.body, id: newId}
  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    console.log("new tour has been written to the file")
  })

  res.status(201).json({
    status: "Success",
    data: newTour
  })
})

// starting the server
app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
