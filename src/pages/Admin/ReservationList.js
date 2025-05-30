import React, { useState, useEffect } from 'react';
import { reservationAPI, restaurantAPI } from '../../services/api'; // restaurantAPI ni ham import qildim
// import './ReservationList.css'; // Assuming you'll create a CSS file for styling

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]); // Restoranlar ro'yxati uchun state
  const [districts, setDistricts] = useState([
    'Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor' // Rayonlar ro'yxati
  ]);
  
  // State for sorting and filtering
  const [sortBy, setSortBy] = useState('date'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [filterDistrict, setFilterDistrict] = useState(''); // Assuming district filtering is needed based on previous context
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Assuming search functionality might be needed

  useEffect(() => {
    // Function to fetch reservations from the backend
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Haqiqiy API chaqiruvi
        const response = await reservationAPI.getAll({
           sortBy,
           sortOrder,
           restaurant: filterRestaurant,
           district: filterDistrict,
           status: filterStatus,
           search: searchTerm
        });

        // API dan kelgan bronlarni statega saqlaymiz
        setReservations(response.data);
      } catch (err) {
        // Xatolikni ko'rsatamiz
        setError(err.message || 'Bronlarni yuklashda xatolik yuz berdi');
      } finally {
        // Yuklanish holatini tugatamiz
        setLoading(false);
      }
    };

    // Function to fetch restaurants for the filter
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantAPI.getAll({}); // Barcha restoranlarni olamiz
        setRestaurants(response.data);
      } catch (err) {
        console.error('Restoranlarni yuklashda xatolik yuz berdi:', err);
      }
    };

    fetchReservations();
    fetchRestaurants(); // Restoranlar ro'yxatini ham yuklaymiz

    // Saralash va filterlash o'zgarganda ma'lumotlarni qayta yuklash uchun dependency arrayni to'ldiring
  }, [sortBy, sortOrder, filterRestaurant, filterDistrict, filterStatus, searchTerm]); // Dependency array to'ldirildi

  // TODO: Implement sorting and filtering logic or integrate with backend API

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Barcha bronlarni ko'rish</h1>

      {/* TODO: Add Sorting and Filtering Controls here */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Example Sorting Control */}
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="font-medium">Saralash:</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="date">Sana</option>
            <option value="restaurant">To'yxona nomi</option>
            <option value="district">Rayon</option>
            <option value="status">Status</option>
            {/* Add other sorting options */}
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="asc">O'sish tartibida</option>
            <option value="desc">Kamayish tartibida</option>
          </select>
        </div>
        {/* Example Filtering Control */}
        <div className="flex items-center gap-2">
          <label htmlFor="filterStatus" className="font-medium">Status bo'yicha filter:</label>
          <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="">Hammasi</option>
            <option value="bo'lib o'tgan">Bo'lib o'tgan</option>
            <option value="endi bo'ladigan">Endi bo'ladigan</option>
          </select>
        </div>
        {/* TODO: Add filters for Restaurant and District */} 
         {/* Restaurant Filter */}
         <div className="flex items-center gap-2">
            <label htmlFor="filterRestaurant" className="font-medium">To'yxona bo'yicha filter:</label>
            <select id="filterRestaurant" value={filterRestaurant} onChange={(e) => setFilterRestaurant(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="">Hammasi</option>
                {restaurants.map(restaurant => (
                    <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
                ))}
            </select>
         </div>
         {/* District Filter */}
         <div className="flex items-center gap-2">
            <label htmlFor="filterDistrict" className="font-medium">Rayon bo'yicha filter:</label>
            <select id="filterDistrict" value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="">Hammasi</option>
                {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))}
            </select>
         </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bron id</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To'yxona nomi</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sana</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nechta odamga o'rindiq aytilgan</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kim tomonidan aytilgani (ism, familiya, raqam)</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              {/* TODO: Add a column for cancellation action */}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map(reservation => (
                <tr key={reservation._id} className="hover:bg-gray-100">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{reservation._id}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{reservation.restaurant.name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{reservation.date}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{reservation.numberOfGuests}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{`${reservation.bookedBy.name} ${reservation.bookedBy.surname}, ${reservation.bookedBy.phoneNumber}`}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight`}>
                      <span aria-hidden="true" className={`absolute inset-0 ${reservation.status === 'bo\'lib o\'tgan' ? 'bg-red-200' : 'bg-green-200'} opacity-50 rounded-full`}></span>
                      <span className="relative">{reservation.status}</span>
                    </span>
                  </td>
                  {/* TODO: Add cancellation button */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button className="text-red-600 hover:text-red-900">Bekor qilish</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">Bronlar topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList; 