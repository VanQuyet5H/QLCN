import React, { useState } from "react";
import { CameraIcon } from "@heroicons/react/24/solid";
import "./ProfileHeader.css";

const ProfileHeaderItem = ({ label, value, isEditing, onEdit, onChange, isReadOnly }) => (
  <div className="profile-header-item">
    <span className="profile-label">{label}:</span>
    {isEditing && !isReadOnly ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="profile-input"
      />
    ) : (
      <span className="profile-value">{value}</span>
    )}
    {!isReadOnly && (
      <button className="edit-button" onClick={onEdit}>
        {isEditing ? "Lưu" : "Cập nhật"}
      </button>
    )}
  </div>
);

const ProfileHeader = ({ image, fullName, role, onSave }) => {
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [fullNameValue, setFullNameValue] = useState(fullName);
  const [imageValue, setImageValue] = useState(image);
  const [roleValue] = useState(role); // Role không thay đổi, chỉ lưu giá trị mặc định

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageValue(reader.result); // Cập nhật ảnh khi người dùng chọn
        if (onSave) {
          onSave({ fullName: fullNameValue, image: reader.result, role: roleValue });
        }
      };
      reader.readAsDataURL(file); // Đọc file và chuyển đổi thành base64
    }
  };

  return (
    <div className="profile-header">
      {/* Hình đại diện */}
      <div className="profile-avatar">
        <img
          src={imageValue || "/default-avatar.jpg"}
          alt="Profile"
          className="avatar-image"
        />
        <label className="upload-image">
          <CameraIcon className="camera-icon" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
      </div>

      {/* Thông tin người dùng */}
      <div className="profile-info">
        <ProfileHeaderItem
          label="Tên đầy đủ"
          value={fullNameValue}
          isEditing={isEditingFullName}
          onEdit={isEditingFullName ? () => setIsEditingFullName(false) : () => setIsEditingFullName(true)}
          onChange={setFullNameValue}
        />
        <ProfileHeaderItem
          label="Vai trò"
          value={roleValue}
          isEditing={false}  // Không cho phép chỉnh sửa
          isReadOnly={true}  // Role không thể chỉnh sửa
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
