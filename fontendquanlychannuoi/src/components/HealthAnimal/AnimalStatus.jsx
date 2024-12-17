import React, { useState } from "react";
import axios from "axios";
import './SickAnimals.css';
import Notification from '../utils/Notification';
const AnimalStatus = ({ animalId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);  // Cập nhật trạng thái hiển thị trong select
    setLoading(true);
    try {
      await axios.put(`https://localhost:7185/update-status/${animalId}`, { Status: newStatus });
      setLoading(false);
    } catch (err) {
    setNotification({ message: 'Bạn cập nhật tình trạng vật nuôi thất bại!', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="status-actions">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="status-select"
      >
        <option value="Sick">Bệnh</option>
        <option value="Healthy">Khỏe mạnh</option>
        <option value="Dead">Chết</option>
      </select>

      {loading && <p>Đang cập nhật trạng thái...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AnimalStatus;
