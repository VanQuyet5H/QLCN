import React, { useState, useEffect } from 'react';
import { FaSave,FaTimes } from 'react-icons/fa';
import './EditLivestock.css';

function EditLivestock({ livestock, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: '',
    gender: '',
    birthDate: '',
    status: '',
    weight: '',
    breed: '',
    otherType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (livestock) {
      setFormData({
        ...livestock,
        type: ['Bò', 'Lợn', 'other'].includes(livestock.type) ? livestock.type : '',
        otherType: livestock.type === 'other' ? livestock.otherType : '',
        birthDate: livestock.birthDate ? livestock.birthDate.split('T')[0] : '',
      });
    }
  }, [livestock]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên vật nuôi';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại vật nuôi';
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Cân nặng không hợp lệ';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const finalData = formData.type === 'other' ? { ...formData, type: formData.otherType } : formData;
      onSubmit(finalData);
      try {
        await onSubmit(finalData); // Gọi API từ prop `onSubmit`
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error updating livestock:', error);
        setIsSubmitting(false);
      }
    
    }
  };

  return (
    <div className="edit-livestock-container">
      <form onSubmit={handleSubmit} className="edit-livestock-form">
        <div className="form-group">
          <label htmlFor="id">Mã số vật nuôi</label>
          <input type="text" id="id" name="id" value={formData.id} readOnly />
        </div>
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
            value={formData.type || ''}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            <option value="">Chọn loại</option>
            <option value="Bò">Bò</option>
            <option value="Lợn">Lợn</option>
            <option value="other">Khác</option> {/* Thêm lựa chọn "Khác" */}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}

          {formData.type === 'other' && (
            <div className="form-group">
              <label htmlFor="otherType">Nhập loại vật nuôi khác</label>
              <input
                type="text"
                id="otherType"
                name="otherType"
                value={formData.otherType || ''}
                onChange={handleChange}
                className={errors.otherType ? 'error' : ''}
              />
              {errors.otherType && <span className="error-message">{errors.otherType}</span>}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Loài</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Đực</option>
            <option value="FeMale">Cái</option>
          </select>
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
            className={errors.weight ? 'error' : ''}
          />
          {errors.weight && <span className="error-message">{errors.weight}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="breed">Giống</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Tình trạng</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            <FaTimes /> Hủy
          </button>
          <button type="submit" className="btn-save" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : <><FaSave /> Lưu</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLivestock;
