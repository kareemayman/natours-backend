const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "yes we're here" });
});

app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
