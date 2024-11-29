import { FaExclamationTriangle } from 'react-icons/fa';
import './DeleteConfirmation.css';

function DeleteConfirmation({ livestock, onConfirm, onCancel }) {
  return (
    <div className="delete-confirmation-container">
      <div className="delete-confirmation-content">
        <div className="warning-icon">
          <FaExclamationTriangle />
        </div>
        
        <h2>Xác nhận xóa</h2>
        
        <p>
          Bạn có chắc chắn muốn xóa vật nuôi có mã số <strong>{livestock.id}</strong>?
          Hành động này không thể hoàn tác.
        </p>

        <div className="livestock-summary">
          <div>Loại: <strong>{livestock.type}</strong></div>
          <div>Giống: <strong>{livestock.breed}</strong></div>
          <div>Vị trí: <strong>{livestock.location}</strong></div>
        </div>

        <div className="confirmation-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn-delete" onClick={() => onConfirm(livestock.id)}>
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;