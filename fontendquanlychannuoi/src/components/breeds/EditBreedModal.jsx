import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './BreedModal.css';

function EditBreedModal({ breed, onClose, onSubmit }) {
  const [formData, setFormData] = useState(breed);

  useEffect(() => {
    setFormData(breed);
  }, [breed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="breed-modal">
        <div className="modal-header">
          <h2>Chỉnh sửa giống</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã giống:</label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="disabled"
              />
            </div>

            <div className="form-group">
              <label>Tên giống:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Loại:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="cattle">Bò thịt</option>
                <option value="dairy">Bò sữa</option>
                <option value="pig">Heo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Xuất xứ:</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cân nặng trung bình (kg):</label>
              <input
                type="text"
                name="avgWeight"
                value={formData.avgWeight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tốc độ tăng trưởng (kg/ngày):</label>
              <input
                type="text"
                name="avgGrowthRate"
                value={formData.avgGrowthRate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Chất lượng thịt:</label>
              <select
                name="meatQuality"
                value={formData.meatQuality}
                onChange={handleChange}
                required
              >
                <option value="Cao">Cao</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
              </select>
            </div>

            <div className="form-group">
              <label>Khả năng kháng bệnh:</label>
              <select
                name="diseaseResistance"
                value={formData.diseaseResistance}
                onChange={handleChange}
                required
              >
                <option value="Tốt">Tốt</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Đặc điểm nổi bật:</label>
            <textarea
              name="characteristics"
              value={formData.characteristics}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBreedModal;