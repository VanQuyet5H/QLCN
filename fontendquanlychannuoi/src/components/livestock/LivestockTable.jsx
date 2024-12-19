import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Box,
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function LivestockTable({ livestock, onSort, sortConfig, onView, onEdit, onDelete }) {
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

  return (
    <TableContainer component={Paper} elevation={3} sx={{ margin: '20px 0' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => onSort('id')} sx={{ cursor: 'pointer' }}>
              Mã số {getSortIcon('id')}
            </TableCell>
            <TableCell onClick={() => onSort('name')} sx={{ cursor: 'pointer' }}>
              Tên vật nuôi {getSortIcon('name')}
            </TableCell>
            <TableCell onClick={() => onSort('type')} sx={{ cursor: 'pointer' }}>
              Loại {getSortIcon('type')}
            </TableCell>
            <TableCell onClick={() => onSort('gender')} sx={{ cursor: 'pointer' }}>
              Loài {getSortIcon('gender')}
            </TableCell>
            <TableCell onClick={() => onSort('birthDate')} sx={{ cursor: 'pointer' }}>
              Ngày Sinh {getSortIcon('birthDate')}
            </TableCell>
            <TableCell onClick={() => onSort('status')} sx={{ cursor: 'pointer' }}>
              Trạng Thái {getSortIcon('status')}
            </TableCell>
            <TableCell onClick={() => onSort('weight')} sx={{ cursor: 'pointer' }}>
              Cân nặng (kg) {getSortIcon('weight')}
            </TableCell>
            <TableCell onClick={() => onSort('breed')} sx={{ cursor: 'pointer' }}>
              Giống {getSortIcon('breed')}
            </TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {livestock.map((animal) => (
            <TableRow key={animal.id} hover>
              <TableCell>{animal.id}</TableCell>
              <TableCell>{animal.name}</TableCell>
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
              <TableCell>{animal.breed}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LivestockTable;
