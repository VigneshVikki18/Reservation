import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId instead of Number
    required: true,
  },
  ownerResponse: {
    type: String,
    default: 'Thank you for your feedback!'
  }
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);