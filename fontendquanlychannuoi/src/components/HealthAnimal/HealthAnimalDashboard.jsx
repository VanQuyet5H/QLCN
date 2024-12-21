import { useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import AnimalHistory from './AnimalHistory';  // Component để hiển thị danh sách bản ghi sức khỏe
import HealthStatistics from './HealthStatistics';  // Component để thống kê sức khỏe vật nuôi
import './HealthAnimalDashboard.css';  // Bao gồm CSS tùy chỉnh nếu cần
import SickAnimalsList from './SickAnimalsList'; // Component để theo dõi vật nuôi bệnh

function HealthAnimalDashboard() {
  const [activeTab, setActiveTab] = useState('sickanimalslist'); // Tab mặc định là "Theo dõi vật nuôi bệnh"

  // Hàm render nội dung theo tab đang được chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'sickanimalslist':
        return <SickAnimalsList />; // Gọi component để theo dõi vật nuôi bệnh
      case 'animalhistory':
        return <AnimalHistory />; // Gọi component để hiển thị danh sách bản ghi sức khỏe
      case 'healthstatistics':
        return <HealthStatistics />; // Gọi component để thống kê sức khỏe vật nuôi
      default:
        return <SickAnimalsList />;
    }
  };

  return (
    <div className="health-animal-dashboard">
      <Box sx={{ width: '100%', paddingTop: '16px' }}>
        <Tabs
          value={activeTab}
          onChange={(event, newTab) => setActiveTab(newTab)} // Khi người dùng chọn tab mới
          textColor="primary"
          indicatorColor="primary"
          aria-label="Health Animal Dashboard Tabs"
          variant="fullWidth" // Đảm bảo tab trải rộng hết chiều rộng container
        >
          <Tab label="Theo dõi vật nuôi bệnh" value="sickanimalslist" />
          <Tab label="Danh Sách Bản Ghi Sức Khỏe" value="animalhistory" />
          <Tab label="Thống Kê Sức Khỏe" value="healthstatistics" />
        </Tabs>
      </Box>

      <div className="healthanimal-dashboard-content" style={{ padding: '16px' }}>
        {renderContent()} {/* Render nội dung dựa trên tab đang được chọn */}
      </div>
    </div>
  );
}

export default HealthAnimalDashboard;
