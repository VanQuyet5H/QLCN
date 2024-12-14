import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Dashboard from '../components/Dashboard';
import GrowthTracking from '../components/growth/GrowthTracking';
import BreedList from '../components/breeds/BreedList';
import DataAnalysis from '../components/statistics/DataAnalysis';
import SummaryReport from '../components/statistics/SummaryReport';
import DiseaseManagement from '../components/veterinary/DiseaseManagement';
import MedicineInventory from '../components/veterinary/MedicineInventory';
import TreatmentGuide from '../components/veterinary/TreatmentGuide';
import VaccinationSchedule from '../components/veterinary/VaccinationSchedule';
import UserProfile from '../components/users/useUserData';
import DanhSachAccount from '../components/users/DanhSachAccount';
import LivestockDashboard from '../components/livestock/LivestockDashboard';
import GeneralSettings from '../components/settings/GeneralSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/livestockdashdoard" element={<LivestockDashboard />} />
        <Route path="/growth" element={<GrowthTracking />} />
        <Route path="/breeds" element={<BreedList />} />
        <Route path="/reports/analysis" element={<DataAnalysis />} />
        <Route path="/reports/summary" element={<SummaryReport />} />
        <Route path="/diseases" element={<DiseaseManagement />} />
        <Route path="/treatmentguids" element={<TreatmentGuide />} />
        <Route path="/medicines" element={<MedicineInventory />} />
        <Route path="/vaccinations" element={<VaccinationSchedule />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/userlist" element={<DanhSachAccount />} />
        <Route path="/settings/general" element={<GeneralSettings />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/settings/security" element={<SecuritySettings />} />
      </Routes>
    </Layout>
  );
}

export default Home;