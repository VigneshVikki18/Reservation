const express = require('express');
const { createReview, getReviews, updateReview, deleteReview } = require('../controller/reviewController');

const router = express.Router();

// Route to create a new review
router.post('/', createReview);

// Route to get all reviews for a specific restaurant
router.get('/:restaurantId', getReviews);

// Route to update a specific review
router.put('/:reviewId', updateReview);

// Route to delete a specific review
router.delete('/:reviewId', deleteReview);

module.exports = router;