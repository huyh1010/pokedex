require("dotenv").config();
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.static("public"));
app.use("/", indexRouter);
// app.use('/users', usersRouter);

app.use((req, res, next) => {
  const err = new Error(`Path not found`);
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});

module.exports = app;
