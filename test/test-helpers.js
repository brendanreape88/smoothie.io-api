function truncateAll(db, ...tables) {
    let p = Promise.resolve(true);

    for (const t of tables) {
        p = p.then(() => db.raw(`TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE`));
    }

    return p;
}

const cleanUp = (db) => truncateAll(db, ['users', 'recipes', 'ingredients', 'favorites', 'reviews', 'recipes_ingredients']);

function makeFavoritesArray() {
    return [
        {
            recipe_id: 1,
            user_id: 1,
        },
        {
            recipe_id: 2,
            user_id: 1,
        },
        {
            recipe_id: 3,
            user_id: 1,
        },
    ]
}

function makeIngredientsArray() {
    return [
        {
           title: "test title 1",
           category: "test category 1"
        },
        {
            title: "test title 2",
            category: "test category 2"
        },
        {
            title: "test title 3",
            category: "test category 3"
        },
    ]
}

function makeRecipesArray() {
    return [
        {
            id: 1,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 1
        },
        {
            id: 2,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 2
        },
        {
            id: 3,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 3
        },
    ]
}

function makeReviewsArray() {
    return [
        {
            headline: "Test Headline",
            review: "Test Review.",
            recipe_id: 1,
            user_id: 1,
        },
        {
            headline: "Another Test Headline",
            review: "Another Test Review.",
            recipe_id: 1,
            user_id: 2,
        },
        {
            headline: "One More Test Headline",
            review: "One More Test Review.",
            recipe_id: 2,
            user_id: 2
        }
    ]
}

function makeUsersArray() {
    return [
        {
            "id": 1,
            "user_name": "Test User",
            "user_pic": "Test Picture",
            "password": "Test Password"
        },
        {
            "id": 2,
            "user_name": "Another Test User",
            "user_pic": "Another Test Picture",
            "password": "Another Test Password"
        },
        {
            "id": 3,
            "user_name": "One More Test User",
            "user_pic": "One More Test Picture",
            "password": "One More Test Password"
        },
    ]
}

function makeRecipesIngredientsArray() {
    return [
        {
            quantity: "10",
            units: "cups",
            recipe_id: 2,
            ingredient_id: 1
        },
        {
            quantity: "100",
            units: "cups",
            recipe_id: 2,
            ingredient_id: 2
        },
        {
            quantity: "1000",
            units: "cups",
            recipe_id: 2,
            ingredient_id: 3
        }
    ]
}

module.exports = {
    makeFavoritesArray,
    makeIngredientsArray,
    makeRecipesArray,
    makeUsersArray,
    makeReviewsArray,
    makeRecipesIngredientsArray,
    cleanUp,
}
