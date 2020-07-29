const express = require('express')
const path = require('path')
const FavoritesService = require('./favorites-service')

const favoritesRouter = express.Router()
const jsonBodyParser = express.json()

favoritesRouter
  .route('/users/:user_id/favorites')
  .get((req, res) => {
    FavoritesService.getFavoritesForUser(req.app.get('db'), req.params.user_id)
      .then(recipe => {
        res.json(recipe)
      })
  })

favoritesRouter
  .route('/users/favorites')
  .post(jsonBodyParser, (req, res) => {
    const userId = req.body.user_id
    const recipeId = req.body.recipe_id

    FavoritesService.findFavorite(
      req.app.get('db'),
      recipeId,
      userId
    )
    .then(f => {
      if(!f || f.length === 0) {
        return FavoritesService.insertFavorite(req.app.get('db'), recipeId, userId)
        .then(results => {
            console.log(results)
            return FavoritesService.addRecipeToFavorite(req.app.get('db'), results[0].recipe_id, results[0].user_id)
            .then(favorite => {
              console.log(favorite)
              return res.json({message: 'success', favorite: favorite[0]})
            })
        })
      } else {
        return FavoritesService.deleteFavorite(req.app.get('db'), recipeId, userId)
        .then(
            () => res.json({message: 'success'})
        )
      }
    })
  })

module.exports = favoritesRouter