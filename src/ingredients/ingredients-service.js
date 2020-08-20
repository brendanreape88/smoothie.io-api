const IngredientsService = {
  getAllIngredients(db) {
    return db
      .from("ingredients")
      .select("ingredients.id", "ingredients.title", "ingredients.category");
  },

  insertIngredient(db, newIngredient) {
    return db.insert(newIngredient).into("ingredients").returning("*");
  },
};

module.exports = IngredientsService;
