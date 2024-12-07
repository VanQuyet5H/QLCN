import { useState } from 'react';
import {
  FaHome,
  FaPiggyBank,
  FaChartBar,
  FaFileAlt,
  FaMedkit,
  FaUser,
  FaCaretDown,
  FaSignOutAlt,
} from 'react-icons/fa';
import './Sidebar.css';
import { useNavigate } from "react-router-dom";
import cowIcon from '../assets/cow.png';

function Sidebar({ isOpen, toggleSidebar }) {
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

 
  const menuItems = [
    {
      icon: <FaHome />,
      text: 'Trang chủ',
      path: '/home',
    },
    {
      icon: <FaPiggyBank />,
      text: 'Quản lý vật nuôi',
      submenu: [
        { text: 'Danh sách đàn', path: '/livestocklist' },
        { text: 'Theo dõi tăng trưởng', path: '/growth' },
        { text: 'Quản lý giống', path: '/breeds' },
      ],
    },
    {
      icon: <FaMedkit />,
      text: 'Thú y',
      submenu: [
        { text: 'Lịch tiêm phòng', path: '/vaccinations' },
        { text: 'Bệnh lý', path: '/diseases' },
        { text: 'Thuốc và vật tư', path: '/medicines' },
        { text: 'Cách điều trị', path: '/treatmentguids' },
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
    {
      icon: <FaFileAlt />,
      text: 'Báo cáo',
      path: '/reports',
    },
    {
      icon: <FaUser />,
      text: 'Tài khoản',
      submenu: [
        { text: 'Thông tin cá nhân', path: '/profile' },
        { text: 'Danh sách tài khoản', path: '/danhsachtaikhoan' },
        { text: 'Đổi mật khẩu', path: '/forgot-password' },
        { text: 'Đăng xuất', path: '/Login', icon: <FaSignOutAlt /> },
        
      ],
    },
  ];

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <button className="toggle-btn" onClick={toggleSidebar}>
            <img src={cowIcon} alt="Cow Icon" width={40} height={40} />
            </button>
          </div>
          {isOpen && (
            <div className="logo-text">
              <span className="logo-title">ANIMAL MANAGER</span>
              <span className="logo-subtitle">Quản lý chăn nuôi</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-container">
            <div
              className={`nav-item ${item.submenu ? 'has-submenu' : ''}`}
              onClick={() => item.submenu?toggleSubmenu(index): navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {isOpen && (
                <>
                  <span className="text">{item.text}</span>
                  {item.submenu && (
                    <span
                      className="submenu-arrow"
                      style={{
                        transform: expandedMenus[index]
                          ? 'rotate(180deg)'
                          : 'none',
                      }}
                    >
                      <FaCaretDown />
                    </span>
                  )}
                </>
              )}
            </div>

            {isOpen && item.submenu && expandedMenus[index] && (
              <div className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    href={subItem.path}
                    className="submenu-item"
                    onClick={() => navigate(subItem.path)}
                  >
                    {subItem.icon && (
                      <span className="submenu-icon">{subItem.icon}</span>
                    )}
                    {subItem.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
    </div>
  );
}

export default Sidebar;
