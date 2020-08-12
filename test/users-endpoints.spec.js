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


  const testUsers = helpers.makeUsersArray()
        
    beforeEach('insert users', () => {
        return db.into('users').insert(testUsers)
    })

  afterEach('cleanup',() => helpers.cleanUp(db))

  describe(`GET /api/users/:user_id`, () => {
    context(`Given no user with id`, () => {
      it(`responds with 200 and an empty list`, () => {
        const user_id = 12321 
        return supertest(app)
          .get(`/api/users/${user_id}/favorites`)
          .expect(200, [])
      })
    })

    context('Given there are users in the database', () => {
        it('responds with 200 and the data for the user', () => {
            const user_id = 1
            return supertest(app)
                .get(`api/users/${user_id}/favorites`)
                .expect(200, [])
        })
    })

  })
})