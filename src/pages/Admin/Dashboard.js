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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Panel</h1>
        <Link to="/admin/add-restaurant" className="add-restaurant-btn">
          + Yangi to'yxona qo'shish
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Jami to'yxonalar</h3>
          <p className="stat-number">{stats.totalRestaurants}</p>
        </div>
        <div className="stat-card">
          <h3>Jami foydalanuvchilar</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Jami buyurtmalar</h3>
          <p className="stat-number">{stats.totalReservations}</p>
        </div>
      </div>

      <div className="recent-restaurants">
        <h2>So'nggi qo'shilgan to'yxonalar</h2>
        <div className="restaurants-grid">
          {stats.recentRestaurants.map(restaurant => (
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
                <p>{restaurant.address}</p>
                <p>{restaurant.district}</p>
                <div className="restaurant-actions">
                  <Link to={`/admin/restaurants/${restaurant._id}/edit`} className="edit-btn">
                    Tahrirlash
                  </Link>
                  <button className="delete-btn" onClick={() => handleDelete(restaurant._id)}>
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;