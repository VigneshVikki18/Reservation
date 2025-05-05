import express from "express";
import { 
  createReview, 
  getReviews, 
  updateReview, 
  deleteReview,
  addOwnerResponse ,
  checkUserReservation
} from '../controller/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { Reservation } from '../models/reservation.js';





const router = express.Router();

router.post('/', createReview);
router.get('/getreviews/:restaurantId', getReviews);
router.put('/updateReview/:reviewId', updateReview);
router.delete('/deleteReview/:reviewId', deleteReview);
router.put('/addOwnerResponse/:reviewId', addOwnerResponse);
router.get('/check-reservation/:restaurantId', protect, checkUserReservation);
router.get('/check-reservation/:restaurantId/:userId', async (req, res) => {
  const { restaurantId, userId } = req.params;

  const hasReservation = await Reservation.findOne({
    restaurantId,
    userId
  });

  res.json({ hasReservation: !!hasReservation });
});



export default router;