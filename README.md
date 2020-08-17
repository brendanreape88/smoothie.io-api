# Smoothie.io

**Live:** https://damp-forest-34882.herokuapp.com/

**Endpoint:** https://damp-forest-34882.herokuapp.com/api

### Users:

Send a GET request to /users to get all of our users.

---

### Ingredients:

Send a GET request to /ingredients to get all of our ingredients.

Send a POST request to /ingredients to insert a new ingredient into the database. Please use the format below:

{
"title": “rice milk”,
"category": “liquids”
}

---

### Recipes:

Send a GET request to /recipes to get all of our recipes.

Send a GET request to /recipes/:recipe_id to get a particular recipe.

Send a POST request to /users/recipes to post a new recipe to our database. Please use the format below:

{
"smoothie_name": "Smoothie Name",
"smoothie_pic": "Picture URL",
"user_id": "10",

    "ingredients": [

            {"quantity": "1", "units": "cup", "ingredient_id": 35},
            {"quantity": "1", "units": "whole", "ingredient_id": 33},
            {"quantity": "3", "units": "leaves", "ingredient_id": 60}

        ]

}

---

### Reviews:

Send a GET request to /recipes/:recipe_id/reviews to get all of the reviews for a particular recipe.

Send a POST request to /users/reviews to post a new review for a particular recipe. Please use the format below:

{
"recipe_id": "10",
"user_id": "10",
"headline": "Review Headline",
"review": "Wow, what an amazing smoothie!"
}

---

### Favorites:

Send a GET request to /users/:user_id/favorites to get all the favorites for a particular user.

Send a POST request to /users/favorites to add a new favorite to the database. Please use the format below:

{
"user_id": "1",
"recipe_id": "3"
}
