import { useState, useEffect } from 'react';
import { FaChartLine, FaWeight, FaCalendarAlt, FaArrowUp } from 'react-icons/fa';
import { format, subDays } from 'date-fns';
import GrowthChart from './GrowthChart';
import GrowthStats from './GrowthStats';
import GrowthTable from './GrowthTable';
import GrowthFilter from './GrowthFilter';
import GrowthAlerts from './GrowthAlerts';
import WeightRecordModal from './WeightRecordModal';
import { calculateGrowthRate, analyzeGrowthTrend } from './utils/growthCalculations';
import './GrowthTracking.css';

function GrowthTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Mock data - trong thực tế sẽ lấy từ API
  const growthData = {
    stats: {
      averageGrowth: 0.8,
      totalAnimals: 150,
      targetAchievement: 95,
      abnormalGrowth: 3,
      weightGainLastWeek: 5.2,
      feedConversionRate: 3.2
    },
    chartData: [
      { date: '2023-01', weight: 280, target: 300, count: 145, fcr: 3.1 },
      { date: '2023-02', weight: 310, target: 320, count: 147, fcr: 3.2 },
      { date: '2023-03', weight: 340, target: 340, count: 148, fcr: 3.0 },
      { date: '2023-04', weight: 370, target: 360, count: 150, fcr: 3.3 },
      { date: '2023-05', weight: 400, target: 380, count: 150, fcr: 3.2 },
      { date: '2023-06', weight: 425, target: 400, count: 150, fcr: 3.4 }
    ],
    records: [
      {
        id: 'B001',
        type: 'Bò thịt',
        breed: 'Brahman',
        initialWeight: 280,
        currentWeight: 425,
        targetWeight: 450,
        growthRate: 0.85,
        lastMeasured: '2023-06-15',
        status: 'normal',
        feedIntake: 12.5,
        healthStatus: 'Khỏe mạnh',
        weightHistory: [
          { date: '2023-05-15', weight: 400 },
          { date: '2023-06-01', weight: 415 },
          { date: '2023-06-15', weight: 425 }
        ]
      },
      {
        id: 'B002',
        type: 'Bò thịt',
        breed: 'Angus',
        initialWeight: 290,
        currentWeight: 420,
        targetWeight: 460,
        growthRate: 0.78,
        lastMeasured: '2023-06-15',
        status: 'slow',
        feedIntake: 11.8,
        healthStatus: 'Cần theo dõi',
        weightHistory: [
          { date: '2023-05-15', weight: 395 },
          { date: '2023-06-01', weight: 410 },
          { date: '2023-06-15', weight: 420 }
        ]
      },
      {
        id: 'H001',
        type: 'Heo thịt',
        breed: 'Duroc',
        initialWeight: 30,
        currentWeight: 110,
        targetWeight: 120,
        growthRate: 0.92,
        lastMeasured: '2023-06-15',
        status: 'fast',
        feedIntake: 3.2,
        healthStatus: 'Khỏe mạnh',
        weightHistory: [
          { date: '2023-05-15', weight: 85 },
          { date: '2023-06-01', weight: 98 },
          { date: '2023-06-15', weight: 110 }
        ]
      }
    ]
  };

  useEffect(() => {
    // Phân tích dữ liệu và tạo cảnh báo
    const newAlerts = [];
    growthData.records.forEach(animal => {
      const growthTrend = analyzeGrowthTrend(animal.weightHistory);
      if (growthTrend.status === 'slow') {
        newAlerts.push({
          id: animal.id,
          type: 'warning',
          message: `${animal.id} có tốc độ tăng trưởng chậm (${growthTrend.rate} kg/ngày)`,
          date: new Date()
        });
      }
      if (animal.currentWeight < animal.targetWeight * 0.9) {
        newAlerts.push({
          id: animal.id,
          type: 'alert',
          message: `${animal.id} chưa đạt 90% mục tiêu cân nặng`,
          date: new Date()
        });
      }
    });
    setAlerts(newAlerts);
  }, []);

  const handleWeightRecord = (animalId) => {
    const animal = growthData.records.find(a => a.id === animalId);
    setSelectedAnimal(animal);
    setShowWeightModal(true);
  };

  const handleWeightSubmit = (data) => {
    // Trong thực tế sẽ gọi API để cập nhật
    console.log('Cập nhật cân nặng:', data);
    setShowWeightModal(false);
  };

  return (
    <div className="growth-tracking">
      <div className="growth-header">
        <div className="growth-title">
          <h1>Theo dõi tăng trưởng</h1>
          <p>Cập nhật: {format(new Date(), 'dd/MM/yyyy')}</p>
        </div>
      </div>

      <GrowthAlerts alerts={alerts} />

      <GrowthFilter
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      <GrowthStats stats={growthData.stats} />

      <div className="growth-charts">
        <div className="chart-container">
          <h2>Biểu đồ tăng trưởng</h2>
          <GrowthChart 
            data={growthData.chartData} 
            metric={selectedMetric}
          />
        </div>
      </div>

      <div className="growth-details">
        <h2>Chi tiết theo dõi</h2>
        <GrowthTable 
          records={growthData.records}
          onWeightRecord={handleWeightRecord}
        />
      </div>

      {showWeightModal && (
        <WeightRecordModal
          animal={selectedAnimal}
          onClose={() => setShowWeightModal(false)}
          onSubmit={handleWeightSubmit}
        />
      )}
    </div>
  );
}

export default GrowthTracking;