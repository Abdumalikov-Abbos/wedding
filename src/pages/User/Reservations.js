import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reservationAPI } from '../../services/api';
import { formatDate, formatTime, getStatusText, getStatusColor } from '../../utils/helpers';

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await reservationAPI.getAll({ userId: user.id });
        setReservations(response.data);
      } catch (err) {
        setError('Band qilishlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user.id]);

  const handleCancel = async (reservationId) => {
    try {
      await reservationAPI.cancel(reservationId);
      setReservations(reservations.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' }
          : reservation
      ));
    } catch (err) {
      setError('Band qilishni bekor qilishda xatolik yuz berdi');
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Mening band qilishlarim</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restoran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sana
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vaqt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mehmonlar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.restaurantName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(reservation.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatTime(reservation.time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.guests} kishi
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(reservation.status)}-100 text-${getStatusColor(reservation.status)}-800`}>
                    {getStatusText(reservation.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {reservation.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Bekor qilish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Hozircha band qilishlar yo'q
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations; 