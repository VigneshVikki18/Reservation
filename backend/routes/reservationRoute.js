import express from "express";
import send_reservation from "../controller/reservation.js";
import { getReservations } from "../controller/reservation.js";
import { checkReservation } from '../controller/reservation.js';


import { checkReservationExists } from '../controller/reservation.js';

import { protect } from "../middlewares/authMiddleware.js";

 // Import the new function

const router = express.Router();

router.post("/send", send_reservation);
router.get("/all", getReservations);
// In routes/reservationRoutes.js or similar
router.get("/check/:restaurantId", protect, checkReservation);
 
router.get('/check', checkReservationExists);




export default router;