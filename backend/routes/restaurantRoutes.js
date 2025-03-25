import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getAllRestaurants,
} from "../controller/restaurantController.js"; 

const router = express.Router();

router.post("/create", addRestaurant);
router.delete("/delete/:id", deleteRestaurant);
router.get("/all", getAllRestaurants);

export default router;