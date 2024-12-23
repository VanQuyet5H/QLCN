import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';

const SaleList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu API
    const fetchSales = async () => {
      const data = [
        { id: 1, animalId: 'A001', buyerName: 'John Doe', price: 1000, quantity: 2, saleDate: '2024-12-22' },
        { id: 2, animalId: 'A002', buyerName: 'Jane Smith', price: 2000, quantity: 1, saleDate: '2024-12-21' },
      ];
      setSales(data);
    };

    fetchSales();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Danh Sách Giao Dịch Bán Hàng</Typography>
        <Button component={Link} to="/add" variant="contained" color="primary">
          Thêm Giao Dịch
        </Button>
      </Stack>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Vật Nuôi</TableCell>
              <TableCell>Tên Người Mua</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Ngày Giao Dịch</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.animalId}</TableCell>
                <TableCell>{sale.buyerName}</TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.saleDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" size="small" style={{ marginRight: 5 }}>
                    Chỉnh Sửa
                  </Button>
                  <Button variant="contained" color="error" size="small">
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SaleList;
