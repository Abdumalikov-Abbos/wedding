import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { restaurantAPI } from '../../services/api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantAPI.getAll({ ownerId: user.id });
        setRestaurants(response.data);
      } catch (err) {
        setError('Restoranlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user.id]);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Restoranlar boshqaruvi</h1>
        <button
          onClick={() => {/* TODO: Add new restaurant */}}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yangi restoran qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
            <p className="text-gray-600 mb-4">{restaurant.address}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Status: {restaurant.status}
              </span>
              <span className="text-sm text-gray-500">
                Reyting: {restaurant.rating}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {/* TODO: Edit restaurant */}}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Tahrirlash
              </button>
              <button
                onClick={() => {/* TODO: View reservations */}}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Band qilishlar
              </button>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Hozircha restoranlar yo'q
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard; 