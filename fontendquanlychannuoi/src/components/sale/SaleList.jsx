import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography,
  Stack, CircularProgress, TablePagination, TextField
} from '@mui/material';
import axios from 'axios';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSales = async () => {
    try {
      const response = await axios.get('https://localhost:7185/api/sale', {
        params: {
          pageNumber: page + 1,
          pageSize: rowsPerPage,
          startDate: startDate,
          endDate: endDate
        }
      });
      console.log('apisale',response.data);
      setSales(response.data.sales);
      setTotalRecords(response.data.totalRecords);
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await axios.delete(`https://localhost:7185/api/sale/${id}`);
        setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
        setTotalRecords((prevTotal) => prevTotal - 1);
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa giao dịch. Vui lòng thử lại.");
      }
    }
  };
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h6" style={{ marginBottom: 16 }}>Danh Sách Giao Dịch Bán Hàng</Typography>

      {/* Tìm kiếm theo ngày */}
      <Stack direction="row" spacing={2} alignItems="center" style={{ marginBottom: 20 }}>
        <TextField
          label="Ngày Bắt Đầu"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Ngày Kết Thúc"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSales}
          style={{ width: '250px', height: '55px' }} // Tăng chiều rộng của nút tìm kiếm
        >
          Tìm Kiếm
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
            {Array.isArray(sales) && sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.animalId}</TableCell>
                  <TableCell>{sale.buyerName}</TableCell>
                  <TableCell>{sale.price}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{sale.saleDate}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" size="small"  onClick={() => handleDelete(sale.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                  Không có dữ liệu để hiển thị.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default SaleList;
