import React, { useEffect, useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");

  const [userId, setUserId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [hasReservation, setHasReservation] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and user ID
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("decoded");
      setUserId(decoded.id);
    }

    const queryParams = new URLSearchParams(location.search);
    const idFromUrl = queryParams.get("restaurantId");

    if (idFromUrl) {
      setRestaurantId(idFromUrl);
    } else if (location.state?.restaurantId) {
      setRestaurantId(location.state.restaurantId);
    }
  }, [location]);

  // Check if the user has already reserved
  useEffect(() => {
    const checkReservation = async () => {
      if (!restaurantId || !userId) return;
  
      const token = Cookies.get("token");
      if (!token) {
        setHasReservation(false);
        return;
      }
  
      try {
        const res = await axios.get(
          `https://reservation-nbg6.onrender.com/api/v1/reservation/check/${restaurantId}/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHasReservation(res.data.hasReservation);
      } catch (err) {
        console.error("Error checking reservation:", err);
        setHasReservation(false);
      }
    };
  
    checkReservation();
  }, [restaurantId, userId]); // <-- include userId here
  

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!userId || !restaurantId) {
      toast.error("User ID or Restaurant ID is missing.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://reservation-nbg6.onrender.com/api/v1/reservation/send",
        {
          userId,
          restaurantId,
          firstName,
          lastName,
          email,
          date,
          time,
          phone,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setDate("");
      setTime("");
      setPhone("");
      navigate("/success");
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error.response?.data?.message || "Failed to make reservation");
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="res" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>
            <form onSubmit={handleReservation}>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button type="submit">
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>

            {/* Show review note after reservation */}
            {hasReservation ? (
              <p className="text-green-600 font-semibold mt-4">
                ✅ You have already reserved. You can now leave a review!
              </p>
            ) : (
              <p className="text-red-600 font-bold mt-4">
                ❌ You must reserve before you can review this restaurant.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
