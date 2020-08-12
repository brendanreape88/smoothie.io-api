const FavoritesService = {
    getFavoritesForUser(db, user_id) {
        return db
          .from('favorites')
          .select('recipe_id', 'favorites.user_id')
          .where('favorites.user_id', user_id)
          .join('recipes', 'recipes.id', '=', 'favorites.recipe_id')
          .select('*')
    },

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
    },

    addRecipeToFavorite(db, recipe_id, user_id) {
        return db
          .from('favorites')
          .select('favorites.recipe_id', {fav_user_id: 'favorites.user_id'})
          .where({'favorites.recipe_id': recipe_id, 'favorites.user_id': user_id})
          .join('recipes', 'recipes.id', '=', 'favorites.recipe_id')
          .select('*')
    }
}

module.exports = FavoritesService