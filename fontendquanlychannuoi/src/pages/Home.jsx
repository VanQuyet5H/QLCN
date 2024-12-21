import { useEffect,useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Dashboard from '../components/Dashboard';
import GrowthTracking from '../components/growth/GrowthTracking';
import BreedList from '../components/breeds/BreedList';
import DataAnalysis from '../components/statistics/DataAnalysis';
import SummaryReport from '../components/statistics/SummaryReport';
import TreatmentGuide from '../components/veterinary/TreatmentGuide';
import VaccinationSchedule from '../components/veterinary/VaccinationSchedule';
import UserProfile from '../components/users/useUserData';
import DanhSachAccount from '../components/users/DanhSachAccount';
import LivestockDashboard from '../components/livestock/LivestockDashboard';
import GeneralSettings from '../components/settings/GeneralSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import SickAnimalsList from "../components/HealthAnimal/SickAnimalsList";
import AddHealthRecord from "../components/HealthAnimal/AddHealthRecord";
import AddMedication from '../components/Medication/AddMedication';
import MedicationStock from '../components/Medication/MedicationStock';
import CreateTreatmentForm from '../components/HealthAnimal/CreateTreatmentForm';
import VaccinationForm from '../components/veterinary/VaccinationForm';
import EditVaccination from '../components/veterinary/EditVaccination';
import DietCalculator from '../components/Feed/DietCalculator';
import AddAnimalCage from '../components/cage/AddAnimalToCage';
import MenuCage from '../components/cage/CageDashboard';
import HealthAnimalDashboard from "../components/HealthAnimal/HealthAnimalDashboard";
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
   // Lấy giá trị theme từ localStorage, nếu không có thì mặc định là 'light'
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');
  
    // Cập nhật theme vào localStorage khi theme thay đổi
    useEffect(() => {
      localStorage.setItem('theme', themeMode);
    }, [themeMode]);
  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/livestockdashdoard" element={<LivestockDashboard />} />
        <Route path="/menucage" element={<MenuCage />} />
        <Route path="/growth" element={<GrowthTracking />} />
        <Route path="/breeds" element={<BreedList />} />
        <Route path="/reports/analysis" element={<DataAnalysis />} />
        <Route path="/reports/summary" element={<SummaryReport />} />
        <Route path="/treatmentguids" element={<TreatmentGuide />} />
        <Route path="/vaccinations" element={<VaccinationSchedule />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/userlist" element={<DanhSachAccount />} />
        <Route path="/settings/general" element={<GeneralSettings setThemeMode={setThemeMode}/>} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/settings/security" element={<SecuritySettings />} />
        <Route path="/sick-animals" element={<SickAnimalsList />} />
        <Route path="/add-health-record/:animalId" element={<AddHealthRecord />} />
        <Route path="/add-medication" element={<AddMedication />} />
        <Route path="/medication-stock" element={<MedicationStock />} />
        <Route path="/treatment" element={<CreateTreatmentForm />} />
        <Route path="/add-schedule" element={<VaccinationForm />} />
        <Route path="/edit-schedule/:id" element={<EditVaccination />} />
        <Route path="/DietCalculator" element={<DietCalculator />} />
        <Route path="/themvatnuoivaochuong" element={<AddAnimalCage />} />
        <Route path="/healthanimaldashboard" element={<HealthAnimalDashboard />} />
      </Routes>
    </Layout>
  );
}

export default Home;