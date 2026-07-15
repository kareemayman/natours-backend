const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "Success",
    results: Array.isArray(tours) ? tours.length : 0,
    data: {
      tours,
    },
  });
};

exports.getSingleTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    console.log("new tour has been written to the file");
  });

  res.status(201).json({
    status: "Success",
    data: newTour,
  });
};

exports.updateTour = (req, res) => {
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

  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
    console.log("Tour has been patched successfully");
  });

  res.status(200).json({
    status: "Success",
    data: newTour,
  });
};

exports.deleteTour = (req, res) => {
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

  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
    console.log("Tour has been deleted successfully");
  });

  res.status(204).json({
    status: "Success",
  });
};