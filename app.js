const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./api/routes/user.routes");
const toyRoutes = require("./api/routes/toy.routes");

const globalErrorHandler = require("./api/utils/errorHandler")
const AppError = require("./api/utils/AppError");

const app = express();
app.use(express.static(path.join(__dirname,"public")))

app.use(express.json());
app.use(cors());

app.use("/api/v1/toys", toyRoutes);
app.use("/api/v1/users", userRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(404, "The requested resource not exist on this server"));
});

app.use(globalErrorHandler);

module.exports.app = app;
