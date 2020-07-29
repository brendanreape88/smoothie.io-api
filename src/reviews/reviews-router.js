const express = require('express')
const path = require('path')
const ReviewsService = require('./reviews-service')

const reviewsRouter = express.Router()
const jsonBodyParser = express.json()

reviewsRouter
  .route('/users/reviews')
  .post(jsonBodyParser, (req, res, next) => { console.log("reviews data: ", req.body);
    const { headline, review, recipe_id, user_id } = req.body
    const newReview = { headline, review, recipe_id, user_id }

    for (const [key, value] of Object.entries(newReview))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    ReviewsService.insertReview(
      req.app.get('db'),
      newReview
    )
      .then(review => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(review)
      })
      .catch(next)
    })

module.exports = reviewsRouter