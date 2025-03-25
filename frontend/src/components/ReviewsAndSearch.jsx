import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
import { Link } from 'react-router-dom';

=======
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e

export default function ReviewsAndSearch() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [ownerResponse, setOwnerResponse] = useState({ text: '', reviewId: null });
  const [searchQuery, setSearchQuery] = useState('');
<<<<<<< HEAD
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();


    // Fetch user type from localStorage
    useEffect(() => {
      const storedUserType = localStorage.getItem('typeofuser');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }, []);

  // Fetch restaurants from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/restaurant/all')
=======
  const navigate = useNavigate();

  // Fetch restaurants from the backend
  useEffect(() => {
    axios.get('https://reservation-nbg6.onrender.com/api/v1/restaurant/all')
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
      .then(response => {
        console.log("API Response:", response.data); // Debugging
        if (Array.isArray(response.data.restaurants)) {
          setRestaurants(response.data.restaurants);
        } else {
          console.error("Unexpected API response format:", response.data);
          setRestaurants([]); // Fallback to an empty array
        }
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]); // Fallback to an empty array
      });
  }, []);

  // Fetch reviews for the selected restaurant
  useEffect(() => {
    if (selectedRestaurant) {
<<<<<<< HEAD
      axios.get(`http://localhost:5000/api/reviews/getreviews/${selectedRestaurant._id}`)
=======
      axios.get(`https://reservation-nbg6.onrender.com/api/reviews/getreviews/${selectedRestaurant._id}`)
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
        .then(response => {
          setReviews(prev => ({
            ...prev,
            [selectedRestaurant._id]: response.data
          }));
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [selectedRestaurant]);

  // Add a new review
  const handleAddReview = async () => {
    if (selectedRestaurant && newReview.text) {
      try {
<<<<<<< HEAD
        const response = await axios.post('http://localhost:5000/api/reviews', {
=======
        const response = await axios.post('https://reservation-nbg6.onrender.com/api/reviews', {
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
          restaurantId: selectedRestaurant._id, // Ensure this is a valid ObjectId
          text: newReview.text,
          rating: newReview.rating,
        });

        const addedReview = response.data;
        const restaurantReviews = reviews[selectedRestaurant._id] || [];
        setReviews({
          ...reviews,
          [selectedRestaurant._id]: [...restaurantReviews, addedReview],
        });
        setNewReview({ text: '', rating: 0 });
      } catch (error) {
        console.error('Failed to add review:', error);
      }
    }
  };

  // Edit review
  const handleEditReview = async (restaurantId, reviewId, newText, newRating) => {
    if (!newText || !newRating) return;

    try {
      const response = await axios.put(
<<<<<<< HEAD
        `http://localhost:5000/api/reviews/updateReview/${reviewId}`,
=======
        `https://reservation-nbg6.onrender.com/api/reviews/updateReview/${reviewId}`,
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
        { text: newText, rating: newRating }
      );

      setReviews(prev => ({
        ...prev,
        [restaurantId]: prev[restaurantId].map(review => 
          review._id === reviewId ? response.data : review
        )
      }));
    } catch (error) {
      console.error('Failed to edit review:', error);
    }
  };

  // Delete review
  const handleDeleteReview = async (restaurantId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
<<<<<<< HEAD
      await axios.delete(`http://localhost:5000/api/reviews/deleteReview/${reviewId}`);
=======
      await axios.delete(`https://reservation-nbg6.onrender.com/api/reviews/deleteReview/${reviewId}`);
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
      
      setReviews(prev => ({
        ...prev,
        [restaurantId]: prev[restaurantId].filter(review => review._id !== reviewId)
      }));
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Add owner response
  const handleAddOwnerResponse = async (reviewId) => {
    if (!ownerResponse.text) return;

    try {
      const response = await axios.put(
<<<<<<< HEAD
        `http://localhost:5000/api/reviews/addOwnerResponse/${reviewId}`,
=======
        `https://reservation-nbg6.onrender.com/api/reviews/addOwnerResponse/${reviewId}`,
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
        { response: ownerResponse.text }
      );

      setReviews(prev => ({
        ...prev,
        [selectedRestaurant._id]: prev[selectedRestaurant._id].map(review => 
          review._id === reviewId ? response.data : review
        )
      }));
      setOwnerResponse({ text: '', reviewId: null });
    } catch (error) {
      console.error('Failed to add owner response:', error);
    }
  };

  // Filter restaurants based on search
  const filteredRestaurants = Array.isArray(restaurants)
    ? restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
<<<<<<< HEAD
    <div className="w-screen h-screen bg-[#89bff8]">
=======
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen w-full">
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Restaurant Reviews</h1>

      {/* Search Bar */}
      <div className="mb-8">
<<<<<<< HEAD
  <input
    type="text"
    className="w-full p-4 text-lg border-2 border-black-300 rounded-lg placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder="Search restaurants..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
  />
   </div>

=======
        <input
          type="text"
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e

      {/* Restaurant Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {filteredRestaurants.map(restaurant => (
          <div
            key={restaurant._id}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all
              ${selectedRestaurant?._id === restaurant._id 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-200 bg-white hover:shadow-lg hover:border-blue-200'}`}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <h3 className="text-lg font-semibold text-black mb-2">{restaurant.name}</h3>
            <p className="text-sm text-black">{restaurant.cuisine}</p>
          </div>
        ))}
      </div>

      {selectedRestaurant && (
<<<<<<< HEAD
        <div className="bg-blue p-6 rounded-xl shadow-lg w-full">
=======
        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
          {/* Review Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Leave a Review for {selectedRestaurant.name}</h2>
            <textarea
<<<<<<< HEAD
              className="w-full p-4 text-lg border-2 border-black-300 rounded-lg placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
=======
              className="w-full p-4 border-2 border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
              value={newReview.text}
              onChange={e => setNewReview({ ...newReview, text: e.target.value })}
              placeholder="Share your experience..."
            />

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`text-3xl transition-transform hover:scale-125
<<<<<<< HEAD
                    ${newReview.rating >= star ? 'text-yellow-400' : 'text-black-300'}`}
=======
                    ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              className="px-6 py-3 bg-blue-600 text-black rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleAddReview}
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="text-xl font-bold text-black mb-6">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews[selectedRestaurant._id]?.map(review => (
<<<<<<< HEAD
                <div key={review._id} className="bg-blue p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2" >
=======
                <div key={review._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
                    <div>
                      <p className="text-black mb-2">{review.text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}</span>
<<<<<<< HEAD
                        <span className="text-black-600 text-sm">{review.rating}/5</span>
=======
                        <span className="text-gray-500 text-sm">{review.rating}/5</span>
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
                      </div>
                      {review.ownerResponse && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Owner Response:</h4>
<<<<<<< HEAD
                          <p className="text-black-600">{review.ownerResponse}</p>
=======
                          <p className="text-gray-600">{review.ownerResponse}</p>
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() =>
                          handleEditReview(
                            selectedRestaurant._id,
                            review ._id,
                            prompt('Edit review:', review.text),
                            parseInt(prompt('Edit rating (1-5):', review.rating))
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => handleDeleteReview(selectedRestaurant._id, review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Owner Response Form */}
                  <div className="mt-4">
                    <textarea
<<<<<<< HEAD
                      className="w-full p-4 text-lg border-2 border-black-300 rounded-lg placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
=======
                      className="w-full p-2 border-2 border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
                      value={ownerResponse.reviewId === review._id ? ownerResponse.text : ''}
                      onChange={e => setOwnerResponse({ text: e.target.value, reviewId: review._id })}
                      placeholder="Respond to this review..."
                    />
                    <button
                      className="px-4 py-2 bg-green-600 text-black rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      onClick={() => handleAddOwnerResponse(review._id)}
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}<br/>

            {/* Admin Dashboard button only visible for admins */}
      {userType === 'admin' && (
        <button
          className="mt-8 px-6 py-3 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto"
          onClick={() => navigate('/admin')}
        >
          Admin Dashboard
        </button>
      )}
<<<<<<< HEAD
      <button
        className="mt-8 px-6 py-3 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto"
        onClick={() => navigate('/restaurant')}
      >
        Reservation
=======

      <button
        className="mt-8 px-6 py-3 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto"
        onClick={() => navigate('/admin')}
      >
        Admin Dashboard
      </button>
      <button
        className="mt-8 px-6 py-3 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto"
        onClick={() => navigate('/Login')}
      >
        Login
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
      </button>
    </div>
  );
}
