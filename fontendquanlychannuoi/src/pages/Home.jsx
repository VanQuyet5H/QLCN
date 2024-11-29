import { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';
import LivestockList from'../components/livestock/LivestockList';
function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
        <header className={`header ${!isSidebarOpen ? 'expanded' : ''}`}>
          <div className="header-left">
            <h1>Quản lý chăn nuôi</h1>
          </div>
          <div className="header-right">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>
        <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/livestocklist" element={<LivestockList />} />
            </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;