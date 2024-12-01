import { useState } from 'react';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import './WeightRecordModal.css';

function WeightRecordModal({ animal, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    weight: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    feedIntake: '',
    healthStatus: 'healthy'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      animalId: animal.id,
      ...formData,
      weight: parseFloat(formData.weight),
      feedIntake: parseFloat(formData.feedIntake)
    });
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
      <div className="weight-record-modal">
        <div className="modal-header">
          <h2>Cập nhật cân nặng</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="animal-info">
          <p><strong>Mã số:</strong> {animal.id}</p>
          <p><strong>Loại:</strong> {animal.type}</p>
          <p><strong>Cân nặng hiện tại:</strong> {animal.currentWeight} kg</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cân nặng mới (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Ngày cân:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lượng thức ăn (kg/ngày):</label>
            <input
              type="number"
              name="feedIntake"
              value={formData.feedIntake}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Tình trạng sức khỏe:</label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
            >
              <option value="healthy">Khỏe mạnh</option>
              <option value="sick">Đang điều trị</option>
              <option value="recovering">Đang hồi phục</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WeightRecordModal;