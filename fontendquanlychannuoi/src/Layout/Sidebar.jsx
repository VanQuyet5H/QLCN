import styled from 'styled-components';
import { FaTimes, FaHome, FaPiggyBank, FaChartBar, FaFileAlt, FaMedkit, FaUser, FaCaretDown, FaSignOutAlt,FaPaw } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import cowIcon from '../assets/cow.png';
import { useState } from 'react';

const SidebarWrapper = styled.aside`
  width: ${(props) => (props.isOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)')};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    transform: translateX(${(props) => (props.isOpen ? '0' : '-100%')});
    width: var(--sidebar-width);
  }

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

const SidebarHeader = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  min-height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm};
  display: none;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const LogoText = styled.div`
  margin-left: ${(props) => props.theme.spacing.md};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};

  .logo-title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .logo-subtitle {
    font-size: 0.9rem;
  }
`;

const NavMenu = styled.nav`
  padding: ${(props) => props.theme.spacing.md};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? 'flex-start' : 'center')};
  padding: ${(props) => props.theme.spacing.md};
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
     transform: translateX(${(props) => (props.isOpen ? '5px' : '0')});
  }
  svg {
    margin-right: ${(props) => (props.isOpen ? props.theme.spacing.md : '0')}; /* Chỉ cách khi mở */
    font-size: ${(props) => (props.isOpen ? '1.2rem' : '1.5rem')};
  }

  span {
    display: ${(props) => (props.isOpen ? 'inline' : 'none')}; /* Ẩn text khi thu nhỏ */
    font-size: 1.25rem;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

  }
  
`;

const Submenu = styled.div`
  padding-left: ${(props) => props.theme.spacing.lg};
`;

const SubmenuItem = styled(NavLink)`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: ${(props) => props.theme.spacing.sm};
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const menuItems = [
    { icon: <FaHome />, text: 'Trang chủ', path: '/home' },
    {
      icon: <FaPiggyBank />,
      text: 'Quản lý vật nuôi',
      submenu: [
        { text: 'Danh sách đàn', path: '/livestockdashdoard' },
        { text: 'Theo dõi tăng trưởng', path: '/growth' },
        { text: 'Quản lý giống', path: '/breeds' },
      ],
    },
    {
      icon: <FaMedkit />,
      text: 'Thú y',
      submenu: [
        { text: 'Lịch tiêm phòng', path: '/vaccinations' },
        { text: 'Vật nuôi bị bệnh', path: '/sick-animals' },
        { text: 'Kho Thuốc', path: '/medication-stock' },
        { text: 'Điều trị', path: '/treatment' },
        { text: 'Bệnh thường gặp', path: '/treatmentguids' },
      ],
    },
    {
      icon: <FaPaw />,
      text: 'Chế độ ăn',
      submenu: [
        { text: 'Dinh dưỡng', path: '/DietCalculator' },
        { text: 'Theo dõi', path: '/reports/analysis' },
      ],
    },
    {
      icon: <FaChartBar />,
      text: 'Thống kê',
      submenu: [
        { text: 'Báo cáo tổng hợp', path: '/reports/summary' },
        { text: 'Phân tích dữ liệu', path: '/reports/analysis' },
      ],
    },
    { icon: <FaFileAlt />, text: 'Báo cáo', path: '/reports' },
    {
      icon: <FaUser />,
      text: 'Tài khoản',
      submenu: [
        { text: 'Thông tin cá nhân', path: '/profile' },
        { text: 'Danh sách tài khoản', path: '/userlist' },
        { text: 'Đổi mật khẩu', path: '/forgot-password' },
        { text: 'Đăng xuất', path: '/Login', icon: <FaSignOutAlt /> },
      ],
    },
  ];

  return (
    <SidebarWrapper isOpen={isOpen}>
      <SidebarHeader>
        <LogoContainer>
          <LogoImage src={cowIcon} alt="Cow Icon" onClick={toggleSidebar} />
          <LogoText isOpen={isOpen}>
            <div className="logo-title">ANIMAL MANAGER</div>
            <div className="logo-subtitle">Quản lý chăn nuôi</div>
          </LogoText>
        </LogoContainer>
        <CloseButton onClick={toggleSidebar}>
          <FaTimes />
        </CloseButton>
      </SidebarHeader>

      <NavMenu>
        {menuItems.map((item, index) => (
          <div key={index}>
            <NavItem to={item.path} isOpen={isOpen} onClick={() => item.submenu && toggleSubmenu(index)}>
            <span className="icon">{item.icon}</span>
              {isOpen && <span>{item.text}</span>}
              {item.submenu && <FaCaretDown style={{ transform: expandedMenus[index] ? 'rotate(180deg)' : 'none' }} />}
            </NavItem>
            {item.submenu && isOpen && expandedMenus[index] && (
              <Submenu>
                {item.submenu.map((subItem, subIndex) => (
                  <SubmenuItem key={subIndex} to={subItem.path} isOpen={isOpen}>
                    {subItem.text}
                  </SubmenuItem>
                ))}
              </Submenu>
            )}
          </div>
        ))}
      </NavMenu>
    </SidebarWrapper>
  );
};

export default Sidebar;
