import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import RestaurantApprovalList from '../../components/admin/RestaurantApprovalList';
import UserManagement from '../../components/admin/UserManagement';
import ReservationOverview from '../../components/admin/ReservationOverview';
import api from '../../services/api';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRestaurants = async () => {
      try {
        const response = await api.get('/restaurants', {
          params: { status: 'pending' }
        });
        setPendingRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching pending restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'restaurants') {
      fetchPendingRestaurants();
    }
  }, [activeTab]);

  const handleStatusChange = async (restaurantId, status) => {
    try {
      await api.put(`/restaurants/${restaurantId}/status`, { status });
      setPendingRestaurants(pendingRestaurants.filter(r => r._id !== restaurantId));
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'restaurants' && (
          <RestaurantApprovalList 
            restaurants={pendingRestaurants} 
            loading={loading}
            onStatusChange={handleStatusChange}
          />
        )}
        
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'reservations' && <ReservationOverview />}
      </div>
      <Link to="/admin/add-owner" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
        Yangi to'yxona egasi qo'shish
      </Link>
    </div>
  );
}

export default AdminDashboard;