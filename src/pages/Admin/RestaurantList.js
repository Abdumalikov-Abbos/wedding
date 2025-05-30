import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State for filtering and sorting
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'price' or 'capacity'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [searchTerm, setSearchTerm] = useState('');

  // Ref to store the timeout ID for debouncing
  const searchTimeoutRef = React.useRef(null);

  useEffect(() => {
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to fetch restaurants after a delay (e.g., 500ms)
    searchTimeoutRef.current = setTimeout(() => {
      fetchRestaurants();
    }, 500); // Adjust the delay as needed (e.g., 300ms, 500ms, 1000ms)

    // Cleanup function to clear the timeout when the component unmounts or dependencies change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };

  }, [filterDistrict, filterStatus, sortBy, sortOrder, searchTerm]); // Re-fetch when filters/sort change and search term changes

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct query parameters, including searchTerm
      const params = {
        district: filterDistrict,
        status: filterStatus,
        sortBy: sortBy,
        order: sortOrder,
        searchTerm: searchTerm, // Include search term
      };
      // Remove empty parameters
      Object.keys(params).forEach(key => params[key] === '' && delete params[key]);


      const response = await restaurantAPI.getAll(params); // Pass parameters to API call
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError('To\'yxonalarni yuklashda xatolik yuz berdi');
      setLoading(false);
      console.error("Error fetching restaurants:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu to\'yxonani o\'chirishni xohlaysizmi?')) {
      try {
        await restaurantAPI.delete(id);
        // Remove deleted restaurant from state
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
      } catch (err) {
        setError('To\'yxonani o\'chirishda xatolik yuz berdi');
        console.error("Error deleting restaurant:", err);
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
       console.error("Error updating status:", err);
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  // Define available districts (you might want to fetch these from backend later)
  const districts = ['Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor'];


  return (
    <div className="restaurant-list">
      <div className="restaurant-list-header">
        <h1>To'yxonalar ro'yxati</h1>
        <Link to="/admin/add-restaurant" className="add-button">
          + Yangi to'yxona qo'shish
        </Link>
      </div>

      {/* Filtering, Sorting, and Searching Controls */}
      <div className="filters-sort-controls flex flex-wrap items-center gap-4 mb-6">
         {/* Search Input */}
         <div className="filter-group flex flex-col flex-grow">
            <label htmlFor="searchTerm" className="mb-1 font-medium text-gray-700">Qidirish:</label>
            <input
               type="text"
               id="searchTerm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="To'yxona nomi, manzili, tavsifi..."
               className="border rounded-md px-3 py-2 w-full"
            />
         </div>

         {/* District Filter */}
         <div className="filter-group flex flex-col">
            <label htmlFor="districtFilter" className="mb-1 font-medium text-gray-700">Tuman bo'yicha filter:</label>
            <select id="districtFilter" value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="">Hammasi</option>
                {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))}
            </select>
         </div>

         {/* Status Filter */}
         <div className="filter-group flex flex-col">
            <label htmlFor="statusFilter" className="mb-1 font-medium text-gray-700">Status bo'yicha filter:</label>
            <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="">Hammasi</option>
                <option value="pending">Kutilmoqda</option>
                <option value="approved">Tasdiqlangan</option>
                <option value="rejected">Rad etilgan</option>
            </select>
         </div>

          {/* Sort By */}
          <div className="sort-group flex flex-col">
            <label htmlFor="sortBy" className="mb-1 font-medium text-gray-700">Saralash:</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="">Tanlang</option>
                <option value="price">Narxi</option>
                <option value="capacity">Sig'imi</option>
            </select>
         </div>

          {/* Sort Order */}
          {sortBy && ( // Only show sort order if a sortBy option is selected
            <div className="sort-group flex flex-col">
                <label htmlFor="sortOrder" className="mb-1 font-medium text-gray-700">Tartib:</label>
                <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded-md px-3 py-2">
                    <option value="asc">O'sish tartibida</option>
                    <option value="desc">Kamayish tartibida</option>
                </select>
            </div>
          )}
      </div>


      <div className="restaurants-grid">
        {restaurants.map(restaurant => (
          <div key={restaurant._id} className="restaurant-card">
            <div className="restaurant-image">
              {restaurant.images?.[0] ? (
                // Assuming images are served from the backend's uploads folder, adjust the URL path if necessary
                <img src={`http://localhost:5000/${restaurant.images[0].replace(/\\/g, '/')}`} alt={restaurant.name} />
              ) : (
                <div className="no-image">Rasm yo'q</div>
              )}
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
               {/* Display owner name if available */}
               {restaurant.owner && <p><strong>Egasi:</strong> {restaurant.owner.fullName || restaurant.owner.username}</p>}
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
       {restaurants.length === 0 && !loading && !error && (
            <div className="no-results">Hech qanday to'yxona topilmadi.</div>
        )}
    </div>
  );
};

export default RestaurantList; 