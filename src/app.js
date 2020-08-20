const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const ingredientsRouter = require("./ingredients/ingredients-router");
const recipesRouter = require("./recipes/recipes-router");
const reviewsRouter = require("./reviews/reviews-router");
const usersRouter = require("./users/users-router");
const favoritesRouter = require("./favorites/favorites-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api", ingredientsRouter);
app.use("/api", recipesRouter);
app.use("/api", reviewsRouter);
app.use("/api", usersRouter);
app.use("/api", favoritesRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
