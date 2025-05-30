import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './OwnerLayout.css'; // Assuming you'll create a corresponding CSS file

const OwnerLayout = () => {
  return (
    <div className="owner-layout">
      <div className="owner-sidebar">
        <h2>Owner Panel</h2>
        <ul>
          <li>
            <Link to="/owner/add-restaurant">Add New Hall</Link>
          </li>
          <li>
            <Link to="/owner/my-restaurant">My Hall</Link> {/* Placeholder for viewing/editing their own hall */}
          </li>
           <li>
            <Link to="/owner/bookings">My Hall Bookings</Link> {/* Placeholder for viewing bookings */}
          </li>
          {/* Add other owner-specific links here */}
        </ul>
      </div>
      <div className="owner-content">
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

export default OwnerLayout; 