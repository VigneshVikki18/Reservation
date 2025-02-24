import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // State for Restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    cuisine: "",
    price: "",
    location: "",
  });
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  // State for Reservations
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  // State for Reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch Restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get("https://dhf7lc-5000.csb.app/api/v1/restaurant/all");
        setRestaurants(data.restaurants);
      } catch (error) {
        toast.error("Failed to fetch restaurants");
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch Reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await axios.get("https://dhf7lc-5000.csb.app/api/v1/reservation/all");
        setReservations(data.reservations);
      } catch (error) {
        toast.error("Failed to fetch reservations");
      } finally {
        setLoadingReservations(false);
      }
    };
    fetchReservations();
  }, []);

  // Fetch Reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get("https://dhf7lc-5000.csb.app/api/v1/review/all");
        setReviews(data.reviews);
      } catch (error) {
        toast.error("Failed to fetch reviews");
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  // Add New Restaurant (API Integration)
  const handleAddRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.cuisine || !newRestaurant.price || !newRestaurant.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://dhf7lc-5000.csb.app/api/v1/restaurant/create",
        newRestaurant,
        { headers: { "Content-Type": "application/json" } }
      );
      setRestaurants([...restaurants, data.restaurant]); // Add the new restaurant to the state
      setNewRestaurant({ name: "", cuisine: "", price: "", location: "" }); // Reset form
      toast.success("Restaurant added successfully");
    } catch (error) {
      toast.error("Failed to add restaurant");
    }
  };

  // Delete a Restaurant (API Integration)
  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(`https://dhf7lc-5000.csb.app/api/v1/restaurant/delete/${id}`);
      setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id)); // Remove deleted restaurant from state
      toast.success("Restaurant deleted");
    } catch (error) {
      toast.error("Failed to delete restaurant");
    }
  };

  // Delete a Reservation (API Integration)
  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`https://dhf7lc-5000.csb.app/api/v1/reservation/delete/${id}`);
      setReservations(reservations.filter((res) => res._id !== id)); // Remove deleted reservation from state
      toast.success("Reservation deleted");
    } catch (error) {
      toast.error("Failed to delete reservation");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>

      {/* Add New Restaurant */}
      <div className="p-4 border rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Add New Restaurant</h2>
        <input
          type=" text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          value={newRestaurant.name}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cuisine"
          className="w-full p-2 border rounded mb-2"
          value={newRestaurant.cuisine}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          className="w-full p-2 border rounded mb-2"
          value={newRestaurant.price}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded mb-2"
          value={newRestaurant.location}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddRestaurant}>
          Add Restaurant
        </button>
      </div>

      {/* Manage Restaurants */}
      <h2 className="text-xl font-semibold mb-2">Manage Restaurants</h2>
      {loadingRestaurants ? (
        <p>Loading restaurants...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-bold">{restaurant.name}</h3>
              <p>Cuisine: {restaurant.cuisine}</p>
              <p>Price: {restaurant.price}</p>
              <p>Location: {restaurant.location}</p>
              <button
                className="text-red-500 mt-2"
                onClick={() => handleDeleteRestaurant(restaurant._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manage Reservations */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Manage Reservations</h2>
      {loadingReservations ? (
        <p>Loading reservations...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-bold">
                {reservation.firstName} {reservation.lastName}
              </h3>
              <p>Email: {reservation.email}</p>
              <p>Phone: {reservation.phone}</p>
              <p>Date: {reservation.date}</p>
              <p>Time: {reservation.time}</p>
              <button
                className="text-red-500 mt-2"
                onClick={() => handleDeleteReservation(reservation._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manage Reviews */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Manage Reviews</h2>
      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-bold">{review.restaurantName}</h3>
              <p>Reviewer: {review.reviewerName}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;