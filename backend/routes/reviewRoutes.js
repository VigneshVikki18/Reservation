import express from "express";
import { 
  createReview, 
  getReviews, 
  updateReview, 
  deleteReview,
  addOwnerResponse 
} from '../controller/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/getreviews/:restaurantId', getReviews);
router.put('/updateReview/:reviewId', updateReview);
router.delete('/deleteReview/:reviewId', deleteReview);
router.put('/addOwnerResponse/:reviewId', addOwnerResponse);

export default router;