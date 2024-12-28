import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCog, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
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
  min-width: 300px;
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
  const [recentActivities, setRecentActivities] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: '', role: '', image: '' });
  const [notifications, setNotifications] = useState([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const id = localStorage.getItem('id');
  const navigate = useNavigate();
  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get("https://localhost:7185/api/Dashboard/recent-activities");
      console.log("API Response:", response.data);
  
      if (response.status === 200 && Array.isArray(response.data)) {
        const storedNotifications = localStorage.getItem("readNotifications");
        const readNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        console.log("Stored Notifications:", readNotifications);
  
        const activities = response.data
          .map((item) => {
            if (!item.id) {
              console.warn("Missing ID for activity:", item);
              return null;
            }
            return {
              ...item,
              isRead: readNotifications.includes(item.id),
            };
          })
          .filter((item) => item !== null); // Loại bỏ phần tử null
  
        console.log("Mapped Activities:", activities);
        setRecentActivities(activities);
      } else {
        console.warn("Unexpected API Response Format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };
  
  
  
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
    const storedNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
    
    console.log("Dữ liệu từ localStorage:", storedNotifications);
  
    // Kiểm tra nếu dữ liệu hợp lệ trước khi sử dụng
    if (Array.isArray(storedNotifications)) {
      // Đồng bộ với state chỉ khi trạng thái đã thay đổi
      setRecentActivities((prevActivities) => {
        return prevActivities.map((activity) => {
          // Cập nhật trạng thái thông báo đã đọc từ localStorage
          if (storedNotifications.includes(activity.id)) {
            return { ...activity, isRead: true };
          }
          return activity;
        });
      });
      console.log("Thông báo đã đọc từ localStorage:", storedNotifications);
    } else {
      console.error("Dữ liệu không hợp lệ trong localStorage:", storedNotifications);
    }
  }, []);
  
  // Cập nhật sau khi xóa thông báo
  const removeNotification = (notification) => {
    console.log("Xóa thông báo:", notification);
  
    // Xóa thông báo khỏi state
    setRecentActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.id !== notification.id)
    );
  
    // Cập nhật trạng thái trong localStorage
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
    const updatedNotifications = readNotifications.filter((id) => id !== notification.id);
  
    if (Array.isArray(updatedNotifications)) {
      // Cập nhật lại localStorage với các thông báo đã xóa
      localStorage.setItem('readNotifications', JSON.stringify(updatedNotifications));
      console.log("Cập nhật trong localStorage, thông báo đã xóa:", updatedNotifications);
    } else {
      console.error("Dữ liệu không hợp lệ khi lưu vào localStorage:", updatedNotifications);
    }
  };
  
  // Cập nhật thông báo đã đọc khi người dùng nhấp vào
  const markAsRead = (notificationId) => {
    setRecentActivities((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
    if (!readNotifications.includes(notificationId)) {
      localStorage.setItem(
        'readNotifications',
        JSON.stringify([...readNotifications, notificationId])
      );
    }
  };
  

  
  
  const handleSettingsClick = (setting) => {
    console.log('Setting clicked:', setting);
    setShowSettingsMenu(false);
  };

  // Logout function
  const handleLogout = () => {
    // Clear localStorage or any session data
    localStorage.removeItem('id');
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/Login');
  };
  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return (
    <HeaderContainer isExpanded={isExpanded}>
      <HeaderLeft>
        <h1>Quản lý chăn nuôi</h1>
      </HeaderLeft>

      <HeaderRight>
      <div style={{ position: 'relative' }}>
          <IconButton onClick={() => setShowNotificationMenu((prev) => !prev)}>
            <FaBell />
            {recentActivities.some((activity) => !activity.isRead) && (
              <NotificationBadge>
                {recentActivities.filter((activity) => !activity.isRead).length}
              </NotificationBadge>
            )}
          </IconButton>
          {showNotificationMenu && (
            <DropdownMenu>
              {recentActivities.length > 0 ? (
                recentActivities.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      backgroundColor: notification.isRead ? 'white' : '#f0f0f0',
                    }}
                  >
                    {notification.action}
                  </MenuItem>
                ))
              ) : (
                <p style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic' }}>
                  Không có thông báo
                </p>
              )}
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
                <FaBell /> <NoUnderlineLink to="/settings/notifications">Cài đặt thông báo</NoUnderlineLink>
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
              <MenuItem onClick={handleLogout}> {/* Logout functionality */}
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
