import { useState } from 'react';
import { Button, Tab, Tabs, Box, Typography } from '@mui/material';
import LivestockList from './LivestockList';
import AddLivestock from './AddLivestock';
import GrowthStatics from './GrowthStatistics';
import './LivestockDashboard.css';

function LivestockDashboard() {
  const [activeTab, setActiveTab] = useState('addlivestock');

  const renderContent = () => {
    switch (activeTab) {
      case 'addlivestock':
        return <AddLivestock />;
      case 'livestocklist':
        return <LivestockList />;
      case 'growthStatics': // Thêm case cho tab "Theo dõi vật nuôi"
        return <GrowthStatics />;
      default:
        return <LivestockList />;
    }
  };

  return (
    <div className="livestock-dashboard">
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(event, newTab) => setActiveTab(newTab)}
          textColor="primary"
          indicatorColor="primary"
          aria-label="Livestock Dashboard Tabs"
          variant="fullWidth"
        >
          <Tab label="Nhập thông tin vật nuôi" value="addlivestock" />
          <Tab label="Danh sách vật nuôi" value="livestocklist" />
          <Tab label="Thống kê theo dõi vật nuôi" value="growthStatics" /> {/* Thêm tab "Theo dõi vật nuôi" */}
        </Tabs>
      </Box>

      <div className="dashboard-content" style={{ padding: '16px', overflowX: 'hidden' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default LivestockDashboard;
