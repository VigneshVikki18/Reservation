import { Restaurant } from "../models/restaurant.js"; 
export const addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, price, location } = req.body;
    const newRestaurant = new Restaurant({ name, cuisine, price, location });
    await newRestaurant.save();
    res.status(201).json({ restaurant: newRestaurant });
  } catch (error) {
    res.status(500).json({ message: "Failed to add restaurant", error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete restaurant", error: error.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error: error.message });
  }
};