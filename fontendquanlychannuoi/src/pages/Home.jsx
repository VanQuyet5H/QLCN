import { useState,useEffect } from 'react';
import {Routes, Route,useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ThemeToggle from '../components/ThemeToggle';
import GrowthTracking from '../components/growth/GrowthTracking';
import Breed from '../components/breeds/BreedList';
import './Home.css';
import LivestockList from'../components/livestock/LivestockList';
import Statistic from '../components/statistics/DataAnalysis';
import SummaryReport from '../components/statistics/SummaryReport';
import DiseaseManagement from '../components/veterinary/DiseaseManagement';
import MedicineInventory from '../components/veterinary/MedicineInventory';
import TreatmentGuide from '../components/veterinary/TreatmentGuide';
import VaccinationSchedule from '../components/veterinary/VaccinationSchedule';
function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const token = localStorage.getItem('token'); // Hoặc cách lấy token của bạn
    if (!token) {
      navigate('/login'); // Điều hướng về Login nếu không có token
    }
  }, [navigate]);
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
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/livestocklist" element={<LivestockList />} />
              <Route path="/growth" element={<GrowthTracking />} />
              <Route path="/breeds" element={<Breed />} />
              <Route path="/reports/analysis" element={<Statistic />} />
              <Route path="/reports/summary" element={<SummaryReport />} />
              <Route path="/diseases" element={<DiseaseManagement />} />
              <Route path="/treatmentguids" element={<TreatmentGuide />} />
              <Route path="/medicines" element={<MedicineInventory />} />
              <Route path="/vaccinations" element={<VaccinationSchedule />} />
            </Routes>
        </div>
      </div>
    </div>
    
  );
}

export default Home;