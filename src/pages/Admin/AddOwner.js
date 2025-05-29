import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddOwner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'restaurant_owner'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', formData);
      navigate('/admin/users');
    } catch (err) {
      setError('Foydalanuvchi qo\'shishda xatolik yuz berdi');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yangi to'yxona egasi qo'shish</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ism, familiya</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon raqam</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Parol</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Qo'shish</button>
      </form>
    </div>
  );
};

export default AddOwner;
