import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import './AddLivestock.css';

function AddLivestock({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    gender: '',
    birthDate: '',
    status: '',
    weight: '',
    breed: '',
    createdAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên vật nuôi';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại vật nuôi';
    if (!formData.breed) newErrors.breed = 'Vui lòng chọn giống';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    if (!formData.weight) newErrors.weight = 'Vui lòng nhập cân nặng';
    if (!formData.status) newErrors.status = 'Vui lòng nhập tình trạng';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="add-livestock-container">
      <div className="add-livestock-header">
        <h2>Thêm Vật Nuôi Mới</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-livestock-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Tên vật nuôi *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Loại vật nuôi *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? 'error' : ''}
            >
              <option value="">Chọn loại</option>
              <option value="cattle">Bò thịt</option>
              <option value="dairy">Bò sữa</option>
              <option value="pig">Heo thịt</option>
              <option value="sow">Heo nái</option>
            </select>
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Giới tính *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="Male">Đực</option>
              <option value="Female">Cái</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Ngày sinh *</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Tình trạng *</label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'error' : ''}
            />
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Cân nặng (kg) *</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              step="0.1"
              className={errors.weight ? 'error' : ''}
            />
            {errors.weight && <span className="error-message">{errors.weight}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="breed">Giống *</label>
            <select
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className={errors.breed ? 'error' : ''}
            >
              <option value="">Chọn giống</option>
              <option value="brahman">Brahman</option>
              <option value="holstein">Holstein Friesian</option>
              <option value="duroc">Duroc</option>
              <option value="landrace">Landrace</option>
            </select>
            {errors.breed && <span className="error-message">{errors.breed}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="createdAt">Ngày tạo *</label>
            <input
              type="text"
              id="createdAt"
              name="createdAt"
              value={formData.createdAt}
              readOnly
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            <FaTimes /> Hủy
          </button>
          <button type="submit" className="btn-save">
            <FaSave /> Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLivestock;
