import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Wedding Reservations</h3>
            <p className="text-gray-400">
              To'yxona va restoranlarni band qilish uchun eng yaxshi platforma
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white">
                  Restoranlar
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Aloqa
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@wedding-reservations.uz</li>
              <li>Telefon: +998 90 123 45 67</li>
              <li>Manzil: Toshkent shahri</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wedding Reservations. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 