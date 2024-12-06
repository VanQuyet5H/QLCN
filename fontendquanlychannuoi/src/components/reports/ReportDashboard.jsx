import { useState } from 'react';
import { format } from 'date-fns';
import ReportSummary from './ReportSummary';
import ReportDetails from './ReportDetails';
import ReportFilter from './ReportFilter';
import './ReportDashboard.css';

function ReportDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFarm, setSelectedFarm] = useState('all');

  // Dữ liệu thống kê thực tế
  const reportData = {
    summary: {
      totalAnimals: {
        cattle: 150,
        dairy: 50,
        pig: 300,
        total: 500,
        trend: '+3.5%'
      },
      healthStatus: {
        healthy: 480,
        sick: 15,
        quarantine: 5,
        mortality: '0.8%'
      },
      production: {
        averageWeight: {
          cattle: 425,
          dairy: 550,
          pig: 95
        },
        growthRate: {
          cattle: 0.85,
          dairy: 0.75,
          pig: 0.65
        },
        feedEfficiency: {
          cattle: 6.2,
          dairy: 5.8,
          pig: 3.1
        }
      },
      financial: {
        feedCost: 125000000,
        medicineCost: 15000000,
        laborCost: 45000000,
        revenue: 450000000,
        profit: 265000000
      }
    },
    details: {
      byFarm: [
        {
          id: 'F001',
          name: 'Trang trại A',
          location: 'Đồng Nai',
          capacity: 300,
          currentStock: 285,
          healthyRate: '96%',
          efficiency: '92%'
        },
        {
          id: 'F002',
          name: 'Trang trại B',
          location: 'Long An',
          capacity: 250,
          currentStock: 215,
          healthyRate: '98%',
          efficiency: '94%'
        }
      ],
      byCategory: [
        {
          category: 'Bò thịt',
          count: 150,
          avgWeight: 425,
          growthRate: 0.85,
          feedCost: 45000000,
          revenue: 180000000
        },
        {
          category: 'Bò sữa',
          count: 50,
          avgWeight: 550,
          milkProduction: 25,
          feedCost: 25000000,
          revenue: 120000000
        },
        {
          category: 'Heo thịt',
          count: 300,
          avgWeight: 95,
          growthRate: 0.65,
          feedCost: 55000000,
          revenue: 150000000
        }
      ]
    }
  };

  return (
    <div className="report-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Báo cáo tổng hợp</h1>
          <p>Cập nhật: {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>
        <ReportFilter
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFarm={selectedFarm}
          setSelectedFarm={setSelectedFarm}
        />
      </div>

      <ReportSummary data={reportData.summary} />
      <ReportDetails data={reportData.details} />
    </div>
  );
}

export default ReportDashboard;