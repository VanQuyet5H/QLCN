import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import AnalysisFilter from './AnalysisFilter';
import './DataAnalysis.css';

function DataAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  const growthData = [
    { date: '2023-06', actual: 0.82, target: 0.80, efficiency: 3.2 },
    { date: '2023-07', actual: 0.85, target: 0.80, efficiency: 3.1 },
    { date: '2023-08', actual: 0.87, target: 0.80, efficiency: 3.0 },
    { date: '2023-09', actual: 0.84, target: 0.80, efficiency: 3.2 },
    { date: '2023-10', actual: 0.86, target: 0.80, efficiency: 3.1 },
    { date: '2023-11', actual: 0.88, target: 0.80, efficiency: 3.0 }
  ];

  const distributionData = [
    { range: '0-100', count: 45 },
    { range: '101-200', count: 78 },
    { range: '201-300', count: 95 },
    { range: '301-400', count: 68 },
    { range: '401-500', count: 42 },
    { range: '500+', count: 22 }
  ];

  return (
    <div className="data-analysis">
      <div className="analysis-header">
        <h2>Phân tích dữ liệu</h2>
        <AnalysisFilter
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </div>

      <div className="analysis-grid">
        <div className="chart-card">
          <h3>Tăng trưởng theo thời gian</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563eb" 
                  name="Thực tế"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  name="Mục tiêu"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Phân bố cân nặng</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#7c3aed" 
                  fill="#8b5cf6" 
                  name="Số lượng"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analysis-insights">
        <h3>Phân tích chi tiết</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Tăng trưởng</h4>
            <p>Tốc độ tăng trưởng trung bình đạt 0.85 kg/ngày, cao hơn 6.25% so với mục tiêu.</p>
          </div>
          <div className="insight-card">
            <h4>Hiệu quả</h4>
            <p>Hệ số chuyển đổi thức ăn (FCR) trung bình là 3.1, cải thiện 3% so với kỳ trước.</p>
          </div>
          <div className="insight-card">
            <h4>Xu hướng</h4>
            <p>Tăng trưởng có xu hướng cải thiện trong 3 tháng gần đây, đặc biệt ở nhóm bò thịt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalysis;