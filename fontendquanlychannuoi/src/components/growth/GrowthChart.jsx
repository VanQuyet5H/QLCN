import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GrowthChart.css';

function GrowthChart({ data, metric }) {
  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    return `T${month}/${year}`;
  };

  return (
    <div className="growth-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              `${value} ${metric === 'weight' ? 'kg' : 'con'}`,
              name === 'weight' ? 'Thực tế' : 
              name === 'target' ? 'Mục tiêu' : 'Số lượng'
            ]}
            labelFormatter={formatDate}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#2563eb" 
            name="Thực tế"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#10b981" 
            name="Mục tiêu"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GrowthChart;