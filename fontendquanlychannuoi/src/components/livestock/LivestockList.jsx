import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Modal,
} from '@mui/material';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import Pagination from './Pagination';
import LivestockFilter from './LivestockFilter';
import { useLivestock } from './useLivestock';
import axios from 'axios';
import './LivestockList.css';
import ViewLivestock from './ViewLivestock';
import EditLivestock from './EditLivestock';
import DeleteConfirmation from './DeleteConfirmation';
import { debounce } from 'lodash';
function LivestockList() {
  const {
    livestock,
    isLoading,
    totalRecords,
    currentPage,
    searchTerm,
    sortConfig,
    setSearchTerm,
    setCurrentPage,
    handleSort,
    applyFilters,
    handleUpdate,
    handleDelete,
    setLivestock
  } = useLivestock();

  const [cages, setCages] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLivestockIds, setSelectedLivestockIds] = useState([]);
  const [selectedCage, setSelectedCage] = useState(null);
  const [showAssignCageModal, setShowAssignCageModal] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch cages on mount
  useEffect(() => {
    axios
      .get('https://localhost:7185/api/Cage/available')
      .then((response) => {
        console.log('Cages fetched:', response.data); // Log cages data
        setCages(response.data);
      })
      .catch((error) => console.error('Error fetching cages:', error));
  }, []);



  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset page khi tìm kiếm
  }, 3000); // 300ms debounce delay

  const onSearchInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleAssign = () => {
    if (selectedLivestockIds.length > 0) {
      setShowAssignCageModal(true); // Open the modal
    } else {
      alert('Vui lòng chọn ít nhất một vật nuôi.');
    }
  };
  const handleAssignLivestock = async () => {
    console.log('Selected Cage ID:', selectedCage);
    if (!selectedCage) {
      setNotification({ message: 'Vui lòng chọn một chuồng', type: 'error' });
      return;
    }
    try {
      const response = await axios.post(
        `https://localhost:7185/api/cage/${selectedCage}/AddAnimals`,
        selectedLivestockIds
      );
      const cageResponse = await axios.get(`https://localhost:7185/api/cage/${selectedCage} `);
      const selectedCageName = cageResponse.data.name;  // Lấy tên chuồng từ API
      setLivestock((prevLivestock) =>
        prevLivestock.map((animal) =>
          selectedLivestockIds.includes(animal.id)
            ? { ...animal, cage: { id: selectedCage, name: selectedCageName } } // Cập nhật chuồng
            : animal
        )
      );

      setCages((prevCages) =>
        prevCages.map((cage) =>
          cage.id === selectedCage
            ? {
              ...cage,
              currentOccupancy: cage.currentOccupancy + selectedLivestockIds.length, // Cập nhật số lượng vật nuôi
            }
            : cage
        ));
      setNotification({ message: response.data || 'Gán vật nuôi thành công!', type: 'success' });
      setShowAssignCageModal(false);
      setSelectedLivestockIds([]);
    } catch (error) {
      setNotification({
        message: error.response?.data || 'Có lỗi xảy ra khi gán vật nuôi vào chuồng!',
        type: 'error',
      });
    }
  };
  // Handle modal view
  const handleView = (animal) => {
    setSelectedLivestock(animal);
    setShowViewModal(true);
  };

  // Handle modal edit
  const handleEdit = (animal) => {
    setSelectedLivestock(animal);
    setIsModalOpen(true);
  };

  // Handle update
  const handleUpdateSubmit = async (updatedAnimal) => {
    try {
      const success = await handleUpdate(updatedAnimal);
      if (success) {
        setNotification({ message: 'Cập nhật vật nuôi thành công!', type: 'success' });
        setIsModalOpen(false);
      }
    } catch (error) {
      setNotification({ message: 'Cập nhật vật nuôi thất bại!', type: 'error' });
    }
  };

  // Handle delete
  const handleDeleteSubmit = async (id) => {
    try {
      const success = await handleDelete(id);
      if (success) {
        setNotification({ message: 'Xóa vật nuôi thành công!', type: 'success' });
        setShowDeleteModal(false);
        setSelectedLivestock(null);
      }
    } catch (error) {
      setNotification({ message: 'Xóa vật nuôi thất bại!', type: 'error' });
    }
  };

  // If data is loading
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="hide-scrollbar" sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Quản lý vật nuôi
      </Typography>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification.message}
        autoHideDuration={6000}
        onClose={() => setNotification({ message: '', type: '' })}
      >
        <Alert
          onClose={() => setNotification({ message: '', type: '' })}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Search, Filter, Sort, and Assign Cage Buttons */}
      <Box display="flex" gap={2} alignItems="center" marginBottom={2} justifyContent="space-between">
        <TextField
          size="small"
          variant="outlined"
          placeholder="Tìm kiếm..."
          InputProps={{
            startAdornment: <FaSearch style={{ marginRight: 8 }} />,
          }}
          onChange={onSearchInputChange} // Sử dụng debounce
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />

        <div className="tool-buttons">
          <Button
            variant={showFilter ? 'contained' : 'outlined'}
            startIcon={<FaFilter />}
            onClick={() => setShowFilter(!showFilter)}
          >
            Lọc
          </Button>
          <Button variant="outlined" startIcon={<FaSort />} onClick={handleSort}>
            Sắp xếp
          </Button>
          <Button variant="contained" color="primary" onClick={handleAssign} disabled={selectedLivestockIds.length === 0}>
            Gán vào chuồng
          </Button>
        </div>
      </Box>

      {/* Filter Component */}
      {showFilter && <LivestockFilter onApplyFilters={applyFilters} />}

      {/* Livestock Table */}
      <LivestockTable
        livestock={livestock}
        onSort={handleSort}
        sortConfig={sortConfig}
        selectedLivestockIds={selectedLivestockIds}
        setSelectedLivestockIds={setSelectedLivestockIds}
        onAssign={handleAssign}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(animal) => {
          setSelectedLivestock(animal);
          setShowDeleteModal(true);
        }}
      />

      {/* Pagination */}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          totalItems={totalRecords}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setItemsPerPage(newRowsPerPage);
            setCurrentPage(1);
          }}
        />
      </Box>

      {/* Modals */}
      <Modal open={showViewModal} onClose={() => setShowViewModal(false)}>
        <Box>
          <ViewLivestock
            livestock={selectedLivestock}
            onClose={() => {
              setShowViewModal(false);
              setSelectedLivestock(null);
            }}
          />
        </Box>
      </Modal>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <EditLivestock
            livestock={selectedLivestock}
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleUpdateSubmit}
          />
        </Box>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box>
          <DeleteConfirmation
            livestock={selectedLivestock}
            onConfirm={() => handleDeleteSubmit(selectedLivestock.id)}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedLivestock(null);
            }}
          />
        </Box>
      </Modal>

      {/* Assign Cage Modal */}
      <Modal open={showAssignCageModal} onClose={() => setShowAssignCageModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            Chọn chuồng để gán
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              fullWidth
              label="Chọn chuồng"
              value={selectedCage || ''}
              onChange={(e) => setSelectedCage(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Chọn chuồng</option>
              {cages.map((cage) => (
                <option key={cage.id} value={cage.id}>
                  {cage.name}
                </option>
              ))}
            </TextField>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowAssignCageModal(false)} // Đóng modal
              >
                Thoát
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignLivestock}
              >
                Gán vào chuồng
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}

export default LivestockList;