const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Favorites Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => helpers.cleanUp(db))

  const testFavorites = helpers.makeFavoritesArray()
        const testRecipes = helpers.makeRecipesArray()
        const testUsers = helpers.makeUsersArray()
        
        beforeEach('insert favorites', () => {
            return db.into('users').insert(testUsers).then(
              () => db.into('recipes').insert(testRecipes).then(
                () => db.into('favorites').insert(testFavorites)
              )
            )
        })

  afterEach('cleanup',() => helpers.cleanUp(db))

  describe(`GET /api/users/:user_id/favorites`, () => {
    context(`Given no favorites`, () => {
      it(`responds with 200 and an empty list`, () => {
        const user_id = 12321 
        return supertest(app)
          .get(`/api/users/${user_id}/favorites`)
          .expect(200, [])
      })
    })

    context('Given there are favorites in the database', () => {
      it('responds with 200 and all the favorites for the user', () => {
          const user_id = 1
          const expectedFavorites = [
            {recipe_id: 1, user_id: 1, id: 1, smoothie_name: 'Test Smoothie', smoothie_pic: 'Test Picture'},
            {recipe_id: 2, user_id: 2, id: 2, smoothie_name: 'Test Smoothie', smoothie_pic: 'Test Picture'},
            {recipe_id: 3, user_id: 3, id: 3, smoothie_name: 'Test Smoothie', smoothie_pic: 'Test Picture'}
          ];
          return supertest(app)
              .get(`/api/users/${user_id}/favorites`)
              .expect(200, expectedFavorites)
      })
    })

  })

  describe(`POST /api/users/favorites`, (done) => {
      it(`creates a favorite, responding with 201 and the new favorite`, function() {
          this.retries(3)
          const newFavorite = {
              recipe_id: 1,
              user_id: 2
          }
          return supertest(app)
            .post('/api/users/favorites')
            .send(newFavorite)
            .expect(201)
            .expect(res => {
              console.log('###############################', res.body)
                expect(res.body.favorite.recipe_id).to.eql(newFavorite.recipe_id)
                expect(res.body.favorite.user_id).to.eql(newFavorite.user_id)
            })
            .then(done)
      })
  })

}) 