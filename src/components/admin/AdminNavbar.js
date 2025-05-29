import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-xl font-bold">
          Admin Panel
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/admin/users" className="hover:text-gray-300">
            Foydalanuvchilar
          </Link>
          <Link to="/admin/restaurants" className="hover:text-gray-300">
            Restoranlar
          </Link>
          <Link to="/admin/add-owner" className="hover:text-gray-300">
            Yangi to'yxona egasi qo'shish
          </Link>
          <Link to="/admin/add-restaurant" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
            Yangi to'yxona qo'shish
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Chiqish
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 