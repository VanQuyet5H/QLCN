import { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import './EditLivestock.css';

function EditLivestock({ onClose, onSubmit, livestockData }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: '',
    gender: '',
    birthDate: '',
    status: '',
    weight: '',
    breed: '',
    createdAt: '',
  });

  const [errors, setErrors] = useState({});

  // Khi có dữ liệu vật nuôi, sẽ set vào formData
  useEffect(() => {
    if (livestockData) {
      setFormData({
        id: livestockData.id,
        name: livestockData.name,
        type: livestockData.type,
        gender: livestockData.gender,
        birthDate: livestockData.birthDate,
        status: livestockData.status,
        weight: livestockData.weight,
        breed: livestockData.breed,
        createdAt: livestockData.createdAt,
      });
    }
  }, [livestockData]);

  // Kiểm tra lỗi các trường
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên vật nuôi';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại vật nuôi';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    if (!formData.weight) newErrors.weight = 'Vui lòng nhập cân nặng';
    if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';
    if (!formData.breed) newErrors.breed = 'Vui lòng chọn giống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Xử lý thay đổi giá trị của các trường trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi tương ứng nếu có khi thay đổi
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="edit-livestock-container">
      <div className="edit-livestock-header">
        <h2>Cập Nhật Thông Tin Vật Nuôi</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-livestock-form">
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
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
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
            <label htmlFor="status">Trạng thái *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'error' : ''}
            >
              <option value="">Chọn trạng thái</option>
              <option value="healthy">Khỏe mạnh</option>
              <option value="sick">Đang điều trị</option>
              <option value="quarantine">Cách ly</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
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

export default EditLivestock;
