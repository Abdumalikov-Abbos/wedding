import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { restaurantAPI, reservationAPI } from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';

const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    notes: ''
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await restaurantAPI.getById(id);
        setRestaurant(response.data);
      } catch (err) {
        setError('Restoran ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await reservationAPI.create({
        restaurantId: id,
        ...formData
      });
      navigate('/my-reservations');
    } catch (err) {
      setError('Band qilishda xatolik yuz berdi');
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!restaurant) {
    return <div>Restoran topilmadi</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Ma'lumotlar</h2>
              <p className="text-gray-600 mb-2">{restaurant.address}</p>
              <p className="text-gray-600 mb-2">Telefon: {restaurant.phone}</p>
              <p className="text-gray-600 mb-2">Email: {restaurant.email}</p>
              <p className="text-gray-600 mb-2">Reyting: {restaurant.rating}/5</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Band qilish</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sana
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={formatDate(new Date())}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vaqt
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Vaqtni tanlang</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {formatTime(slot)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mehmonlar soni
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    min="1"
                    max={restaurant.capacity || 100}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qo'shimcha ma'lumotlar
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Band qilish
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 