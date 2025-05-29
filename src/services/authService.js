import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.accessToken);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Ro\'yxatdan o\'tishda xatolik' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.accessToken);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Kirishda xatolik' };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw error.response?.data || { message: 'Chiqishda xatolik' };
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await api.get('/auth/check');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};