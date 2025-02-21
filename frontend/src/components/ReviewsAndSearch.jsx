import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../Pages/Login/Login';

const restaurantsData = [
  { id: 1, name: 'The Spicy Grill', cuisine: 'Indian', price: '$$', location: 'Downtown', features: ['outdoor seating', 'live music'] },
  { id: 2, name: 'Ocean Breeze', cuisine: 'Seafood', price: '$$$', location: 'Beachfront', features: ['ocean view'] },
  { id: 3, name: 'Mountain Delight', cuisine: 'Vegetarian', price: '$', location: 'Uptown', features: ['vegan options'] },
  { id: 4, name: 'KFC', cuisine: 'Non-Veg', price: '$', location: 'Chennai', features: [' Non-vegan options'] },
  { id: 5, name: 'McDonalds', cuisine: 'Veg,Non-Veg', price: '$', location: 'Madurai', features: ['Non-Veg options'] },
  { id: 6, name: 'Dominos Pizza', cuisine: 'Non-Veg', price: '$', location: 'Comibatour', features: [' Non-vegan options'] },
  { id: 7, name: 'Subway', cuisine: 'Non-Veg', price: '$', location: 'Dindigul', features: [' Non-vegan options'] },
  { id: 8, name: 'Pizza Hut', cuisine: 'Non-Veg', price: '$', location: 'Trichi', features: [' Non-vegan options'] },
  { id: 9, name: 'Barbeque Nation', cuisine: 'Non-Veg', price: '$', location: 'Dindigul', features: [' Non-vegan options'] },
];

export default function ReviewsAndSearch() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ text: '', rating: 0, photos: [] });
  const [ownerResponses, setOwnerResponses] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ cuisine: '', price: '', location: '', features: [] });
  const [showReservation, setShowReservation] = useState(false);

  const handleAddReview = async () => {
    if (selectedRestaurant && newReview.text) {
      try {
        const response = await axios.post('http://localhost:5000/api/reviews', {
          restaurantId: selectedRestaurant.id,
          text: newReview.text,
          rating: newReview.rating,
          photos: newReview.photos,
        });

        const addedReview = response.data;
        const restaurantReviews = reviews[selectedRestaurant.id] || [];
        setReviews({
          ...reviews,
          [selectedRestaurant.id]: [...restaurantReviews, addedReview],
        });
        setNewReview({ text: '', rating: 0, photos: [] });
      } catch (error) {
        console.error('Failed to add review:', error);
      }
    }
  };

  const handleEditReview = (restaurantId, reviewId, newText, newRating) => {
    setReviews({
      ...reviews,
      [restaurantId]: reviews[restaurantId].map(review => 
        review.id === reviewId ? { ...review, text: newText, rating: newRating } : review
      ),
    });
  };

  const handleDeleteReview = (restaurantId, reviewId) => {
    setReviews({
      ...reviews,
      [restaurantId]: reviews[restaurantId].filter(review => review.id !== reviewId),
    });
  };

  const handleOwnerResponse = (reviewId, response) => {
    setOwnerResponses({ ...ownerResponses, [reviewId]: response });
  };

  const filteredRestaurants = restaurantsData.filter(restaurant => 
    (filters.cuisine ? restaurant.cuisine === filters.cuisine : true) &&
    (filters.price ? restaurant.price === filters.price : true) &&
    (filters.location ? restaurant.location.includes(filters.location) : true) &&
    (filters.features.length > 0 ? filters.features.every(f => restaurant.features.includes(f)) : true) &&
    (searchQuery ? restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  return (
    <div className="container mx-auto p-4 display: contents">
      <h1 className="text-2xl font-bold text-center mb-4">Restaurant Reviews</h1><br/>
      
      <input 
        type="text" 
        className="w-full p-2 border rounded mb-2"
        placeholder="Search restaurants..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)} 
      /><br/>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {filteredRestaurants.map(restaurant => (
          <div 
            key={restaurant.id}
            className={`p-4 border rounded-lg cursor-pointer text-center ${selectedRestaurant?.id === restaurant.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            {restaurant.name} <br/>
          </div>
        ))}
      </div>

      {selectedRestaurant && !showReservation && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Leave a Review for {selectedRestaurant.name}</h2> <br/>
          <textarea 
            className="w-full p-2 border rounded mb-2"
            value={newReview.text}
            onChange={e => setNewReview({ ...newReview, text: e.target.value })}
            placeholder="Write your review..."
          />
          
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star}
                className={`text-2xl cursor-pointer ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              >
                ★
              </span>
            ))}
          </div>

          <button className="bg-blue-500 text-black px-4 py-2 rounded mb-2" onClick={handleAddReview}>Submit Review</button>
          <button className="bg-green-500 text-black px-4 py-2 rounded" onClick={() => setShowReservation(!showReservation)}>Make a Reservation</button>
           
          <div>
            <h3 className="text-lg font-semibold mt-4">Reviews</h3>
            {reviews[selectedRestaurant.id]?.map(review => (
              <div key={review.id} className="border p-2 my-2 rounded">
                <p>{review.text}</p>
                <p>Rating: {review.rating} ★</p>
                <button className="text-blue-500" onClick={() => handleEditReview(selectedRestaurant.id, review.id, prompt('Edit review:', review.text), parseInt(prompt('Edit rating (1-5):', review.rating)))}>Edit</button>
                <button className="text-red-500 ml-2" onClick={() => handleDeleteReview(selectedRestaurant.id, review.id)}>Delete</button>
                <div>
                  <h4 className="text-sm font-semibold">Owner Response:</h4>
                  <p>{ownerResponses[review.id] || 'No response yet'}</p>
                  <button className="text-green-500" onClick={() => handleOwnerResponse(review.id, prompt('Enter owner response:'))}>Respond</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showReservation && <Login />}
    </div>
  );
}