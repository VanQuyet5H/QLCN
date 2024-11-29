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
            <label>Loại vật nuôi</label>
            <p>{livestock.type}</p>
          </div>

          <div className="info-group">
            <label>Giống</label>
            <p>{livestock.breed}</p>
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
            <label>Nguồn gốc</label>
            <p>{livestock.source || 'Không có'}</p>
          </div>

          <div className="info-group">
            <label>Vị trí chuồng</label>
            <p>{livestock.location}</p>
          </div>

          <div className="info-group">
            <label>Tình trạng sức khỏe</label>
            <p className={`status ${livestock.health}`}>
              {livestock.health === 'healthy' ? 'Khỏe mạnh' : 
               livestock.health === 'sick' ? 'Đang điều trị' : 'Cách ly'}
            </p>
          </div>
        </div>

        <div className="info-section">
          <label>Tiêm phòng</label>
          <div className="vaccination-list">
            {livestock.vaccinations?.length > 0 ? (
              livestock.vaccinations.map((vac, index) => (
                <span key={index} className="vaccination-tag">
                  {vac === 'fmd' ? 'Lở mồm long móng' :
                   vac === 'prrs' ? 'PRRS' : 'Ký sinh trùng'}
                </span>
              ))
            ) : (
              <p className="no-data">Chưa có thông tin tiêm phòng</p>
            )}
          </div>
        </div>

        <div className="info-section">
          <label>Ghi chú</label>
          <p className="notes">{livestock.notes || 'Không có ghi chú'}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewLivestock;