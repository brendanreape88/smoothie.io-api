const ReviewsService = {
    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('reviews')
            .returning('*')
    }
}

module.exports = ReviewsService