import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import "./AddLivestock.css";

function AddLivestock({ onClose, onSubmit, currentCount }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    gender: "Male",
    birthDate: "",
    status: "",
    weight: "",
    breed: "",
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập tên vật nuôi";
    if (!formData.type) newErrors.type = "Vui lòng chọn loại vật nuôi";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
    if (!formData.birthDate) newErrors.birthDate = "Vui lòng nhập ngày sinh";
    if (!formData.status) newErrors.status = "Vui lòng nhập trạng thái";
    if (!formData.weight) newErrors.weight = "Vui lòng nhập cân nặng";
    if (!formData.breed) newErrors.breed = "Vui lòng chọn giống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...formData,
        weight: parseFloat(formData.weight),
        createdAt: new Date().toISOString(),
      };
      onSubmit(formattedData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="add-livestock-container">
      <div className="add-livestock-header">
        <h2>Thêm Vật Nuôi Mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-livestock-form">
        <div className="form-group">
          <label htmlFor="name">Tên vật nuôi *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            placeholder="Nhập tên vật nuôi"
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
            className={errors.type ? "error" : ""}
          >
            <option value="">Chọn loại</option>
            <option value="Cattle">Gia súc</option>
            <option value="Pig">Heo</option>
            <option value="Chicken">Gà</option>
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
          >
            <option value="Male">Đực</option>
            <option value="Female">Cái</option>
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
            className={errors.birthDate ? "error" : ""}
          />
          {errors.birthDate && (
            <span className="error-message">{errors.birthDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Trạng thái *</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? "error" : ""}
            placeholder="Nhập trạng thái"
          />
          {errors.status && (
            <span className="error-message">{errors.status}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="weight">Cân nặng (kg) *</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className={errors.weight ? "error" : ""}
            placeholder="Nhập cân nặng"
          />
          {errors.weight && (
            <span className="error-message">{errors.weight}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="breed">Giống *</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className={errors.breed ? "error" : ""}
            placeholder="Nhập giống"
          />
          {errors.breed && (
            <span className="error-message">{errors.breed}</span>
          )}
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
