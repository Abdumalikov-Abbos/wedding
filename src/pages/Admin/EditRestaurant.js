import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, userAPI } from '../../services/api';
import './EditRestaurant.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    district: '',
    capacity: '',
    pricePerSeat: '',
    phone: '',
    owner: '',
    existingImages: [],
    newImages: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State for Calendar and Bookings
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // restaurant data
        const restaurantResponse = await restaurantAPI.getById(id);
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
          owner: restaurantData.owner?._id || '',
          existingImages: restaurantData.images || [],
          newImages: []
        });

        // Fetch users for owner selection
        const usersResponse = await userAPI.getAll();
        setUsers(usersResponse.data);

        // Fetch bookings for this restaurant
        try {
          const bookingsResponse = await restaurantAPI.getRestaurantBookings(id);
          setBookings(bookingsResponse.data);
        } catch (bookingErr) {
          console.error("Error fetching bookings:", bookingErr);
          setBookings([]);
        }

        setLoading(false);
      } catch (err) {
        setError('Malumotlarni yuklashda xatolik yuz berdi');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, newImages: Array.from(e.target.files) });
  };

  const handleRemoveExistingImage = (imageToRemove) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter(image => image !== imageToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const data = new FormData();
    for (const key in formData) {
        if (key !== 'newImages' && key !== 'existingImages') {
            data.append(key, formData[key]);
        }
    }
    formData.newImages.forEach(image => data.append('images', image));
    formData.existingImages.forEach(image => data.append('existingImages', image));

    try {
      await restaurantAPI.update(id, data);
      setSubmitSuccess(true);
      setSubmitLoading(false);
    } catch (err) {
      setSubmitError('Toyxonani tahrirlashda xatolik yuz berdi');
      setSubmitLoading(false);
    }
  };

  // Calendar Logic
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      const isBooked = bookings.some(booking =>
         moment(booking.date).format('YYYY-MM-DD') === dateString
      );
      const isPast = moment(date).isBefore(moment(), 'day');

      if (isBooked) {
        return 'booked-day';
      } else if (isPast) {
         return 'past-day';
      }
    }
    return null;
  };

  const handleCalendarClick = (date) => {
      const dateString = moment(date).format('YYYY-MM-DD');
      const bookingsOnThisDate = bookings.filter(booking =>
         moment(booking.date).format('YYYY-MM-DD') === dateString
      );
      setSelectedDateBookings(bookingsOnThisDate);
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">To'yxona topilmadi.</div>;

  return (
    <div className="edit-restaurant-container">
      <h2>To'yxonani tahrirlash</h2>
      {submitSuccess && <div className="success-message">To'yxona muvaffaqiyatli tahrirlandi!</div>}
      {submitError && <div className="error-message">{submitError}</div>}
      <form onSubmit={handleSubmit} className="edit-restaurant-form">
        <div className="form-group">
          <label htmlFor="name">Nomi:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Tavsifi:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="address">Manzil:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="district">Tuman:</label>
          <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Sig'uvchanlik:</label>
          <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="pricePerSeat">Narx (har bir kishi uchun):</label>
          <input type="number" id="pricePerSeat" name="pricePerSeat" value={formData.pricePerSeat} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon raqami:</label>
          <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="owner">Egasi:</label>
          <select id="owner" name="owner" value={formData.owner} onChange={handleChange} required>
            <option value="">Egasini tanlang</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username} ({user.role})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="existingImages">Mavjud rasmlar:</label>
          <div className="image-previews">
            {formData.existingImages.map(image => (
              <div key={image} className="image-preview">
                <img src={image} alt="Existing" width="100" />
                <button type="button" onClick={() => handleRemoveExistingImage(image)}>X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newImages">Yangi rasmlar qo'shish:</label>
          <input type="file" id="newImages" name="newImages" multiple onChange={handleImageChange} accept="image/*" />
          <div className="image-previews">
            {Array.from(formData.newImages).map((image, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt="New" width="100" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </form>

      <hr />

      <div className="booking-calendar-section">
           <h3>Band qilingan kunlar</h3>
           <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                tileClassName={tileClassName}
                onClickDay={handleCalendarClick}
           />

           {selectedDateBookings.length > 0 && (
                <div className="selected-date-bookings">
                    <h4>{moment(calendarDate).format('YYYY-MM-DD')} dagi bandliklar:</h4>
                    <ul>
                        {selectedDateBookings.map(booking => (
                            <li key={booking._id}>
                                Kim tomonidan: {booking.user?.fullName || booking.user?.username || 'Noma\'lum foydalanuvchi'} - Joylar soni: {booking.partySize}
                            </li>
                        ))}
                    </ul>
                </div>
           )}
            {selectedDateBookings.length === 0 && calendarDate && !moment(calendarDate).isBefore(moment(), 'day') && (
                 <div className="selected-date-bookings">
                    <h4>{moment(calendarDate).format('YYYY-MM-DD')} dagi bandliklar:</h4>
                    <p>Bu kunda bandliklar yo'q.</p>
                 </div>
            )}
      </div>

    </div>
  );
};

export default EditRestaurant; 




