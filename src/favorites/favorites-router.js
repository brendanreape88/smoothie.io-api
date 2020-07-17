const express = require('express')
const path = require('path')
const FavoritesService = require('./favorites-service')

const favoritesRouter = express.Router()
const jsonBodyParser = express.json()

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
      } else {
        return FavoritesService.deleteFavorite(req.app.get('db'), recipeId, userId)
      }
    }).then(
      () => res.json({message: 'success'})
    )
  })

module.exports = favoritesRouter