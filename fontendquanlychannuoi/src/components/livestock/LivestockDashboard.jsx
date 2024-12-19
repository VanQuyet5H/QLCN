import { useState } from 'react';
import { Button, Tab, Tabs, Box } from '@mui/material';
import LivestockList from './LivestockList';
import AddLivestock from './AddLivestock';
import './LivestockDashboard.css'; // Add this line to include custom CSS if needed.

function LivestockDashboard() {
  const [activeTab, setActiveTab] = useState('addlivestock');

  const renderContent = () => {
    switch (activeTab) {
      case 'addlivestock':
        return <AddLivestock />;
      case 'livestocklist':
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
          variant="fullWidth" // Ensure the tabs stretch to fill the container width
        >
          <Tab label="Nhập thông tin vật nuôi" value="addlivestock" />
          <Tab label="Danh sách vật nuôi" value="livestocklist" />
        </Tabs>
      </Box>

      <div className="dashboard-content" style={{ padding: '16px', overflowX: 'hidden' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default LivestockDashboard;
