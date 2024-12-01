import './Notification.css';
import React, { useEffect } from "react";
function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Tự động ẩn sau 3 giây

    return () => clearTimeout(timer); // Xóa timer khi component unmount
  }, [onClose]);
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
