import { Review } from '../models/reviewModel.js';
import mongoose from 'mongoose';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { text, rating, restaurantId } = req.body;
    const newReview = new Review({ text, rating, restaurantId });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// Get reviews for a specific restaurant
export const getReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurantId: Number(restaurantId) });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { text, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};

export const addOwnerResponse = async (req, res) => {
  try {

    console.log("addOwnerResponse");
    const { reviewId } = req.params;
    const { response } = req.body;

    // Validate the review ID format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }

    // Find the review by ID and update the owner response
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ownerResponse: response },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating owner response', error });
  }
};