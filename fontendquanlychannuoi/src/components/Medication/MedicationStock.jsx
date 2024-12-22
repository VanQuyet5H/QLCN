import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import AddMedication from './AddMedication';

const MedicationStock = () => {
  const [medications, setMedications] = useState([]);
  const [open, setOpen] = useState(false);  // State để điều khiển popup

  const fetchMedicationStock = async () => {
    try {
      const response = await axios.get('https://localhost:7185/api/Medication/GetMedicationStock');
      setMedications(response.data);
    } catch (error) {
      alert('Có lỗi xảy ra khi tải dữ liệu!');
    }
  };

  useEffect(() => {
    fetchMedicationStock();
  }, []);

  const handleAddMedication = () => {
    fetchMedicationStock();  // Cập nhật lại danh sách thuốc sau khi thêm thuốc mới
  };

  const handleClickOpen = () => {
    setOpen(true);  // Mở popup
  };

  const handleClose = () => {
    setOpen(false);  // Đóng popup
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Danh Sách Thuốc và Cảnh Báo Tồn Kho
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginBottom: '20px' }}>
        Thêm Thuốc
      </Button>
      {/* Hiển thị dialog thêm thuốc */}
      <AddMedication open={open} handleClose={handleClose} onAddMedication={handleAddMedication} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Thuốc</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Đơn Vị</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Cảnh Báo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((medication, index) => (
              <TableRow key={index}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.description}</TableCell>
                <TableCell>{medication.unit}</TableCell>
                <TableCell>{medication.quantity}</TableCell>
                <TableCell>
                  {medication.quantity < medication.minimumQuantity ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                      Cảnh báo: {medication.name} dưới mức tồn kho tối thiểu! Hiện tại: {medication.quantity} (Tối thiểu: {medication.minimumQuantity})
                    </span>
                  ) : (
                    <span style={{ color: 'green' }}>Đủ tồn kho</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MedicationStock;
