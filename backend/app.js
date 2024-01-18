require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// Route files
const userRoutes = require("./routes/user_routes");
const artRoutes = require("./routes/art_routes");
const orderRoutes = require("./routes/order_routes");
const bidRoutes = require("./routes/bid_routes");
const { verifyUser } = require("./middlewares/auth");
const cors = require("cors");

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`connected to ${MONGODB_URI}`);
  })
  .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello Node");
});

app.use("/api/users", userRoutes);
app.use("/api/arts", artRoutes);
app.use("/api/bids", verifyUser, bidRoutes);
app.use("/api/orders", verifyUser, orderRoutes);
// app.use(verifyUser);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).json({ error: err.message });
  } else if (err.message === "File format not supported.") {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//unknown path
app.use((req, res) => {
  res.status(404).json({ error: "path not found" });
});

module.exports = app;