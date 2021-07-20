const express = require("express");
const NotFoundError = require("./errors/NotFoundError");
const log = require("./lib/logger");
const morgan = require("morgan");

const app = express();

app.use(morgan("combined"));

app.use(express.json());

app.use("/users", require("./routes/users"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new NotFoundError("Resource not found"));
});

// global error handler
app.use(function (err, req, res, next) {
  log.error("Error", {
    err,
  });
  res.status(err.errorStatusCode || 500).json({
    error: err.message,
  });
});

module.exports = app;
