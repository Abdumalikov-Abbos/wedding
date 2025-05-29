import { RESERVATION_STATUS, RESTAURANT_STATUS } from './constants';

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  return time.padStart(5, '0');
};

export const getStatusColor = (status) => {
  const colors = {
    [RESERVATION_STATUS.PENDING]: 'yellow',
    [RESERVATION_STATUS.CONFIRMED]: 'green',
    [RESERVATION_STATUS.CANCELLED]: 'red',
    [RESERVATION_STATUS.COMPLETED]: 'blue',
    [RESTAURANT_STATUS.PENDING]: 'yellow',
    [RESTAURANT_STATUS.APPROVED]: 'green',
    [RESTAURANT_STATUS.REJECTED]: 'red',
  };
  return colors[status] || 'gray';
};

export const getStatusText = (status) => {
  const texts = {
    [RESERVATION_STATUS.PENDING]: 'Kutilmoqda',
    [RESERVATION_STATUS.CONFIRMED]: 'Tasdiqlangan',
    [RESERVATION_STATUS.CANCELLED]: 'Bekor qilingan',
    [RESERVATION_STATUS.COMPLETED]: 'Yakunlangan',
    [RESTAURANT_STATUS.PENDING]: 'Tekshirilmoqda',
    [RESTAURANT_STATUS.APPROVED]: 'Tasdiqlangan',
    [RESTAURANT_STATUS.REJECTED]: 'Rad etilgan',
  };
  return texts[status] || status;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+998[0-9]{9}$/;
  return re.test(phone);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
  }).format(price);
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}; 