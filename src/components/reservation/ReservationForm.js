import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ReservationForm({ restaurantId }) {
  const [date, setDate] = useState(new Date());
  const [peopleCount, setPeopleCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/reservations', {
        restaurantId,
        date,
        numberOfPeople: peopleCount
      });
      navigate('/my-reservations');
    } catch (err) {
      setError(err.response?.data?.msg || 'Bron qilishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Bron qilish</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            minDate={new Date()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Odamlar soni</label>
          <input
            type="number"
            min="1"
            value={peopleCount}
            onChange={(e) => setPeopleCount(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Bron qiluvchi:</span> {user?.fullName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Telefon:</span> {user?.phone}
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Amalga oshirilmoqda...' : 'Bron qilish'}
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;