const FavoritesService = {
    findFavorite(db, recipeId, userId) {
        return db
          .from('favorites')
          .where({user_id: userId, recipe_id: recipeId})
    },

    insertFavorite(db, recipeId, userId) {
        return db
          .insert({user_id: userId, recipe_id: recipeId})
          .into('favorites')
          .returning('*')
    },

    deleteFavorite(db, recipeId, userId) {
        return db('favorites')
          .where({user_id: userId, recipe_id: recipeId})
          .del()
    }
}

module.exports = FavoritesService