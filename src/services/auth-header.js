export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user object including token is stored

  if (user && user.token) {
    // For Spring Boot backend with JWT
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
} 