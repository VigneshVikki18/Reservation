import express from "express";
import send_reservation from "../controller/reservation.js";
import { getReservations } from "../controller/reservation.js"; // Import the new function

const router = express.Router();

router.post("/send", send_reservation);
router.get("/all", getReservations); // New route to get all reservations

export default router;