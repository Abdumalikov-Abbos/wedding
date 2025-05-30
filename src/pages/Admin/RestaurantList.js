import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError('To\'yxonalarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu to\'yxonani o\'chirishni xohlaysizmi?')) {
      try {
        await restaurantAPI.delete(id);
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
      } catch (err) {
        setError('To\'yxonani o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await restaurantAPI.updateStatus(id, newStatus);
      setRestaurants(restaurants.map(restaurant =>
        restaurant._id === id ? { ...restaurant, status: newStatus } : restaurant
      ));
    } catch (err) {
      setError('To\'yxona statusini o\'zgartirishda xatolik yuz berdi');
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-list">
      <div className="restaurant-list-header">
        <h1>To'yxonalar ro'yxati</h1>
        <Link to="/admin/add-restaurant" className="add-button">
          + Yangi to'yxona qo'shish
        </Link>
      </div>

      <div className="restaurants-grid">
        {restaurants.map(restaurant => (
          <div key={restaurant._id} className="restaurant-card">
            <div className="restaurant-image">
              {restaurant.images?.[0] ? (
                <img src={restaurant.images[0]} alt={restaurant.name} />
              ) : (
                <div className="no-image">Rasm yo'q</div>
              )}
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p><strong>Manzil:</strong> {restaurant.address}</p>
              <p><strong>Tuman:</strong> {restaurant.district}</p>
              <p><strong>Sig'uvchanlik:</strong> {restaurant.capacity} kishi</p>
              <p><strong>Narx:</strong> {restaurant.pricePerSeat} so'm</p>
              <p><strong>Telefon:</strong> {restaurant.phone}</p>
              <p><strong>Status:</strong> 
                <select
                  value={restaurant.status}
                  onChange={(e) => handleStatusChange(restaurant._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="approved">Tasdiqlangan</option>
                  <option value="rejected">Rad etilgan</option>
                </select>
              </p>
              <div className="restaurant-actions">
                <button
                  onClick={() => navigate(`/admin/restaurants/${restaurant._id}/edit`)}
                  className="edit-button"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(restaurant._id)}
                  className="delete-button"
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList; 