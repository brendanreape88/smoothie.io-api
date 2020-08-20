const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Reviews Endpoints", function () {
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

  const testReviews = helpers.makeReviewsArray();
  const testRecipes = helpers.makeRecipesArray();
  const testUsers = helpers.makeUsersArray();

  beforeEach("insert reviews", () => {
    return db
      .into("users")
      .insert(testUsers)
      .then(() =>
        db
          .into("recipes")
          .insert(testRecipes)
          .then(() => db.into("reviews").insert(testReviews))
      )
      .catch(console.log);
  });

  afterEach("cleanup", () => helpers.cleanUp(db));

  describe(`GET /api/recipes/:recipe_id/reviews`, () => {
    context(`Given no reviews`, () => {
      it(`responds with 200 and an empty list`, () => {
        const recipe_id = 3;
        return supertest(app)
          .get(`/api/recipes/${recipe_id}/reviews`)
          .expect(200, []);
      });
    });

    context("Given there are reviews in the database", () => {
      it("responds with 200 and all the reviews for the recipe", () => {
        const recipe_id = 1;
        const exprectedReviews = [
          {
            headline: "Test Headline",
            review: "Test Review.",
            user_id: 1,
            user_name: "Test User",
            user_pic: "Test Picture",
          },
          {
            headline: "Another Test Headline",
            review: "Another Test Review.",
            user_id: 2,
            user_name: "Another Test User",
            user_pic: "Another Test Picture",
          },
        ];
        return supertest(app)
          .get(`/api/recipes/${recipe_id}/reviews`)
          .expect(200, exprectedReviews);
      });
    });
  });

  describe(`POST /api/users/reviews`, (done) => {
    it(`creates a review, responding with 201 and the new review`, function () {
      this.retries(3);
      const newReview = {
        recipe_id: 3,
        user_id: 2,
        headline: "Wow, a cool test review!",
        review: "Yup, it's a test!",
      };
      return supertest(app)
        .post("/api/users/reviews")
        .send(newReview)
        .expect(201)
        .expect((res) => {
          console.log("55555555555555RESBODY555555555555", res.body[0]);
          expect(res.body[0].recipe_id).to.eql(newReview.recipe_id);
          expect(res.body[0].user_id).to.eql(newReview.user_id);
          expect(res.body[0].headline).to.eql(newReview.headline);
          expect(res.body[0].review).to.eql(newReview.review);
        });
    });
  });
});
