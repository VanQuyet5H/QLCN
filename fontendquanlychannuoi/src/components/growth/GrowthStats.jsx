import { FaChartLine, FaWeight, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import './GrowthStats.css';

function GrowthStats({ stats }) {
  return (
    <div className="growth-stats">
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>Tăng trưởng TB</h3>
          <p>{stats.averageGrowth} kg/ngày</p>
          <span className="trend positive">+5% so với tháng trước</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FaWeight />
        </div>
        <div className="stat-content">
          <h3>Tổng đàn theo dõi</h3>
          <p>{stats.totalAnimals} con</p>
          <span className="trend">Đạt mục tiêu {stats.targetAchievement}%</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon warning">
          <FaExclamationTriangle />
        </div>
        <div className="stat-content">
          <h3>Bất thường</h3>
          <p>{stats.abnormalGrowth} con</p>
          <span className="trend negative">Cần kiểm tra</span>
        </div>
      </div>
    </div>
  );
}

export default GrowthStats;