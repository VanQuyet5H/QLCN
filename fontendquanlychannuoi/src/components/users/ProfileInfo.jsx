import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon, 
  CalendarIcon, 
  PencilIcon 
} from '@heroicons/react/24/outline';
import './ProfileInfo.css';
//Form sửa thông tin
const InfoItem = ({ icon: Icon, label, value, onEdit, isEditing, onChange }) => (
  <div className="info-item">
    <Icon className="info-icon" />
    <span className="info-label">{label}:</span>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)} // Cập nhật giá trị khi thay đổi
        className="info-input"
      />
    ) : (
      <span className="info-value">{value}</span>
    )}
    <button className="edit-button" onClick={onEdit}>
      <PencilIcon className="edit-icon" />
      {isEditing ? 'Lưu' : 'Cập nhật'}
    </button>
  </div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2); // Đảm bảo ngày luôn có 2 chữ số
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Dùng dấu backticks để tạo chuỗi template
};

const ProfileInfo = ({ email, phoneNumber, username, createdAt, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phoneNumber);
  const [usernameValue, setUsernameValue] = useState(username);
  
  //gửi dữ li
  const handleEdit = () => {
    if (isEditing) {
      // Khi lưu, gọi hàm onSave để cập nhật thông tin
      onSave({ email: emailValue, phoneNumber: phoneValue, username: usernameValue });
    }
    setIsEditing(!isEditing); // Đổi trạng thái chỉnh sửa
  };

  return (
    <div className="profile-info-card">
      <h2 className="profile-info-title">Thông tin cá nhân</h2>
      <div>
        <InfoItem
          icon={UserIcon}
          label="Username"
          value={usernameValue}
          isEditing={isEditing}
          onEdit={handleEdit}
          onChange={setUsernameValue}
        />
        <InfoItem
          icon={EnvelopeIcon}
          label="Email"
          value={emailValue}
          isEditing={isEditing}
          onEdit={handleEdit}
          onChange={setEmailValue}
        />
        <InfoItem
          icon={PhoneIcon}
          label="Phone"
          value={phoneValue}
          isEditing={isEditing}
          onEdit={handleEdit}
          onChange={setPhoneValue}
        />
        <InfoItem
          icon={CalendarIcon}
          label="Member since"
          value={formatDate(createdAt)}
          isEditing={false} // Không cho phép chỉnh sửa ngày tham gia
          onEdit={() => {}}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;