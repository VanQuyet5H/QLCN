import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import {DiseaseList} from './DiseaseList';
import {TreatmentHistory} from './TreatmentHistory';
import './DiseaseManagement.css';

function DiseaseManagement() {
  const [activeTab, setActiveTab] = useState('diseases');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="disease-management">
      <div className="management-header">
        <div className="header-left">
          <h2>Quản lý bệnh lý</h2>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="btn-add">
          <FaPlus /> Thêm ca bệnh
        </button>
      </div>

      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'diseases' ? 'active' : ''}`}
          onClick={() => setActiveTab('diseases')}
        >
          Danh sách bệnh
        </button>
        <button
          className={`tab-button ${activeTab === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatments')}
        >
          Lịch sử điều trị
        </button>
      </div>

      {activeTab === 'diseases' ? (
        <DiseaseList searchTerm={searchTerm} />
      ) : (
        <TreatmentHistory searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default DiseaseManagement;