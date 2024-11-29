import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import LivestockFilter from './LivestockFilter';
import Pagination from './Pagination';
import './LivestockList.css';
import axios from 'axios';
import AddLivestock from './AddLivestock';
import ViewLivestock from './ViewLivestock';
import DeleteConfirmation from './DeleteConfirmation';

function LivestockList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null);
  const [livestock, setLivestock] = useState([]);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://localhost:7185/api/Animal'); // Đổi URL thành endpoint của bạn
      return response.data.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const loadData = async () => {
    
    const dataList = await fetchLivestock();
    if (dataList && dataList.length > 0) {
      const formattedData = dataList.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        gender: item.gender,
        birthDate: item.birthDate,
        status: item.status,
        weight: item.weight,
        breed: item.breed,
        createdAt: item.createdAt
      }));

      setLivestock(formattedData); // Cập nhật dữ liệu thức ăn

    } else {
      setLivestock([]); // Không có dữ liệu
    }
    
  };
  useEffect(() => {
    loadData();
  }, []);



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleAddLivestock = (data) => {
    setLivestock(prev => [...prev, { ...data, id: `L${prev.length + 1}`.padStart(4, '0') }]);
    setShowAddForm(false);
  };

  const handleView = (animal) => {
    setSelectedLivestock(animal);
    setShowViewModal(true);
  };

  const handleEdit = (animal) => {
    setSelectedLivestock(animal);
    setShowAddForm(true);
  };

  const handleDelete = (animal) => {
    setSelectedLivestock(animal);
    setShowDeleteModal(true);
  };

  const confirmDelete = (id) => {
    setLivestock(prev => prev.filter(item => item.id !== id));
    setShowDeleteModal(false);
    setSelectedLivestock(null);
  };
  const filteredLivestock = livestock.filter(animal =>
    Object.values(animal).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedLivestock = [...filteredLivestock].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLivestock.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="livestock-list">
      <div className="livestock-header">
        <h1>Danh Sách Vật Nuôi</h1>
        <button className="btn-add">
          <FaPlus /> Thêm mới
        </button>
      </div>

      <div className="livestock-tools">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="tool-buttons">
          <button
            className={`btn-filter ${showFilter ? 'active' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter /> Lọc
          </button>
          <button className="btn-sort">
            <FaSort /> Sắp xếp
          </button>
        </div>
      </div>

      {showFilter && <LivestockFilter />}
      {showAddForm && (
        <AddLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowAddForm(false);
            setSelectedLivestock(null);
          }}
          onSubmit={handleAddLivestock}
        />
      )}

      {showViewModal && (
        <ViewLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          livestock={selectedLivestock}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error">Lỗi: {error}</p>
      ) : (<>
        <LivestockTable
          livestock={currentItems}
          onSort={handleSort}
          sortConfig={sortConfig}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredLivestock.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>)}
    </div>
  );
}

export default LivestockList;