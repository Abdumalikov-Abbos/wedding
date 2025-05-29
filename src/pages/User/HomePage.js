import React from 'react';
import Navbar from '../../components/common/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="hero-section">
        <div className="hero-content">
          <h1>To'yxona band qilish tizimi</h1>
          <p>Eng yaxshi to'yxonalarni toping va band qiling</p>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>Keng tanlov</h3>
          <p>Turli xil to'yxonalar orasidan tanlang</p>
        </div>
        <div className="feature-card">
          <h3>Oson band qilish</h3>
          <p>Bir necha bosqichda to'yxonani band qiling</p>
        </div>
        <div className="feature-card">
          <h3>Xavfsiz to'lov</h3>
          <p>Xavfsiz va tezkor to'lov tizimi</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;