const fs = require("fs");
const express = require("express");
const morgan = require('morgan')

const app = express();

// Use Morgan logging middleware
app.use(morgan('dev'))

// express.json middleware
app.use(express.json());

// File Reading
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))

// Route handlers
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

// Users route handlers
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    results: Array.isArray(users) ? users.length : 0,
    data: {
      users
    }
  })
}

const createUser = (req, res) => {
  if (!req.body) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    });
    return;
  }

  const id = crypto.randomUUID()
  const newUser = {...req.body, _id: id}

  users.push(newUser)
  fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
    console.log('users file updated successfully')
  })

  res.status(201).json({
    status: "Success",
    data: {
      user: newUser
    }
  })
}

const getSingleUser = (req, res) => {
  const id = req.params.id
  const user = users.find(u => u._id === id)

  if(!user) {
    res.status(404).json({
      status: "Not Found",
      message: "User not found!",
    })
    return
  }

  res.status(200).json({
    status: "Success", 
    data: {
      user
    }
  })
}

const updateUser = (req, res) => {
  const id = req.params.id
  const user = users.find(u => u._id === id)

  if(!user) {
    res.status(404).json({
      status: "Not Found",
      message: "User not found!",
    })
    return
  }

  if (!req.body) {
    res.status(400).json({
      status: "Bad Request",
      message: "malformed/missing request data",
    });
    return;
  }

  const newUser = {...user, ...req.body}
  const newUsers = users.map(u => u._id === id ? newUser : u)

  fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(newUsers), err => {
    console.log('users file updated successfully')
  })

  res.status(200).json({
    status: "Success",
    data: newUser,
  });
}

const deleteUser = (req, res) => {
  const id = req.params.id
  const user = users.find(u => u._id === id)

  if(!user) {
    res.status(404).json({
      status: "Not Found",
      message: "User not found!",
    })
    return
  }

  const newUsers = users.filter(u => u._id !== id)

  fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(newUsers), err => {
    console.log('user deleted successfully')
  })

  res.status(204).json({
    status: "Success",
  });
}

// tours
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getSingleTour);
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id").get(getSingleTour).patch(updateTour).delete(deleteTour);
app.route("/api/v1/users").get(getAllUsers).post(createUser)
app.route("/api/v1/users/:id").get(getSingleUser).patch(updateUser).delete(deleteUser)

// starting the server
app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
