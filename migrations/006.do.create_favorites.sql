CREATE TABLE favorites (
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    recipe_id INTEGER
        REFERENCES recipes(id) ON DELETE CASCADE NOT NULL
);