import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/restaurants">To'yxonalar</Link>
          </li>
          {/* Add link for Restaurant Owners */}
          <li>
             <Link to="/admin/owners">Restoran egalari</Link>
          </li>
          {/* Add more admin navigation links here */}
          <li>
            <Link to="/admin/reservations">Barcha bronlarni ko'rish</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
            <button onClick={logout}>Chiqish</button>
        </div>
      </div>
      <div className="main-content">
        <Outlet /> {/* This is where the specific admin page component will render */}
      </div>
    </div>
  );
};

export default AdminLayout; 