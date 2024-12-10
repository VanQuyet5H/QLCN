import { useState } from 'react';
import styled from 'styled-components';
import { FaCog, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';

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

function Header({ isExpanded }) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
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
        <IconButton title="Thông báo">
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>

        <div style={{ position: 'relative' }}>
          <IconButton 
            title="Cài đặt hệ thống"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          >
            <FaCog />
          </IconButton>

          {showSettingsMenu && (
            <DropdownMenu>
              <MenuItem onClick={() => handleSettingsClick('general')}>
                <FaCog /> Cài đặt chung
              </MenuItem>
              <MenuItem onClick={() => handleSettingsClick('notifications')}>
                <FaBell /> Cài đặt thông báo
              </MenuItem>
              <MenuItem onClick={() => handleSettingsClick('security')}>
                <FaUser /> Bảo mật
              </MenuItem>
            </DropdownMenu>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
            <UserAvatar>
              <FaUser />
            </UserAvatar>
            <UserDetails>
              <UserName>Admin</UserName>
              <UserRole>Quản trị viên</UserRole>
            </UserDetails>
          </UserInfo>

          {showUserMenu && (
            <DropdownMenu>
              <MenuItem onClick={() => handleSettingsClick('profile')}>
                <FaUser /> Thông tin cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogout}>
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