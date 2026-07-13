const fs = require("fs");
const express = require("express");

const app = express();

// express.json middleware
app.use(express.json());

// File Reading
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "Success",
    results: Array.isArray(tours) ? tours.length : 0,
    data: {
      tours,
    },
  });
};

const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    res.status(404).json({
      status: "Not Found",
      message: "Tour not found!",
    });
    return;
  }

  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  if (!req.body) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    });
    return;
  }

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    console.log("new tour has been written to the file");
  });

  res.status(201).json({
    status: "Success",
    data: newTour,
  });
};

const updateTour = (req, res) => {
  if (!req.body) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    });
    return;
  }

  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    res.status(404).json({
      status: "Not Found",
      message: "Tour not found!",
    });
    return;
  }

  const newTour = { ...tour, ...req.body };
  const newTours = tours.map((t) => (t.id === id ? newTour : t));

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
    console.log("Tour has been patched successfully");
  });

  res.status(200).json({
    status: "Success",
    data: newTour,
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    res.status(404).json({
      status: "Not Found",
      message: "Tour not found!",
    });
    return;
  }

  const newTours = tours.filter((t) => t.id !== id);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
    console.log("Tour has been deleted successfully");
  });

  res.status(204).json({
    status: "Success",
  });
};

// tours
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getSingleTour);
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id").get(getSingleTour).patch(updateTour).delete(deleteTour);

// starting the server
app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
