import React, { useState, useEffect } from 'react';

const RestaurantApprovalList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch pending restaurants from API
    setLoading(false);
  }, []);

  const handleApprove = async (restaurantId) => {
    try {
      // TODO: Call API to approve restaurant
      setRestaurants(restaurants.filter(r => r.id !== restaurantId));
    } catch (error) {
      console.error('Error approving restaurant:', error);
    }
  };

  const handleReject = async (restaurantId) => {
    try {
      // TODO: Call API to reject restaurant
      setRestaurants(restaurants.filter(r => r.id !== restaurantId));
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Tasdiqlash kutayotgan restoranlar</h2>
      
      {restaurants.length === 0 ? (
        <p>Tasdiqlash kutayotgan restoranlar yo'q</p>
      ) : (
        <div className="space-y-4">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <p className="text-gray-600">{restaurant.address}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleApprove(restaurant.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Tasdiqlash
                </button>
                <button
                  onClick={() => handleReject(restaurant.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Rad etish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantApprovalList; 