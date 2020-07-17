const xss = require('xss')

function adaptSmoothieInfo(rows) {
  if (!rows.length)
    return null;
  const { recipe_id, smoothie_name, smoothie_pic, user_name, user_pic, user_id } = rows[0];
  const res = {
    smoothie: { recipe_id, smoothie_name, smoothie_pic, ingredients: [] },
    user: { user_name, user_pic, user_id }
  }
  for (const row of rows) {
    const { quantity, units, title, ingredient_id } = row;
    res.smoothie.ingredients.push({ quantity, units, title, ingredient_id })
  }
  return res;
}

const RecipesService = {
  getAllRecipes(db) {
    return db
      .from('recipes')
      .select(
        'recipes.id',
        'recipes.smoothie_name',
        'recipes.smoothie_pic',
        'recipes.user_id'
      )
  },

  getUserRecipes(db, id) {
      return db
        .from('recipes')
        .select(
            'recipes.id',
            'recipes.smoothie_name',
            'recipes.smoothie_pic',
            'recipes.user_id'
      )
      .where('user_id', id)
  },

  getRecipeById(db, id) {
    return db
        .from('recipes')
        .select(
            'recipes.id AS recipe_id',
            'recipes.smoothie_name',
            'recipes.smoothie_pic'
        )
        .where('recipes.id', id)
        .join('users', 'users.id', '=', 'recipes.user_id')
        .select('user_name', 'user_pic', 'users.id AS user_id')
        .join('recipes_ingredients', 'recipes_ingredients.recipe_id', '=', 'recipes.id')
        .select('quantity', 'units')
        .join('ingredients', 'ingredients.id', '=', 'recipes_ingredients.ingredient_id')
        .select('title', 'ingredients.id AS ingredient_id')
        .then(adaptSmoothieInfo)
  },

  getReviewsForRecipe(db, id) {
    return db
      .from('reviews')
      .select('headline', 'review')
      .where('reviews.recipe_id', id)
      .join('users', 'users.id', '=', 'reviews.user_id')
      .select('user_name', 'user_pic')
  },

  insertRecipe(db, newRecipe, newRecipeIngredients) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('recipes.id')
        .then(function(response) {
          let ingredients = newRecipeIngredients.map(recipeIngredient => {
              recipeIngredient.recipe_id = response[0];
              return recipeIngredient;
          });
          
          console.log(ingredients);

          return db
            .insert(ingredients)
            .into('recipes_ingredients')
            .then(() => {return response;});

     })    
  }

}

module.exports = RecipesService