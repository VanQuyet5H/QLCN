import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const SettingsContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: #1e293b;
  display: inline-block; /* Giữ Title ở dạng inline */
  position: relative;
`;

const SettingOption = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--primary-color);
  }

  &:hover {
    border-color: #4CAF50; /* Chỉnh màu khi hover */
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--primary-color);
  }

  &:hover {
    border-color: #4CAF50; /* Chỉnh màu khi hover */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 1.5rem;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #64748b;
  margin-top: 1.2rem; 
  margin-right: -2.8rem;

  &:hover {
    color: #ff0000; /* Màu đỏ khi hover */
  }
`;
const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &.save {
    background-color: var(--primary-color);
    color: white;
  }

  &.save:hover {
    background-color: #4CAF50; /* Chỉnh màu khi hover */
  }

  &.cancel {
    background-color: #d1d5db;
    color: #1e293b;
  }

  &.cancel:hover {
    background-color: #9ca3af; /* Màu hover cho nút hủy */
  }
  
`;
const NoUnderlineLink = styled(Link)`
  text-decoration: none; /* Loại bỏ gạch chân */
  color: inherit; /* Duy trì màu chữ mặc định của bạn */
`;
const GeneralSettings = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'vi');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Lưu lựa chọn ngôn ngữ và theme vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language; // Cập nhật thuộc tính lang trong HTML

    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark'); // Thêm/loại bỏ class cho theme tối
  }, [language, theme]);

  const handleSave = () => {
    // Nếu bạn muốn gửi dữ liệu lên API, bạn có thể làm ở đây
    console.log('Saved settings:', { language, theme });
  };

  const handleCancel = () => {
    // Reset fields hoặc quay lại trạng thái ban đầu
    setLanguage(localStorage.getItem('language') || 'vi');
    setTheme(localStorage.getItem('theme') || 'light');
    console.log('Changes discarded');
  };
  const handleClose = () => {
    <Link to='./home'></Link>
  };
  return (
    <SettingsContainer>
      <Title>Cài đặt chung</Title>
      <CloseButton onClick={handleClose}>
      <NoUnderlineLink to="/home"><FaTimes /></NoUnderlineLink>
      </CloseButton>
      <SettingOption>
        <SettingLabel>Ngôn ngữ</SettingLabel>
        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          {/* Bạn có thể thêm nhiều ngôn ngữ khác ở đây */}
        </Select>
      </SettingOption>
      
      <SettingOption>
        <SettingLabel>Theme</SettingLabel>
        <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Sáng</option>
          <option value="dark">Tối</option>
        </Select>
      </SettingOption>
      
      <ButtonGroup>
        <Button className="save" onClick={handleSave}>Lưu</Button>
        <Button className="cancel" onClick={handleCancel}>Hủy</Button>
      </ButtonGroup>
    </SettingsContainer>
  );
};

export default GeneralSettings;
