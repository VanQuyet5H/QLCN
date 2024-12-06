import { FaExclamationTriangle } from 'react-icons/fa';
import './DeleteConfirmation.css';

function DeleteConfirmation({ livestock, onConfirm, onCancel }) {
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Điều chỉnh nếu tháng hiện tại chưa đến ngày sinh nhật.
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age > 0 ? `${age} năm` : '< 1 năm';
  };
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
          <div>BirthDate: <strong>{calculateAge(livestock.birthDate)}</strong></div>
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