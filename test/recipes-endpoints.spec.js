const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Recipes Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  beforeEach("clean the table", () => helpers.cleanUp(db));

  afterEach("cleanup", () => helpers.cleanUp(db));

  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/recipes").expect(200, []);
      });
    });

    context("Given there are recipes in the database", () => {
      const testUsers = helpers.makeUsersArray();
      const testIngredients = helpers.makeIngredientsArray();
      const testRecipes = helpers.makeRecipesArray();
      const testRecipesIngredients = helpers.makeRecipesIngredientsArray();

      beforeEach("insert favorites", () => {
        return helpers.cleanUp(db).then(() =>
          db
            .into("users")
            .insert(testUsers)
            .then(() =>
              db
                .into("ingredients")
                .insert(testIngredients)
                .then(() =>
                  db
                    .into("recipes")
                    .insert(testRecipes)
                    .then(() =>
                      db
                        .into("recipes_ingredients")
                        .insert(testRecipesIngredients)
                    )
                )
            )
        );
      });

      it("responds with 200 and all of the recipes", () => {
        const expectedRecipes = [
          {
            id: 1,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 1,
          },
          {
            id: 2,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 2,
          },
          {
            id: 3,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            user_id: 3,
          },
        ];
        return supertest(app).get("/api/recipes").expect(200, expectedRecipes);
      });
    });
  });

  describe(`GET /api/recipes/:recipe_id`, () => {
    context(`Given no recipe`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } });
      });
    });

    context("Given the specified recipe is in the database", () => {
      const testUsers = helpers.makeUsersArray();
      const testIngredients = helpers.makeIngredientsArray();
      const testRecipes = helpers.makeRecipesArray();
      const testRecipesIngredients = helpers.makeRecipesIngredientsArray();

      beforeEach("insert favorites", () => {
        return helpers.cleanUp(db).then(() =>
          db
            .into("users")
            .insert(testUsers)
            .then(() =>
              db
                .into("ingredients")
                .insert(testIngredients)
                .then(() =>
                  db
                    .into("recipes")
                    .insert(testRecipes)
                    .then(() =>
                      db
                        .into("recipes_ingredients")
                        .insert(testRecipesIngredients)
                    )
                )
            )
        );
      });

      it("responds with 200 and the specified recipe", () => {
        const recipeId = 2;
        const expectedRecipe = {
          smoothie: {
            recipe_id: 2,
            smoothie_name: "Test Smoothie",
            smoothie_pic: "Test Picture",
            ingredients: [
              {
                quantity: "10",
                units: "cups",
                title: "test title 1",
                ingredient_id: 1,
              },
              {
                quantity: "100",
                units: "cups",
                title: "test title 2",
                ingredient_id: 2,
              },
              {
                quantity: "1000",
                units: "cups",
                title: "test title 3",
                ingredient_id: 3,
              },
            ],
          },
          user: {
            user_name: "Another Test User",
            user_pic: "Another Test Picture",
            user_id: 2,
          },
        };
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(200, expectedRecipe)
          .then((res) => {
            console.log(res.body);
          });
      });
    });
  });

  describe(`POST /api/users/recipes`, () => {
    const testUsers = helpers.makeUsersArray();
    const testIngredients = helpers.makeIngredientsArray();
    const testRecipes = helpers.makeRecipesArray();
    const testRecipesIngredients = helpers.makeRecipesIngredientsArray();

    beforeEach("insert favorites", () => {
      return helpers.cleanUp(db).then(() =>
        db
          .into("users")
          .insert(testUsers)
          .then(() =>
            db
              .into("ingredients")
              .insert(testIngredients)
              .then(() =>
                db
                  .into("recipes")
                  .insert(testRecipes)
                  .then(() =>
                    db
                      .into("recipes_ingredients")
                      .insert(testRecipesIngredients)
                  )
              )
          )
      );
    });

    it(`creates a recipe, responding with 201 and the new recipe`, function () {
      const newRecipe = {
        smoothie_name: "Unique Test Smoothie",
        smoothie_pic: "nothing here",
        ingredients: [{ quantity: 1, units: "cup", ingredient_id: 1 }],
        user_id: 2,
        id: 500,
      };
      return supertest(app)
        .post("/api/users/recipes")
        .send(newRecipe)
        .expect(201, [500]);
    });

    const requiredFields = [
      "smoothie_name",
      "smoothie_pic",
      "ingredients",
      "user_id",
    ];

    requiredFields.forEach((field) => {
      const newRecipe = {
        smoothie_name: "Test Smoothie",
        smoothie_pic: "no picture",
        user_id: 2,
        id: 5,

        ingredients: [{ quantity: "1", units: "cup", ingredient_id: 35 }],
      };

      delete newRecipe[field];

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        return supertest(app)
          .post("/api/users/recipes")
          .send(newRecipe)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });
});
