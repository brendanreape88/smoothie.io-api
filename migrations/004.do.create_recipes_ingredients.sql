CREATE TABLE recipes_ingredients (
    recipe_id INTEGER 
        REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    ingredient_id INTEGER 
        REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
    quantity TEXT NOT NULL,
    units TEXT NOT NULL
);