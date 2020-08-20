const express = require("express");
const path = require("path");
const FavoritesService = require("./favorites-service");

const favoritesRouter = express.Router();
const jsonBodyParser = express.json();

favoritesRouter.route("/users/:user_id/favorites").get((req, res) => {
  FavoritesService.getFavoritesForUser(
    req.app.get("db"),
    req.params.user_id
  ).then((recipe) => {
    res.json(recipe);
  });
});

favoritesRouter.route("/users/favorites").post(jsonBodyParser, (req, res) => {
  const userId = req.body.user_id;
  const recipeId = req.body.recipe_id;

  FavoritesService.findFavorite(req.app.get("db"), recipeId, userId)
    .then((f) => {
      if (!f || f.length === 0) {
        return FavoritesService.insertFavorite(
          req.app.get("db"),
          recipeId,
          userId
        ).then((results) => {
          return FavoritesService.addRecipeToFavorite(
            req.app.get("db"),
            results[0].recipe_id,
            results[0].user_id
          )
            .then((favorite) => {
              let { fav_user_id: _, ...newFavorite } = favorite[0];
              newFavorite.user_id = favorite[0].fav_user_id;
              return res
                .status(201)
                .json({ message: "success", favorite: newFavorite });
            })
            .catch((error) => {
              res.status(500).json({ message: error });
            });
        });
      } else {
        return FavoritesService.deleteFavorite(
          req.app.get("db"),
          recipeId,
          userId
        ).then(() => res.status(201).json({ message: "success" }));
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

module.exports = favoritesRouter;
