import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Modal,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import Pagination from './Pagination';
import ViewLivestock from './ViewLivestock';
import DeleteConfirmation from './DeleteConfirmation';
import EditLivestock from './EditLivestock';
import LivestockFilter from './LivestockFilter';
import { useLivestock } from './useLivestock';
import './LivestockList.css';
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
    handleUpdate,
    handleDelete,
    applyFilters,
  } = useLivestock();

  const [itemsPerPage, setItemsPerPage] = useState(10); // Mặc định 10 mục mỗi trang
  const [showFilter, setShowFilter] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handleView = (animal) => {
    setSelectedLivestock(animal);
    setShowViewModal(true);
  };

  const handleEdit = (animal) => {
    setSelectedLivestock(animal);
    setIsModalOpen(true);
  };

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

  const confirmDelete = async (id) => {
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="hide-scrollbar" sx={{ maxHeight: 400, overflowY: 'auto'}}>
      <Typography variant="h6" gutterBottom>
        Quản lý vật nuôi
      </Typography>

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

      <Box display="flex" gap={2} alignItems="center" marginBottom={2} justifyContent="space-between">
  {/* Tìm kiếm */}
  <TextField
    size="small"
    variant="outlined"
    placeholder="Tìm kiếm..."
    value={searchTerm}
    onChange={handleSearch}
    InputProps={{
      startAdornment: <FaSearch style={{ marginRight: 8 }} />,
    }}
    sx={{
      flexGrow: 1,
      width:60 // Làm cho TextField chiếm phần không gian còn lại
    }}
  />

  {/* Nút Lọc */}
  <Button
    variant={showFilter ? 'contained' : 'outlined'}
    startIcon={<FaFilter />}
    onClick={() => setShowFilter(!showFilter)}
    sx={{
      flexGrow: 1, // Làm cho nút Lọc có cùng kích thước với Tìm kiếm
      maxWidth: '150px', // Hạn chế chiều rộng tối đa
    }}
  >
    Lọc
  </Button>

  {/* Nút Sắp xếp */}
  <Button
    variant="outlined"
    startIcon={<FaSort />}
    onClick={handleSort}
    sx={{
      flexGrow: 1, // Làm cho nút Sắp xếp có cùng kích thước với Tìm kiếm
      maxWidth: '150px', // Hạn chế chiều rộng tối đa
    }}
  >
    Sắp xếp
  </Button>
</Box>


      {showFilter && <LivestockFilter onApplyFilters={applyFilters} />}

      <LivestockTable
        livestock={livestock}
        onSort={handleSort}
        sortConfig={sortConfig}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={(animal) => {
          setSelectedLivestock(animal);
          setShowDeleteModal(true);
        }}
      />

      {/* Centering Pagination */}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          totalItems={totalRecords} // total number of items
          currentPage={currentPage} // current page number
          onPageChange={setCurrentPage} // function to update the current page
          onRowsPerPageChange={(newRowsPerPage) => {
            setItemsPerPage(newRowsPerPage); // update the number of items per page
            setCurrentPage(1); // Reset to first page when changing rows per page
          }}
        />
      </Box>

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
            width: 700, // Điều chỉnh kích thước phù hợp
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
            onConfirm={() => confirmDelete(selectedLivestock.id)}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedLivestock(null);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default LivestockList;
