const express = require("express");
const RecipesService = require("./recipes-service");
const path = require("path");

const recipesRouter = express.Router();
const jsonBodyParser = express.json();

recipesRouter.route("/recipes").get((req, res, next) => {
  RecipesService.getAllRecipes(req.app.get("db"))
    .then((recipes) => {
      res.json(recipes);
    })
    .catch(next);
});

recipesRouter
  .route("/recipes/:recipe_id")
  .all(checkRecipeExists)
  .get((req, res) => {
    RecipesService.getRecipeById(req.app.get("db"), req.params.recipe_id).then(
      (recipe) => {
        res.json(recipe);
      }
    );
  });

recipesRouter
  .route("/recipes/:recipe_id/reviews")
  .all(checkRecipeExists)
  .get((req, res, next) => {
    RecipesService.getReviewsForRecipe(req.app.get("db"), req.params.recipe_id)
      .then((reviews) => {
        res.json(reviews);
      })
      .catch(next);
  });

recipesRouter.route("/users/recipes").post(jsonBodyParser, (req, res, next) => {
  const { id, smoothie_name, smoothie_pic, ingredients, user_id } = req.body;
  const newRecipe = { id, smoothie_name, smoothie_pic, user_id };
  const newRecipeIngredients = ingredients;

  for (const [key, value] of Object.entries({
    ...newRecipe,
    ingredients: newRecipeIngredients,
  }))
    if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });

  RecipesService.insertRecipe(
    req.app.get("db"),
    newRecipe,
    newRecipeIngredients
  )
    .then((recipe) =>
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe)
    )
    .catch(next);
});

/* async/await syntax for promises */
async function checkRecipeExists(req, res, next) {
  try {
    const recipe = await RecipesService.getRecipeById(
      req.app.get("db"),
      req.params.recipe_id
    );

    if (!recipe)
      return res.status(404).json({
        error: { message: "Recipe doesn't exist" },
      });

    res.recipe = recipe;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = recipesRouter;
