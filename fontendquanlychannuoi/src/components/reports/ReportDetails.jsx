import { useState } from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';
import './ReportDetails.css';

function ReportDetails({ data }) {
  const [activeTab, setActiveTab] = useState('farm');
  const { byFarm, byCategory } = data;

  return (
    <div className="report-details">
      <div className="details-header">
        <h2>Chi tiết báo cáo</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'farm' ? 'active' : ''}`}
            onClick={() => setActiveTab('farm')}
          >
            Theo trang trại
          </button>
          <button
            className={`tab-button ${activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            Theo loại
          </button>
        </div>
      </div>

      <div className="details-content">
        {activeTab === 'farm' ? (
          <div className="table-container">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Mã số</th>
                  <th>Trang trại</th>
                  <th>Địa điểm</th>
                  <th>Công suất</th>
                  <th>Hiện tại</th>
                  <th>Tỷ lệ khỏe mạnh</th>
                  <th>Hiệu suất</th>
                </tr>
              </thead>
              <tbody>
                {byFarm.map(farm => (
                  <tr key={farm.id}>
                    <td>{farm.id}</td>
                    <td>{farm.name}</td>
                    <td>{farm.location}</td>
                    <td>{formatNumber(farm.capacity)}</td>
                    <td>{formatNumber(farm.currentStock)}</td>
                    <td>{farm.healthyRate}</td>
                    <td>{farm.efficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Số lượng</th>
                  <th>Cân nặng TB (kg)</th>
                  <th>Tăng trưởng (kg/ngày)</th>
                  <th>Chi phí thức ăn</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {byCategory.map((category, index) => (
                  <tr key={index}>
                    <td>{category.category}</td>
                    <td>{formatNumber(category.count)}</td>
                    <td>{formatNumber(category.avgWeight)}</td>
                    <td>{category.growthRate || '-'}</td>
                    <td>{formatCurrency(category.feedCost)}</td>
                    <td>{formatCurrency(category.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDetails;