import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api'; // Assuming userAPI exists
import { Link } from 'react-router-dom'; // If you want to link to user details
// import './AdminPages.css'; // Or create a new CSS file

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        // Assuming userAPI.getAll fetches all users
        const response = await userAPI.getAll();
        // Filter for users with the 'restaurant_owner' role
        const ownerUsers = response.data.filter(user => user.role === 'restaurant_owner');
        setOwners(ownerUsers);
        setLoading(false);
      } catch (err) {
        setError('Restoran egalarini yuklashda xatolik yuz berdi');
        setLoading(false);
        console.error("Error fetching owners:", err);
      }
    };

    fetchOwners();
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {error}</div>;

  return (
    <div className="owner-list-container">
      <h2>Restoran egalari ro'yxati</h2>
      {owners.length === 0 ? (
        <p>Restoran egalari topilmadi.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {owners.map(owner => (
            <li key={owner._id} className="py-4 flex justify-between items-center">
              <div className="flex-1 pr-4">
                <div className="text-lg font-semibold text-gray-900">
                    {owner.fullName ? `${owner.fullName} (${owner.username})` : owner.username}
                </div>
                {owner.ownedRestaurants && owner.ownedRestaurants.length > 0 ? (
                    <div className="text-sm text-gray-600 mt-1">
                       <strong>To'yxona:</strong> {owner.ownedRestaurants.map(restaurant => restaurant.name).join(', ')}
                    </div>
                ) : (
                    <div className="text-sm text-gray-600 mt-1">
                        To'yxona biriktirilmagan.
                    </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OwnerList; 