import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import TrackByCage from './GrowthTracking'; // Import the tracking component

function LivestockTable({ livestock, onSort, sortConfig, onView, onEdit, onDelete, selectedLivestockIds, setSelectedLivestockIds }) {

  const [openTrackDialog, setOpenTrackDialog] = useState(false); // Modal open state
  const [selectedCageId, setSelectedCageId] = useState(null); // Cage selected for tracking growth

  const handleSelectLivestock = (id) => {
    setSelectedLivestockIds((prevSelectedIds) => {
      const updatedSelectedIds = prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id];
      return updatedSelectedIds;
    });
  };

  const selectAll = () => {
    setSelectedLivestockIds((prevSelectedIds) => {
      if (prevSelectedIds.length === livestock.length) {
        return [];
      } else {
        const updatedSelectedIds = livestock.map((animal) => animal.id);
        return updatedSelectedIds;
      }
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpenTrackDialog = () => {
    setOpenTrackDialog(true); // Open modal
  };

  const handleCloseTrackDialog = () => {
    setOpenTrackDialog(false); // Close modal
  };

  return (

    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenTrackDialog}
        style={{ float: 'right', marginBottom: '20px' }} // Added marginBottom
      >
        Theo dõi tăng trưởng theo chuồng
      </Button>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          margin: '20px 0',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f5f5f5',
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedLivestockIds.length > 0 &&
                    selectedLivestockIds.length < livestock.length
                  }
                  checked={selectedLivestockIds.length === livestock.length}
                  onChange={selectAll}
                />
              </TableCell>
              <TableCell onClick={() => onSort('id')} sx={{ cursor: 'pointer' }}>
                Mã số {getSortIcon('id')}
              </TableCell>
              <TableCell onClick={() => onSort('name')} sx={{ cursor: 'pointer' }}>
                Tên vật nuôi {getSortIcon('name')}
              </TableCell>
              <TableCell onClick={() => onSort('cageName')} sx={{ cursor: 'pointer' }}>
                Chuồng {getSortIcon('cageName')}
              </TableCell>
              <TableCell onClick={() => onSort('type')} sx={{ cursor: 'pointer' }}>
                Loại {getSortIcon('type')}
              </TableCell>
              <TableCell onClick={() => onSort('gender')} sx={{ cursor: 'pointer' }}>
                Giới tính {getSortIcon('gender')}
              </TableCell>
              <TableCell onClick={() => onSort('birthDate')} sx={{ cursor: 'pointer' }}>
                Ngày đẻ {getSortIcon('birthDate')}
              </TableCell>
              <TableCell onClick={() => onSort('status')} sx={{ cursor: 'pointer' }}>
                Trạng thái {getSortIcon('status')}
              </TableCell>
              <TableCell onClick={() => onSort('weight')} sx={{ cursor: 'pointer' }}>
                Cân nặng (kg) {getSortIcon('weight')}
              </TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {livestock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="h6" color="textSecondary">
                    Không có dữ liệu vật nuôi nào.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              livestock.map((animal, index) => (
                <TableRow
                  key={animal.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                    '&:hover': {
                      backgroundColor: '#f1f1f1',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLivestockIds.includes(animal.id)}
                      onChange={(event) => {
                        event.stopPropagation();
                        handleSelectLivestock(animal.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>{animal.id}</TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.cage ? animal.cage.name : 'Chưa có'}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{formatDate(animal.birthDate)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: animal.status === 'Khỏe mạnh' ? 'green' : 'orange',
                        fontWeight: 'bold',
                      }}
                    >
                      {animal.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{animal.weight}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton color="primary" onClick={() => onView(animal)}>
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton color="warning" onClick={() => onEdit(animal)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => onDelete(animal)}>
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>




      {/* Track Growth Modal */}
      <Dialog open={openTrackDialog} onClose={handleCloseTrackDialog} sx={{ scrollbarWidth: "none" }}>
        <DialogTitle>Theo dõi tăng trưởng vật nuôi theo chuồng</DialogTitle>
        <DialogContent sx={{ scrollbarWidth: "none" }}>
          <TrackByCage />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTrackDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LivestockTable;
