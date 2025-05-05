import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import jwt from 'jsonwebtoken';

const send_reservation = async (req, res, next) => {
  const { userId, restaurantId, firstName, lastName, email, date, time, phone } = req.body;

  if (!userId || !restaurantId || !firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    await Reservation.create({ userId, restaurantId, firstName, lastName, email, date, time, phone });
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }
    return next(error);
  }
};




export const createReservation = async (req, res) => {
  
    const { userId, restaurantId, firstName, lastName, email, date, time, phone } = req.body;

    if (!userId || !restaurantId) {
      return res.status(400).json({ message: "User ID and Restaurant ID are required" });
    }
    try {
    const newReservation = new Reservation({
      userId,
      restaurantId,
      firstName,
      lastName,
      email,
      date,
      time,
      phone
    });

    await newReservation.save();
    res.status(201).json({ message: "Reservation created successfully", newReservation });
  } catch (error) {
    console.error("Reservation creation error:", error);
    res.status(500).json({ message: "Failed to create reservation", error });
  }
};


// New function to get all reservations
export const getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};


export const checkReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.params;

    const existing = await Reservation.findOne({ userId, restaurantId });

    res.status(200).json({ hasReservation: !!existing });
  } catch (error) {
    console.error("Check reservation error:", error);
    res.status(500).json({ message: "Server error checking reservation." });
  }
};






export const checkReservationExists = async (req, res) => {
  const { userId, restaurantId } = req.query;

  if (!userId || !restaurantId) {
    return res.status(400).json({ message: 'Missing userId or restaurantId' });
  }

  try {
    const reservation = await Reservation.findOne({ userId, restaurantId });
    res.status(200).json({ hasReservation: !!reservation });
  } catch (error) {
    console.error("Error checking reservation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export default send_reservation;