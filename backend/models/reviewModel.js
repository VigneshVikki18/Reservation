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
    type: Number,
    required: true,
    
  },
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);
