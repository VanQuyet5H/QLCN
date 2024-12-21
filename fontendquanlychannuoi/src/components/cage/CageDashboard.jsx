import { useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import CageList from './CageList';  // Component để hiển thị danh sách chuồng
import CageStatistics from './CageStatistics';  // Component để thống kê chuồng trại
import './CageDashboard.css';  // Bao gồm CSS tùy chỉnh nếu cần
import CreateCage from './CreateCage';

function CageDashboard() {
  const [activeTab, setActiveTab] = useState('addcage'); // Tab mặc định là "Thêm Chuồng"

  // Hàm render nội dung theo tab đang được chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'addcage':
        return <CreateCage/>; // Gọi component để thêm chuồng mới
      case 'cagelist':
        return <CageList />; // Gọi component để hiển thị danh sách chuồng
      case 'cagestatistics':
        return <CageStatistics />; // Gọi component để thống kê chuồng trại
      default:
        return <CreateCage />;
    }
  };

  return (
    <div className="cage-dashboard">
      <Box sx={{ width: '100%', paddingTop: '16px' }}>
        <Tabs
          value={activeTab}
          onChange={(event, newTab) => setActiveTab(newTab)} // Khi người dùng chọn tab mới
          textColor="primary"
          indicatorColor="primary"
          aria-label="Cage Management Dashboard Tabs"
          variant="fullWidth" // Đảm bảo tab trải rộng hết chiều rộng container
        >
          <Tab label="Thêm Chuồng" value="addcage" />
          <Tab label="Danh sách Chuồng" value="cagelist" />
          <Tab label="Thống kê Chuồng Trại" value="cagestatistics" />
        </Tabs>
      </Box>

      <div className="cagedashboard-content" style={{ padding: '16px' }}>
        {renderContent()} {/* Render nội dung dựa trên tab đang được chọn */}
      </div>
    </div>
  );
}

export default CageDashboard;
