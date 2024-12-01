import { useState } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import BreedTable from './BreedTable';
import BreedFilter from './BreedFilter';
import AddBreedModal from './AddBreedModal';
import EditBreedModal from './EditBreedModal';
import DeleteBreedModal from './DeleteBreedModal';
import './BreedList.css';

function BreedList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - trong thực tế sẽ lấy từ API
  const [breeds, setBreeds] = useState([
    {
      id: 'BR001',
      name: 'Brahman',
      type: 'cattle',
      origin: 'Hoa Kỳ',
      characteristics: 'Khả năng thích nghi cao, chịu nhiệt tốt',
      avgWeight: '600-800',
      avgGrowthRate: '0.8-1.0',
      meatQuality: 'Cao',
      diseaseResistance: 'Tốt',
      status: 'active'
    },
    {
      id: 'BR002',
      name: 'Duroc',
      type: 'pig',
      origin: 'Hoa Kỳ',
      characteristics: 'Tăng trưởng nhanh, tỷ lệ nạc cao',
      avgWeight: '120-150',
      avgGrowthRate: '0.85-0.95',
      meatQuality: 'Cao',
      diseaseResistance: 'Khá',
      status: 'active'
    },
    {
      id: 'BR003',
      name: 'Holstein Friesian',
      type: 'dairy',
      origin: 'Hà Lan',
      characteristics: 'Năng suất sữa cao',
      avgWeight: '700-750',
      avgGrowthRate: '0.75-0.85',
      meatQuality: 'Trung bình',
      diseaseResistance: 'Tốt',
      status: 'active'
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (breed) => {
    setSelectedBreed(breed);
    setShowEditModal(true);
  };

  const handleDelete = (breed) => {
    setSelectedBreed(breed);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = (newBreed) => {
    setBreeds(prev => [...prev, { ...newBreed, id: `BR${(prev.length + 1).toString().padStart(3, '0')}` }]);
    setShowAddModal(false);
  };

  const handleEditSubmit = (updatedBreed) => {
    setBreeds(prev => prev.map(breed => 
      breed.id === updatedBreed.id ? updatedBreed : breed
    ));
    setShowEditModal(false);
    setSelectedBreed(null);
  };

  const handleDeleteConfirm = () => {
    setBreeds(prev => prev.filter(breed => breed.id !== selectedBreed.id));
    setShowDeleteModal(false);
    setSelectedBreed(null);
  };

  const filteredBreeds = breeds.filter(breed =>
    Object.values(breed).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBreeds = filteredBreeds.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="breed-list">
      <div className="breed-header">
        <h1>Quản lý giống vật nuôi</h1>
        <button className="btn-add" onClick={handleAdd}>
          <FaPlus /> Thêm giống mới
        </button>
      </div>

      <div className="breed-tools">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm giống..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <button 
          className={`btn-filter ${showFilter ? 'active' : ''}`}
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaFilter /> Lọc
        </button>
      </div>

      {showFilter && <BreedFilter />}

      <BreedTable
        breeds={currentBreeds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showAddModal && (
        <AddBreedModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {showEditModal && (
        <EditBreedModal
          breed={selectedBreed}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBreed(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

      {showDeleteModal && (
        <DeleteBreedModal
          breed={selectedBreed}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBreed(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default BreedList;