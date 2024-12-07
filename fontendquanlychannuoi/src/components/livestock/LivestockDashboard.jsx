import { useState } from 'react';
import LivestockList from './LivestockList';
import AddLivestock from './AddLivestock';
import './LivestockDashboard.css';

function LivestockDashboard() {
  const [activeTab, setActiveTab] = useState('livestocklist');

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
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'addlivestock' ? 'active' : ''}`}
          onClick={() => setActiveTab('addlivestock')}
        >
          Nhập thông tin vật nuôi
        </button>
        <button
          className={`tab-button ${activeTab === 'livestocklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('livestocklist')}
        >
          Danh sách vật nuôi
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default LivestockDashboard;