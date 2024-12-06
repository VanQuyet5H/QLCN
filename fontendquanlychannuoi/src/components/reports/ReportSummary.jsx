import { formatCurrency, formatNumber } from '../utils/formatters';
import './ReportSummary.css';

function ReportSummary({ data }) {
  const { totalAnimals, healthStatus, production, financial } = data;

  return (
    <div className="report-summary">
      <div className="summary-section">
        <h2>Tổng quan đàn</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Tổng số vật nuôi</h3>
            <div className="card-value">{formatNumber(totalAnimals.total)}</div>
            <div className="card-trend positive">{totalAnimals.trend}</div>
            <div className="card-details">
              <div>Bò thịt: {formatNumber(totalAnimals.cattle)}</div>
              <div>Bò sữa: {formatNumber(totalAnimals.dairy)}</div>
              <div>Heo: {formatNumber(totalAnimals.pig)}</div>
            </div>
          </div>

          <div className="summary-card">
            <h3>Tình trạng sức khỏe</h3>
            <div className="health-stats">
              <div className="health-item">
                <span className="label">Khỏe mạnh:</span>
                <span className="value">{formatNumber(healthStatus.healthy)}</span>
              </div>
              <div className="health-item warning">
                <span className="label">Đang điều trị:</span>
                <span className="value">{formatNumber(healthStatus.sick)}</span>
              </div>
              <div className="health-item danger">
                <span className="label">Cách ly:</span>
                <span className="value">{formatNumber(healthStatus.quarantine)}</span>
              </div>
              <div className="health-item">
                <span className="label">Tỷ lệ chết:</span>
                <span className="value">{healthStatus.mortality}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2>Hiệu quả sản xuất</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Cân nặng trung bình (kg)</h3>
            <div className="production-stats">
              <div className="stat-item">
                <span>Bò thịt:</span>
                <span>{production.averageWeight.cattle}</span>
              </div>
              <div className="stat-item">
                <span>Bò sữa:</span>
                <span>{production.averageWeight.dairy}</span>
              </div>
              <div className="stat-item">
                <span>Heo:</span>
                <span>{production.averageWeight.pig}</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h3>Tăng trưởng (kg/ngày)</h3>
            <div className="production-stats">
              <div className="stat-item">
                <span>Bò thịt:</span>
                <span>{production.growthRate.cattle}</span>
              </div>
              <div className="stat-item">
                <span>Bò sữa:</span>
                <span>{production.growthRate.dairy}</span>
              </div>
              <div className="stat-item">
                <span>Heo:</span>
                <span>{production.growthRate.pig}</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h3>Hiệu quả thức ăn (FCR)</h3>
            <div className="production-stats">
              <div className="stat-item">
                <span>Bò thịt:</span>
                <span>{production.feedEfficiency.cattle}</span>
              </div>
              <div className="stat-item">
                <span>Bò sữa:</span>
                <span>{production.feedEfficiency.dairy}</span>
              </div>
              <div className="stat-item">
                <span>Heo:</span>
                <span>{production.feedEfficiency.pig}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2>Tài chính</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Chi phí</h3>
            <div className="financial-stats">
              <div className="stat-item">
                <span>Thức ăn:</span>
                <span>{formatCurrency(financial.feedCost)}</span>
              </div>
              <div className="stat-item">
                <span>Thuốc thú y:</span>
                <span>{formatCurrency(financial.medicineCost)}</span>
              </div>
              <div className="stat-item">
                <span>Nhân công:</span>
                <span>{formatCurrency(financial.laborCost)}</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h3>Doanh thu & Lợi nhuận</h3>
            <div className="financial-stats">
              <div className="stat-item">
                <span>Doanh thu:</span>
                <span className="highlight">{formatCurrency(financial.revenue)}</span>
              </div>
              <div className="stat-item">
                <span>Lợi nhuận:</span>
                <span className="highlight positive">{formatCurrency(financial.profit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportSummary;