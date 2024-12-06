import { FaTimes } from 'react-icons/fa';
import './ViewLivestock.css';

function ViewLivestock({ livestock, onClose }) {
  if (!livestock) return null;

  return (
    <div className="view-livestock-container">
      <div className="view-livestock-header">
        <h2>Chi tiết vật nuôi</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="view-livestock-content">
        <div className="info-grid">
          <div className="info-group">
            <label>Mã số vật nuôi</label>
            <p>{livestock.id}</p>
          </div>

          <div className="info-group">
            <label>Tên vật nuôi</label>
            <p>{livestock.name}</p>
          </div>

          <div className="info-group">
            <label>Loại vật nuôi</label>
            <p>{livestock.type}</p>
          </div>

          <div className="info-group">
            <label>Giống</label>
            <p>{livestock.breed}</p>
          </div>

          <div className="info-group">
            <label>Giới tính</label>
            <p>{livestock.gender === 'Male' ? 'Đực' : 'Cái'}</p>
          </div>

          <div className="info-group">
            <label>Ngày sinh</label>
            <p>{new Date(livestock.birthDate).toLocaleDateString('vi-VN')}</p>
          </div>

          <div className="info-group">
            <label>Cân nặng</label>
            <p>{livestock.weight} kg</p>
          </div>

          <div className="info-group">
            <label>Trạng thái</label>
            <p className={`status ${livestock.status.toLowerCase()}`}>
              {livestock.status === 'Healthy' ? 'Khỏe mạnh' : 'Khác'}
            </p>
          </div>

          <div className="info-group">
            <label>Ngày tạo</label>
            <p>{new Date(livestock.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLivestock;
