const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Ingredients Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => helpers.cleanUp(db));

  afterEach("cleanup", () => helpers.cleanUp(db));

  describe(`GET /api/ingredients`, () => {
    context(`Given no ingredients`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/ingredients").expect(200, []);
      });
    });

    context("Given there are ingredients in the database", () => {
      const testIngredients = helpers.makeIngredientsArray();
      const expectedIngredients = [
        { id: 1, title: "test title 1", category: "test category 1" },
        { id: 2, title: "test title 2", category: "test category 2" },
        { id: 3, title: "test title 3", category: "test category 3" },
      ];

      beforeEach("insert ingredients", () => {
        return db.into("ingredients").insert(testIngredients);
      });

      it("responds with 200 and all of the ingredients", () => {
        return supertest(app)
          .get("/api/ingredients")
          .expect(200, expectedIngredients);
      });
    });
  });

  describe(`POST /api/ingredients`, () => {
    it(`creates an ingredient, responding with 201 and all of the ingredients`, function () {
      this.retries(3);
      const newIngredient = {
        title: "Test Ingredient",
        category: "Test Category",
      };
      return supertest(app)
        .post("/api/ingredients")
        .send(newIngredient)
        .expect(201)
        .expect((res) => {
          console.log("#########################", res.body);
          expect(res.body[0].title).to.eql(newIngredient.title);
          expect(res.body[0].category).to.eql(newIngredient.category);
          //expect(actual).to.eql(expected)
        })
        .then((postRes) =>
          supertest(app).get(`/api/ingredients`).expect(postRes.body)
        );
    });

    const requiredFields = ["title", "category"];

    requiredFields.forEach((field) => {
      const newIngredient = {
        title: "Test Ingredient",
        category: "Test Category",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newIngredient[field];

        return supertest(app)
          .post("/api/ingredients")
          .send(newIngredient)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });
});
