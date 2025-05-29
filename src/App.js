import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/User/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/Dashboard';
import OwnerDashboard from './pages/Owner/Dashboard';
import RestaurantDetail from './pages/User/RestaurantDetail';
import UserReservations from './pages/User/Reservations';
import AddRestaurant from './pages/Admin/AddRestaurant';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Umumiy sahifalar */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          
          {/* Auth sahifalar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User sahifalar */}
          <Route path="/my-reservations" element={
            <ProtectedRoute roles={['user']}>
              <UserReservations />
            </ProtectedRoute>
          } />
          
          {/* To'yxona egasi sahifalar */}
          <Route path="/owner" element={
            <ProtectedRoute roles={['restaurant_owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin sahifalar */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-restaurant" element={
            <ProtectedRoute roles={['admin']}>
              <AddRestaurant />
            </ProtectedRoute>
          } />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;