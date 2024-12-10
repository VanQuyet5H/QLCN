import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './EditLivestock.css';

function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cập Nhật Thông Tin Vật Nuôi</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
