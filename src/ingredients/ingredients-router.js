const express = require("express");
const path = require("path");
const IngredientsService = require("./ingredients-service");

const ingredientsRouter = express.Router();
const jsonBodyParser = express.json();

ingredientsRouter
  .route("/ingredients")
  .get((req, res, next) => {
    IngredientsService.getAllIngredients(req.app.get("db"))
      .then((ingredients) => {
        res.json(ingredients);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, category } = req.body;
    const newIngredient = { title, category };

    for (const [key, value] of Object.entries(newIngredient))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    IngredientsService.insertIngredient(req.app.get("db"), newIngredient)
      .then((ingredient) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
          .json(ingredient);
      })
      .catch(next);
  });

module.exports = ingredientsRouter;
