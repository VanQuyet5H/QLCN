import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import './AddLivestock.css';

function AddLivestock({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    breed: '',
    birthDate: '',
    weight: '',
    source: '',
    location: '',
    health: 'healthy',
    notes: '',
    vaccinations: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = 'Vui lòng nhập mã số vật nuôi';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại vật nuôi';
    if (!formData.breed) newErrors.breed = 'Vui lòng chọn giống';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    if (!formData.weight) newErrors.weight = 'Vui lòng nhập cân nặng';
    if (!formData.location) newErrors.location = 'Vui lòng chọn vị trí chuồng';

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

  const handleVaccinationChange = (e) => {
    const { checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vaccinations: checked 
        ? [...prev.vaccinations, value]
        : prev.vaccinations.filter(v => v !== value)
    }));
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
            <label htmlFor="id">Mã số vật nuôi *</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className={errors.id ? 'error' : ''}
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
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
            <label htmlFor="source">Nguồn gốc</label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Nhập nguồn gốc xuất xứ"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Vị trí chuồng *</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
            >
              <option value="">Chọn vị trí</option>
              <option value="A1">Khu A - Chuồng 1</option>
              <option value="A2">Khu A - Chuồng 2</option>
              <option value="B1">Khu B - Chuồng 1</option>
              <option value="B2">Khu B - Chuồng 2</option>
            </select>
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="health">Tình trạng sức khỏe</label>
            <select
              id="health"
              name="health"
              value={formData.health}
              onChange={handleChange}
            >
              <option value="healthy">Khỏe mạnh</option>
              <option value="sick">Đang điều trị</option>
              <option value="quarantine">Cách ly</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Tiêm phòng</label>
          <div className="vaccination-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="fmd"
                checked={formData.vaccinations.includes('fmd')}
                onChange={handleVaccinationChange}
              />
              Lở mồm long móng
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="prrs"
                checked={formData.vaccinations.includes('prrs')}
                onChange={handleVaccinationChange}
              />
              PRRS
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="parasites"
                checked={formData.vaccinations.includes('parasites')}
                onChange={handleVaccinationChange}
              />
              Ký sinh trùng
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">Ghi chú</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Nhập ghi chú bổ sung"
          />
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