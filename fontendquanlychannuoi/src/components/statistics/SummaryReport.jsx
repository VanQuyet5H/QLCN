import { useState } from 'react';
import { FaChartLine, FaPiggyBank, FaWeight, FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatisticCard from './StatisticCard';
import './SummaryReport.css';

function SummaryReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const statistics = {
    totalLivestock: {
      title: 'Tổng đàn',
      value: '450',
      trend: '+5%',
      icon: <FaPiggyBank />,
      details: 'Bò: 150, Heo: 300'
    },
    averageWeight: {
      title: 'Khối lượng TB',
      value: '285 kg',
      trend: '+12kg',
      icon: <FaWeight />,
      details: 'Tăng 4.4% so với tháng trước'
    },
    growthRate: {
      title: 'Tốc độ tăng trưởng',
      value: '0.85 kg/ngày',
      trend: '+0.05',
      icon: <FaChartLine />,
      details: 'Vượt 6% so với mục tiêu'
    },
    timeToMarket: {
      title: 'Thời gian xuất chuồng',
      value: '185 ngày',
      trend: '-5 ngày',
      icon: <FaCalendarAlt />,
      details: 'Nhanh hơn 3% so với kế hoạch'
    }
  };

  const monthlyData = [
    { month: 'T1', bò: 145, heo: 280 },
    { month: 'T2', bò: 148, heo: 285 },
    { month: 'T3', bò: 152, heo: 290 },
    { month: 'T4', bò: 147, heo: 295 },
    { month: 'T5', bò: 150, heo: 298 },
    { month: 'T6', bò: 153, heo: 300 }
  ];

  return (
    <div className="summary-report">
      <div className="report-header">
        <h2>Báo cáo tổng hợp</h2>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      <div className="statistics-grid">
        {Object.values(statistics).map((stat, index) => (
          <StatisticCard key={index} {...stat} />
        ))}
      </div>

      <div className="chart-section">
        <h3>Biến động đàn theo tháng</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bò" fill="#2563eb" name="Bò" />
              <Bar dataKey="heo" fill="#7c3aed" name="Heo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SummaryReport;