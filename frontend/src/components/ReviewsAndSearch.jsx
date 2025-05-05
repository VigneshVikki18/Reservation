import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';



export default function ReviewsAndSearch() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [ownerResponse, setOwnerResponse] = useState({ text: '', reviewId: null });
  const [hasReservation, setHasReservation] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState(''); 
  
  const navigate = useNavigate();

     // Fetch user type and ID from token/localStorage
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded.id);
    }
      // Ensure you pass the restaurant ID when navigating
     const handleReservationNavigation = (restaurantId) => {
      if (!restaurantId) {
       console.error("Missing restaurant ID");
       return;
  }
  navigate(`/reservation?restaurantId=${restaurantId}`);
};
    // Fetch user type from localStorage
    
      const storedUserType = localStorage.getItem('typeofuser');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }, []);

  // Fetch restaurants from the backend
  useEffect(() => {
    axios.get('https://reservation-nbg6.onrender.com/api/v1/restaurant/all')
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
  // Fetch reviews for the selected restaurant
useEffect(() => {
  if (selectedRestaurant && selectedRestaurant._id) {
    axios.get(`https://reservation-nbg6.onrender.com/api/reviews/getreviews/${selectedRestaurant._id}`)
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
  
const checkReservation = async () => {
  try {
    const token = Cookies.get('token');
    if (!token || !userId || !selectedRestaurant?._id) {
      alert("Missing user or restaurant information.");
      return;
    }

    const response = await axios.get(
      `https://reservation-nbg6.onrender.com/api/reviews/check-reservation/${selectedRestaurant._id}/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.hasReservation) {
      setHasReservation(true);
    } else {
      setHasReservation(false);
      alert("You must make a reservation before reviewing.");
    }
  } catch (error) {
    console.error("Reservation check failed:", error);
    alert("Error checking reservation status.");
  }
};



  // Add a new review
  const handleAddReview = async () => {
    if (!selectedRestaurant || !newReview.text  || !hasReservation) return;
  
    if (!hasReservation) {
      alert("You need to make a reservation before submitting a review.");
      return;
    }
  
    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        'https://reservation-nbg6.onrender.com/api/reviews',
        {
          restaurantId: selectedRestaurant._id,
          text: newReview.text,
          rating: newReview.rating,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const addedReview = response.data;
      setReviews(prev => ({
        ...prev,
        [selectedRestaurant._id]: [
          ...(prev[selectedRestaurant._id] || []),
          addedReview
        ]
      }));
  
      setNewReview({ text: '', rating: 0 });
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };
  
  

  // Edit review
  const handleEditReview = async (restaurantId, reviewId, newText, newRating) => {
    const review = reviews[restaurantId].find(r => r._id === reviewId);
    if (review.userId !== userId) 
      {
        alert("You can only edit your own review!");
        return;
      }
    try {
      const token = Cookies.get('token');
      const response = await axios.put(
        `https://reservation-nbg6.onrender.com/api/reviews/updateReview/${reviewId}`,
        { text: newText, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
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
    const review = reviews[restaurantId].find(r => r._id === reviewId);
    if (review.userId !== userId){
      alert("You can only delete your own review!");
    return;
   }
    
   if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = Cookies.get('token');
      await axios.delete(`https://reservation-nbg6.onrender.com/api/reviews/deleteReview/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
        `https://reservation-nbg6.onrender.com/api/reviews/addOwnerResponse/${reviewId}`,
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
    <div className="w-screen h-screen bg-[#89bff8]">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Restaurant Reviews</h1>

      {/* Search Bar */}
      <div className="mb-8">
  <input
    type="text"
    className="w-full p-4 text-lg border-2 border-black-300 rounded-lg placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder="Search restaurants..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
  />
   </div>


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
        <div className="bg-blue p-6 rounded-xl shadow-lg w-full">
          {/* Review Form */}
  
         {selectedRestaurant && (
  <div className="mb-8">
    {!hasReservation ? (
      <>
        <button
          className="px-6 py-3 bg-green-600 text-black rounded-lg font-semibold hover:bg-green-700 transition-colors"
          onClick={checkReservation}
        >
          Check Reservation & Leave a Review
        </button>
        <p className="text-red-600 font-bold mt-2">
          You need to book a reservation before you can review this restaurant.
        </p>
      </>
    ) : (
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Leave a Review for {selectedRestaurant.name}</h2>
        <textarea
          className="w-full p-4 text-lg border-2 border-black-300 rounded-lg placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={newReview.text}
          onChange={e => setNewReview({ ...newReview, text: e.target.value })}
          placeholder="Share your experience..."
        />

        <div className="flex gap-2 mb-6 mt-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`text-3xl transition-transform hover:scale-125 ${
                newReview.rating >= star ? 'text-yellow-400' : 'text-black-300'
              }`}
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
    )}
  </div>
)}


          {/* Reviews List */}
          <div>
            <h3 className="text-xl font-bold text-black mb-6">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews[selectedRestaurant._id]?.map(review => (
                <div key={review._id} className="bg-blue p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2" >
                    <div>
                      <p className="text-black mb-2">{review.text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}</span>
                        <span className="text-black-600 text-sm">{review.rating}/5</span>
                      </div>
                      {review.ownerResponse && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Owner Response:</h4>
                          <p className="text-black-600">{review.ownerResponse}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {review?.userId === userId && (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() =>
                           handleEditReview(
                           selectedRestaurant._id,
                            review._id,
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
                          </>
                           )}
                         </div>

                  </div>

                  {/* Owner Response Form */}
                  {(userType === 'owner' || userType === 'admin') && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-4 ..."
                      value={ownerResponse.reviewId === review._id ? ownerResponse.text : ''}
                     onChange={e => setOwnerResponse({ text: e.target.value, reviewId: review._id })}
                       placeholder="Respond to this review..."
                    />
                     <button
                     className="px-4 py-2 bg-green-600 ..."
                      onClick={() => handleAddOwnerResponse(review._id)}
                     >
                  Submit Response
                  </button>
                 </div>
               )}

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
      <button
        className="mt-8 px-6 py-3 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto"
        onClick={() => {
          if (selectedRestaurant) {
            navigate('/restaurant', { state: { restaurantId: selectedRestaurant._id } });
          } else {
            alert("Please select a restaurant first.");
          }
        }}
        
      >
        Reservation
      </button>
    </div>
  );
}