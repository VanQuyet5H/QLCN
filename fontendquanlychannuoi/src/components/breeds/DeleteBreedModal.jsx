import { FaExclamationTriangle } from 'react-icons/fa';
import './DeleteBreedModal.css';

function DeleteBreedModal({ breed, onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="warning-icon">
          <FaExclamationTriangle />
        </div>
        
        <h2>Xác nhận xóa</h2>
        
        <p>
          Bạn có chắc chắn muốn xóa giống <strong>{breed.name}</strong>?
          Hành động này không thể hoàn tác.
        </p>

        <div className="breed-summary">
          <div>Mã giống: <strong>{breed.id}</strong></div>
          <div>Loại: <strong>{breed.type === 'cattle' ? 'Bò thịt' : 
                             breed.type === 'dairy' ? 'Bò sữa' : 'Heo'}</strong></div>
          <div>Xuất xứ: <strong>{breed.origin}</strong></div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-delete" onClick={() => onConfirm(breed.id)}>
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBreedModal;