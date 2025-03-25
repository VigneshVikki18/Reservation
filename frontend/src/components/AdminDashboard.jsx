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

  // Fetch Restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/restaurant/all");
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
        const { data } = await axios.get("http://localhost:5000/api/v1/reservation/all");
        setReservations(data.reservations);
      } catch (error) {
        toast.error("Failed to fetch reservations");
      } finally {
        setLoadingReservations(false);
      }
    };
    fetchReservations();
  }, []);

  // Add New Restaurant (API Integration)
  const handleAddRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.cuisine || !newRestaurant.price || !newRestaurant.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/restaurant/create",
        newRestaurant,
        { headers: { "Content-Type": "application/json" } }
      );
      setRestaurants((prev) => [...prev, data.restaurant]); // Add the new restaurant to the state
      setNewRestaurant({ name: "", cuisine: "", price: "", location: "" }); // Reset form
      toast.success("Restaurant added successfully");
    } catch (error) {
      toast.error("Failed to add restaurant");
    }
  };

  // Delete a Restaurant (API Integration)
  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/restaurant/delete/${id}`);
      setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id)); // Remove deleted restaurant from state
      toast.success("Restaurant deleted");
    } catch (error) {
      toast.error("Failed to delete restaurant");
    }
  };

  // Delete a Reservation (API Integration)
  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/reservation/delete/${id}`);
      setReservations((prev) => prev.filter((res) => res._id !== id)); // Remove deleted reservation from state
      toast.success("Reservation deleted");
    } catch (error) {
      toast.error("Failed to delete reservation");
    }
  };

  return (
    <div className="w-screen h-screen bg-white"> {/* Light beige background */}
      <h1 className="text-3xl font-bold text-center mb-4 text-[#3e2723]">Admin Dashboard</h1> {/* Darker brown font */}

      {/* Add New Restaurant */}
      <div className="p-4 border rounded-lg mb-4 bg-[#89bff8] "> {/* Soft cream background for form */}
        <h2 className="text-2xl font-semibold mb-2 text-[#3e2723]">Add New Restaurant</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2  placeholder-orange-600"
          value={newRestaurant.name}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cuisine"
          className="w-full p-2 border rounded mb-2 placeholder-orange-600"
          value={newRestaurant.cuisine}
 onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          className="w-full p-2 border rounded mb-2 placeholder-orange-600"
          value={newRestaurant.price}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded mb-2 placeholder-orange-600"
          value={newRestaurant.location}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
        />
        <button className="bg-[#8b0000] text-black px-4 py-2 rounded" onClick={handleAddRestaurant}>
          Add Restaurant
        </button>
      </div>

      {/* Manage Restaurants */}
      <h2 className="text-2xl font-semibold mb-2 text-[#3e2723]">Manage Restaurants</h2>
      {loadingRestaurants ? (
        <p>Loading restaurants...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="p-4 border rounded-lg bg-[#89bff8] text-[#a22800] "> {/* Soft cream background for cards */}
              <h3 className="text-lg font-bold text-[#3e2723]">{restaurant.name}</h3>
              <p>Cuisine: {restaurant.cuisine}</p>
              <p>Price: {restaurant.price}</p>
              <p>Location: {restaurant.location}</p>
              <button
                className="text-red-500 mt-2  "
                onClick={() => handleDeleteRestaurant(restaurant._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manage Reservations */}
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#3e2723]">Manage Reservations</h2>
      {loadingReservations ? (
        <p>Loading reservations...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="p-4 border rounded-lg bg-[#89bff8] text-[#a22800] "> {/* Soft cream background for cards */}
              <h3 className="text-lg font-bold text-[#3e2723]">
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
    </div>
  );
};

export default AdminDashboard;