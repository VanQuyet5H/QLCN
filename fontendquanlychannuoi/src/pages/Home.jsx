import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Dashboard from '../components/Dashboard';
import GrowthTracking from '../components/growth/GrowthTracking';
import BreedList from '../components/breeds/BreedList';
import LivestockList from '../components/livestock/LivestockList';
import DataAnalysis from '../components/statistics/DataAnalysis';
import SummaryReport from '../components/statistics/SummaryReport';
import DiseaseManagement from '../components/veterinary/DiseaseManagement';
import MedicineInventory from '../components/veterinary/MedicineInventory';
import TreatmentGuide from '../components/veterinary/TreatmentGuide';
import VaccinationSchedule from '../components/veterinary/VaccinationSchedule';
import UserProfile from '../components/users/useUserData';
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/livestocklist" element={<LivestockList />} />
        <Route path="/growth" element={<GrowthTracking />} />
        <Route path="/breeds" element={<BreedList />} />
        <Route path="/reports/analysis" element={<DataAnalysis />} />
        <Route path="/reports/summary" element={<SummaryReport />} />
        <Route path="/diseases" element={<DiseaseManagement />} />
        <Route path="/treatmentguids" element={<TreatmentGuide />} />
        <Route path="/medicines" element={<MedicineInventory />} />
        <Route path="/vaccinations" element={<VaccinationSchedule />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Layout>
  );
}

export default Home;