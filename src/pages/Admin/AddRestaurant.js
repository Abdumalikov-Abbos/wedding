import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI, userAPI } from '../../services/api';
import './AddRestaurant.css';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [ownerMode, setOwnerMode] = useState('select');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    district: '',
    capacity: '',
    pricePerSeat: '',
    phone: '',
    owner: '',
    images: []
  });

  const [newOwnerFormData, setNewOwnerFormData] = useState({
    fullName: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAll();
        setUsers(response.data);
        setUsersLoading(false);
      } catch (err) {
        setUsersError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
        setUsersLoading(false);
      }
    };

    if (ownerMode === 'select') {
      fetchUsers();
    }
  }, [ownerMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNewOwnerChange = (e) => {
    const { name, value } = e.target;
    setNewOwnerFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "To'yxona nomi kiritilmagan";
    if (!formData.description) newErrors.description = "Tavsifi kiritilmagan";
    if (!formData.address) newErrors.address = "Manzil kiritilmagan";
    if (!formData.district) newErrors.district = "Tuman kiritilmagan";
    if (!formData.capacity) newErrors.capacity = "Sig'imi kiritilmagan";
    if (!formData.pricePerSeat) newErrors.pricePerSeat = 'Narxi kiritilmagan';
    if (!formData.phone) newErrors.phone = 'Telefon raqami kiritilmagan';

    if (ownerMode === 'select') {
      if (!formData.owner) newErrors.owner = "Egasini tanlash shart";
    } else {
      if (!newOwnerFormData.fullName) newErrors.fullName = "Ism Familiya kiritilmagan";
      if (!newOwnerFormData.username) newErrors.username = "Username kiritilmagan";
      if (!newOwnerFormData.password) newErrors.password = "Parol kiritilmagan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    let ownerId = formData.owner;

    try {
      if (ownerMode === 'create') {
        const ownerResponse = await userAPI.createOwner(newOwnerFormData);
        ownerId = ownerResponse.data.user._id;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      submitData.append('district', formData.district);
      submitData.append('capacity', formData.capacity);
      submitData.append('pricePerSeat', formData.pricePerSeat);
      submitData.append('phone', formData.phone);
      submitData.append('owner', ownerId);

      formData.images.forEach(image => {
        submitData.append('images', image);
      });

      await restaurantAPI.create(submitData);
      navigate('/admin/restaurants');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      setErrors({
        submit: error.response?.data?.message || error.message || "To'yxona qo'shishda xatolik yuz berdi"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-restaurant-page">
      <div className="add-restaurant-container">
        <h1>Yangi to'yxona qo'shish</h1>

        <form onSubmit={handleSubmit} className="restaurant-form">
          <div className="form-group">
            <label>Ega tanlash usuli:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="select"
                  checked={ownerMode === 'select'}
                  onChange={() => setOwnerMode('select')}
                />
                Mavjud egasini tanlash
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input
                  type="radio"
                  value="create"
                  checked={ownerMode === 'create'}
                  onChange={() => setOwnerMode('create')}
                />
                Yangi ega yaratish
              </label>
            </div>
          </div>

          {ownerMode === 'select' && (
            <div className="form-group">
              <label htmlFor="owner">Egasini tanlang:</label>
              {usersLoading ? (
                <div>Yuklanmoqda...</div>
              ) : usersError ? (
                <div className="error-message">{usersError}</div>
              ) : (
                <select
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className={errors.owner ? 'error' : ''}
                  required
                >
                  <option value="">Egasini tanlang</option>
                  {users.filter(user => user.role === 'restaurant_owner').map(user => (
                    <option key={user._id} value={user._id}>
                      {user.fullName} ({user.username})
                    </option>
                  ))}
                </select>
              )}
              {errors.owner && <span className="error-message">{errors.owner}</span>}
            </div>
          )}

          {ownerMode === 'create' && (
            <>
              <div className="form-group">
                <label htmlFor="newOwnerFullName">Ism Familiya:</label>
                <input
                  type="text"
                  id="newOwnerFullName"
                  name="fullName"
                  value={newOwnerFormData.fullName}
                  onChange={handleNewOwnerChange}
                  className={errors.fullName ? 'error' : ''}
                  required={ownerMode === 'create'}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="newOwnerUsername">Username:</label>
                <input
                  type="text"
                  id="newOwnerUsername"
                  name="username"
                  value={newOwnerFormData.username}
                  onChange={handleNewOwnerChange}
                  className={errors.username ? 'error' : ''}
                  required={ownerMode === 'create'}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="newOwnerPassword">Parol:</label>
                <input
                  type="password"
                  id="newOwnerPassword"
                  name="password"
                  value={newOwnerFormData.password}
                  onChange={handleNewOwnerChange}
                  className={errors.password ? 'error' : ''}
                  required={ownerMode === 'create'}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="name">To'yxona nomi</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Tavsifi</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              required
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Manzil</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              required
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="district">Tuman</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={errors.district ? 'error' : ''}
              required
            />
            {errors.district && <span className="error-message">{errors.district}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Sig'imi (kishi)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={errors.capacity ? 'error' : ''}
                required
              />
              {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pricePerSeat">Narxi (so'm/kishi)</label>
              <input
                type="number"
                id="pricePerSeat"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleChange}
                className={errors.pricePerSeat ? 'error' : ''}
                required
              />
              {errors.pricePerSeat && <span className="error-message">{errors.pricePerSeat}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon raqami</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              required
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="images">Rasmlar</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/*"
            />
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading || usersLoading}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/admin/restaurants')}>
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant; 