import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCog, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.isExpanded ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'};
  height: var(--header-height);
  background: white;
  z-index: 100;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 0.5rem 0;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: #f8fafc;
    color: var(--primary-color);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`;

const NotificationDetailModal = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 1100;
`;

const NoUnderlineLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function Header({ isExpanded }) {
  const [userInfo, setUserInfo] = useState({ username: '', role: '', image: '' });
  const [notifications, setNotifications] = useState([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://localhost:7185/api/Auth/Profile`, {
          params: { id },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { username, role, image } = response.data;
        setUserInfo({ username, role, image });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/Notifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  const handleCloseNotificationDetail = () => {
    setShowNotificationDetail(false);
    setSelectedNotification(null);
  };

  const handleSettingsClick = (setting) => {
    console.log('Setting clicked:', setting);
    setShowSettingsMenu(false);
  };

  return (
    <HeaderContainer isExpanded={isExpanded}>
      <HeaderLeft>
        <h1>Quản lý chăn nuôi</h1>
      </HeaderLeft>

      <HeaderRight>
      <div style={{ position: 'relative' }}>
    <IconButton title="Thông báo" onClick={() => setShowNotificationMenu(!showNotificationMenu)}>
      <FaBell />
      <NotificationBadge>{notifications.length}</NotificationBadge>
    </IconButton>

    {showNotificationMenu && (
      <DropdownMenu>
        {notifications.map((notification, index) => (
          <MenuItem key={index} onClick={() => handleNotificationClick(notification)}>
            <FaBell /> {notification.title}
          </MenuItem>
        ))}
      </DropdownMenu>
    )}
  </div>

        

        <div style={{ position: 'relative' }}>
          <IconButton title="Cài đặt hệ thống" onClick={() => setShowSettingsMenu(!showSettingsMenu)}>
            <FaCog />
          </IconButton>

          {showSettingsMenu && (
            <DropdownMenu>
              <MenuItem onClick={() => handleSettingsClick('general')}>
                <FaCog /> <NoUnderlineLink to="/settings/general">Cài đặt chung</NoUnderlineLink>
              </MenuItem>
              <MenuItem onClick={() => handleSettingsClick('notifications')}>
                <FaBell />  <NoUnderlineLink to="/settings/notifications">Cài đặt thông báo</NoUnderlineLink>
              </MenuItem>
              <MenuItem onClick={() => handleSettingsClick('security')}>
                <FaUser /> <NoUnderlineLink to="/settings/security">Bảo mật</NoUnderlineLink>
              </MenuItem>
            </DropdownMenu>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
            <UserAvatar>
              {userInfo.image ? (
                <img src={userInfo.image} alt="User Avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              ) : (
                <FaUser />
              )}
            </UserAvatar>
            <UserDetails>
              <UserName>{userInfo.username || 'Tên người dùng'}</UserName>
              <UserRole>{userInfo.role || 'Vai trò'}</UserRole>
            </UserDetails>
          </UserInfo>

          {showUserMenu && (
            <DropdownMenu>
              <MenuItem onClick={() => handleSettingsClick('profile')}>
                <FaUser /> <NoUnderlineLink to="/profile">Thông tin cá nhân</NoUnderlineLink>
              </MenuItem>
              <MenuItem onClick={() => console.log('Logging out...')}>
                <FaSignOutAlt /> Đăng xuất
              </MenuItem>
            </DropdownMenu>
          )}
        </div>
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;
