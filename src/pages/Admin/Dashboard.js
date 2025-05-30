import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalUsers: 0,
    totalReservations: 0,
    recentRestaurants: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await restaurantAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleDelete = async (restaurantId) => {
    if (window.confirm('Bu toyxonani ochirishni xohlaysizmi?')) {
      try {
        await restaurantAPI.delete(restaurantId);
        // Refresh stats after deletion
        const response = await restaurantAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <div className="dashboard-header flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <Link to="add-restaurant" className="add-restaurant-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Yangi to'yxona qo'shish
        </Link>
      </div>

      <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Jami to'yxonalar</h3>
          <p className="stat-number text-4xl font-bold text-blue-600">
            {stats.totalRestaurants}
          </p>
        </div>
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Jami foydalanuvchilar</h3>
          <p className="stat-number text-4xl font-bold text-green-600">
            {stats.totalUsers}
          </p>
        </div>
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Jami buyurtmalar</h3>
          <p className="stat-number text-4xl font-bold text-yellow-600">
            {stats.totalReservations}
          </p>
        </div>
      </div>

      <div className="recent-restaurants">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">So'nggi qo'shilgan to'yxonalar</h2>
        <div className="restaurants-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.recentRestaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card bg-white rounded-lg shadow-md overflow-hidden">
              <div className="restaurant-image h-48 w-full overflow-hidden">
                {restaurant.images?.[0] ? (
                  <img src={`http://localhost:5000/${restaurant.images[0].replace(/\\/g, '/')}`} alt={restaurant.name} className="w-full h-full object-cover"/>
                ) : (
                  <div className="no-image w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Rasm yo'q</div>
                )}
              </div>
              <div className="restaurant-info p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="text-gray-600 mb-4">{restaurant.district}</p>
                <div className="restaurant-actions flex gap-4">
                  <Link to={`restaurants/${restaurant._id}/edit`} className="edit-btn flex-1 text-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Tahrirlash
                  </Link>
                  <button className="delete-btn flex-1 text-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(restaurant._id)}>
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
          {stats.recentRestaurants.length === 0 && (
            <div className="text-center text-gray-500 col-span-full">So'nggi to'yxonalar topilmadi.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;