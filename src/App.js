import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/User/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/Dashboard';
import RestaurantList from './pages/Admin/RestaurantList';
import AddRestaurant from './pages/Admin/AddRestaurant';
import OwnerDashboard from './pages/Owner/Dashboard';
import RestaurantDetail from './pages/User/RestaurantDetail';
import UserReservations from './pages/User/Reservations';
import EditRestaurant from './pages/Admin/EditRestaurant';
import AdminLayout from './components/Admin/AdminLayout';
import OwnerLayout from './components/Owner/OwnerLayout';
import MyRestaurant from './pages/Owner/MyRestaurant';
import OwnerList from './pages/Admin/OwnerList';
import ReservationList from './pages/Admin/ReservationList';
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
          
          {/* To'yxona egasi sahifalar (Wrapped in OwnerLayout) */}
          <Route path="/owner" element={
            <ProtectedRoute roles={['restaurant_owner']}>
              <OwnerLayout />
            </ProtectedRoute>
          }>
            {/* Nested owner routes */}
            <Route index element={<OwnerDashboard />} />
            <Route path="add-restaurant" element={<AddRestaurant />} />
            <Route path="my-restaurant" element={<MyRestaurant />} />
            <Route path="bookings" element={<div>Owner Bookings Page Placeholder</div>} />
          </Route>
          
          {/* Admin sahifalar (Wrapped in AdminLayout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested admin routes */}
            <Route index element={<AdminDashboard />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="add-restaurant" element={<AddRestaurant />} />
            <Route path="restaurants/:id/edit" element={<EditRestaurant />} />
            <Route path="owners" element={<OwnerList />} />
            <Route path="reservations" element={<ReservationList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;