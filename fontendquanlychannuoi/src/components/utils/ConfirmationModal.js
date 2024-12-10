// ConfirmationModal.js
import React from 'react';
import './confirmationmodal.css';
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Hủy</button>
          <button onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
