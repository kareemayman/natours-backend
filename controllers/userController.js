const fs = require("fs");

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    results: Array.isArray(users) ? users.length : 0,
    data: {
      users
    }
  })
}

exports.createUser = (req, res) => {
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
  fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(users), err => {
    console.log('users file updated successfully')
  })

  res.status(201).json({
    status: "Success",
    data: {
      user: newUser
    }
  })
}

exports.getSingleUser = (req, res) => {
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

exports.updateUser = (req, res) => {
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

  fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(newUsers), err => {
    console.log('users file updated successfully')
  })

  res.status(200).json({
    status: "Success",
    data: newUser,
  });
}

exports.deleteUser = (req, res) => {
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

  fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(newUsers), err => {
    console.log('user deleted successfully')
  })

  res.status(204).json({
    status: "Success",
  });
}