import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './TreatmentGuide.css';

function TreatmentGuide() {
  const [guides] = useState([
    {
      id: 'G001',
      disease: 'Lở mồm long móng',
      symptoms: [
        'Sốt cao 40-41°C',
        'Bỏ ăn, uống ít',
        'Xuất hiện các vết loét ở miệng, chân'
      ],
      treatment: [
        'Cách ly động vật bệnh',
        'Vệ sinh chuồng trại',
        'Sử dụng thuốc kháng sinh theo chỉ định'
      ],
      prevention: [
        'Tiêm phòng định kỳ 6 tháng/lần',
        'Vệ sinh chuồng trại thường xuyên',
        'Kiểm soát người và phương tiện ra vào trại'
      ]
    },
    {
      id: 'G002',
      disease: 'Tụ huyết trùng',
      symptoms: [
        'Sốt cao đột ngột',
        'Thở nhanh, khó thở',
        'Tiết nhiều nước mũi'
      ],
      treatment: [
        'Tiêm kháng sinh theo đơn',
        'Chăm sóc, nuôi dưỡng tốt',
        'Theo dõi thân nhiệt thường xuyên'
      ],
      prevention: [
        'Tiêm phòng đầy đủ',
        'Tăng cường dinh dưỡng',
        'Giữ ấm chuồng trại'
      ]
    }
  ]);

  return (
    <div className="treatment-guide">
      <div className="guide-header">
        <h2>Hướng dẫn điều trị</h2>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh..."
          />
        </div>
      </div>

      <div className="guide-content">
        {guides.map(guide => (
          <div key={guide.id} className="guide-card">
            <h3>{guide.disease}</h3>
            
            <div className="guide-section">
              <h4>Triệu chứng</h4>
              <ul>
                {guide.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="guide-section">
              <h4>Phương pháp điều trị</h4>
              <ul>
                {guide.treatment.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="guide-section">
              <h4>Phòng ngừa</h4>
              <ul>
                {guide.prevention.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TreatmentGuide;