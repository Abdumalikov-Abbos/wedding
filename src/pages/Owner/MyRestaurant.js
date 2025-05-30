import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom'; // We might not need useParams initially if owner only has one hall
import { userAPI } from '../../services/api';

const MyRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data when editing
  const navigate = useNavigate();
  // Assuming the owner is logged in and their user ID is available,
  // we will fetch the restaurant owned by the current user.
  // We don't need restaurant ID from params here.

  useEffect(() => {
    const fetchOwnerRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current user details to get their owned restaurant ID(s)
        // Assuming userAPI.getMe() exists and returns user with populated ownedRestaurants
        const userResponse = await userAPI.getMe(); // TODO: Implement getMe in userAPI and backend
        const currentUser = userResponse.data;

        if (currentUser.ownedRestaurants && currentUser.ownedRestaurants.length > 0) {
           // Assuming an owner primarily manages one restaurant, use the first one.
           // If multiple, the UI/flow would need adjustment.
           const ownedRestaurantId = currentUser.ownedRestaurants[0]._id;

           // Fetch the specific restaurant using its ID
           const restaurantResponse = await restaurantAPI.getById(ownedRestaurantId); // Assuming getById exists
           const restaurantData = restaurantResponse.data;
           setRestaurant(restaurantData);
           setFormData({
              name: restaurantData.name || '',
              description: restaurantData.description || '',
              address: restaurantData.address || '',
              district: restaurantData.district || '',
              capacity: restaurantData.capacity || '',
              pricePerSeat: restaurantData.pricePerSeat || '',
              phone: restaurantData.phone || '',
              owner: restaurantData.owner?._id || '', // Assuming owner is an object with _id
              existingImages: restaurantData.images || [],
              newImages: []
           });
        } else {
           setError("Sizga tegishli to'yxona topilmadi. Iltimos, yangi to'yxona qo'shing.");
           setRestaurant(null); // Ensure restaurant is null if not found
        }

        setLoading(false);
      } catch (err) {
        setError('To\'yxonani yuklashda xatolik yuz berdi');
        setLoading(false);
        console.error("Error fetching owner's restaurant:", err);
      }
    };

    fetchOwnerRestaurant();
  }, []); // Empty dependency array, runs once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
       // *** IMPORTANT ***: The backend PUT /api/restaurants/:id endpoint needs to verify
       // that the logged-in user is either admin or the owner of the restaurant being updated.
       // It currently does this check.

      await restaurantAPI.update(restaurant._id, formData); // Assuming an update function exists in api.js
      setRestaurant(formData); // Update local state with saved data
      setIsEditing(false); // Exit edit mode
      setLoading(false);
      // Optionally show a success message
    } catch (err) {
      setError('To\'yxonani yangilashda xatolik yuz berdi');
      setLoading(false);
      console.error("Error updating owner's restaurant:", err);
    }
  };

   const handleDelete = async () => {
       if (window.confirm('Bu to\'yxonani o\'chirishni xohlaysizmi?')) {
           setLoading(true);
           setError(null);
           try {
               // *** IMPORTANT ***: The backend DELETE /api/restaurants/:id endpoint needs to verify
               // that the logged-in user is either admin or the owner of the restaurant being deleted.
               // It currently does this check.
               await restaurantAPI.delete(restaurant._id); // Assuming delete function exists in api.js
               setRestaurant(null); // Clear restaurant state
               setLoading(false);
               // Optionally redirect or show success message
               // navigate('/owner'); // Redirect to owner dashboard or a success page
           } catch (err) {
               setError('To\'yxonani o\'chirishda xatolik yuz berdi');
               setLoading(false);
               console.error("Error deleting owner's restaurant:", err);
           }
       }
   };


  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {error}</div>;
  if (!restaurant && !loading && !error) return <div>Sizga tegishli to'yxona topilmadi. Iltimos, yangi to'yxona qo'shing.</div>;


  return (
    <div className="my-restaurant-page">
      <h1>Mening To'yxonam</h1>

      {!isEditing ? (
        <div className="restaurant-details">
          {/* Display restaurant details */}
          <p><strong>Nomi:</strong> {restaurant.name}</p>
          <p><strong>Manzil:</strong> {restaurant.address}</p>
          <p><strong>Tuman:</strong> {restaurant.district}</p>
          <p><strong>Sig'uvchanlik:</strong> {restaurant.capacity}</p>
          <p><strong>Narxi:</strong> {restaurant.pricePerSeat}</p>
          <p><strong>Telefon:</strong> {restaurant.phone}</p>
          <p><strong>Status:</strong> {restaurant.status}</p>
           {/* Display images */}
           <div className="restaurant-images">
                {restaurant.images?.map((image, index) => (
                    <img key={index} src={`http://localhost:5000/${image.replace(/\\/g, '/')}`} alt={`Restaurant Image ${index + 1}`} width="100" />
                ))}
           </div>


          <button onClick={() => setIsEditing(true)}>Tahrirlash</button>
          <button onClick={handleDelete} className="delete-button">O'chirish</button> {/* Add delete button */}
        </div>
      ) : (
        <div className="edit-restaurant-form">
          {/* Form to edit restaurant details */}
          <h2>To'yxonani Tahrirlash</h2>
           {/* Add form fields for name, address, district, capacity, pricePerSeat, phone */}
           <label htmlFor="name">Nomi:</label>
           <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />

           <label htmlFor="address">Manzil:</label>
           <input type="text" id="address" name="address" value={formData.address || ''} onChange={handleInputChange} />

           {/* District dropdown - reuse districts from Admin Add/List */}
           <label htmlFor="district">Tuman:</label>
            <select id="district" name="district" value={formData.district || ''} onChange={handleInputChange}>
                <option value="">Tanlang</option>
                {/* TODO: Fetch districts dynamically or reuse list */}
                 {['Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor'].map(dist => (
                     <option key={dist} value={dist}>{dist}</option>
                 ))}
            </select>

           <label htmlFor="capacity">Sig'uvchanlik:</label>
           <input type="number" id="capacity" name="capacity" value={formData.capacity || ''} onChange={handleInputChange} />

           <label htmlFor="pricePerSeat">Narxi:</label>
           <input type="number" id="pricePerSeat" name="pricePerSeat" value={formData.pricePerSeat || ''} onChange={handleInputChange} />

           <label htmlFor="phone">Telefon:</label>
           <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} />

            {/* TODO: Add image upload handling */}


          <button onClick={handleSave}>Saqlash</button>
          <button onClick={() => setIsEditing(false)}>Bekor qilish</button>
        </div>
      )}
    </div>
  );
};

export default MyRestaurant; 