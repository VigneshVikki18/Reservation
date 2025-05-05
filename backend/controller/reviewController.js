import { Review } from '../models/reviewModel.js';
import { Reservation } from '../models/reservation.js';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';


// Create a new review
export const createReview = async (req, res) => {
  try {
    const { text, rating, restaurantId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    // Validate restaurantId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode token
    const userId = decoded.id;  // Get the current user ID
      
    const hasReservation = await Reservation.exists({
      restaurantId,
      userId
    }); 
    if (!hasReservation) {
      return res.status(403).json({ message: 'You can only review restaurants you have booked.' });
    } 

    const newReview = new Review({ text, rating,  restaurantId,userId, });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });



  }
};

// Get reviews for a specific restaurant

export const getReviews = async (req, res) => {
  const { restaurantId } = req.params;

  // Validate MongoDB ObjectId
  if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurant ID" });
  }

  try {
    const reviews = await Review.find({ restaurantId })
      .populate('userId', 'email');
    
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
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

// Add owner response
export const addOwnerResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }

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



export const checkUserReservation = async (req, res) => {
  try {
    const userId = req.user._id;
    const restaurantId = req.params.restaurantId;

    const reservation = await Reservation.findOne({
      user: userId,
      restaurant: restaurantId,
    });

    if (reservation) {
      return res.status(200).json({ hasReservation: true });
    } else {
      return res.status(200).json({ hasReservation: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error checking reservation' });
  }
};



