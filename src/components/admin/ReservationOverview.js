import React, { useState, useEffect } from 'react';

const ReservationOverview = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch reservations from API
    setLoading(false);
  }, []);

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      // TODO: Call API to update reservation status
      setReservations(reservations.map(reservation => 
        reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
      ));
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Barcha band qilishlar</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Restoran</th>
              <th className="px-4 py-2">Foydalanuvchi</th>
              <th className="px-4 py-2">Sana</th>
              <th className="px-4 py-2">Vaqt</th>
              <th className="px-4 py-2">Kishilar soni</th>
              <th className="px-4 py-2">Holat</th>
              <th className="px-4 py-2">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id} className="border-b">
                <td className="px-4 py-2">{reservation.id}</td>
                <td className="px-4 py-2">{reservation.restaurantName}</td>
                <td className="px-4 py-2">{reservation.userName}</td>
                <td className="px-4 py-2">{reservation.date}</td>
                <td className="px-4 py-2">{reservation.time}</td>
                <td className="px-4 py-2">{reservation.guests}</td>
                <td className="px-4 py-2">
                  <select
                    value={reservation.status}
                    onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="confirmed">Tasdiqlangan</option>
                    <option value="cancelled">Bekor qilingan</option>
                    <option value="completed">Yakunlangan</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Bekor qilish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationOverview; 