import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography,
  Stack, CircularProgress, TablePagination, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton,Divider
} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; // Trường hợp ngày bị null hoặc undefined

  const date = new Date(dateString);

  if (isNaN(date)) return 'Ngày không hợp lệ'; // Trường hợp chuỗi ngày không hợp lệ

  const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày (2 chữ số)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (2 chữ số, tháng bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`;
};


const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saleDetails, setSaleDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const infoFarm = {
    farm: {
      farmName: "Trang Trại ABC",
      farmLocation: "Hà Nội, Việt Nam",
      farmLicense: "Giấy phép số 12345/2024"
    }
  };
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7185/api/sale', {
        params: {
          pageNumber: page + 1,
          pageSize: rowsPerPage,
          startDate,
          endDate
        }
      });
      setSales(response.data.sales);
      setTotalRecords(response.data.totalRecords);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, startDate, endDate]);

  const fetchSaleDetails = async (saleId) => {
    try {
      const response = await axios.get(`https://localhost:7185/api/Sale/group-by-buyer/${saleId}`);
      console.log(response.data);
      setSaleDetails(response.data[0]); // Get first item since API returns array
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching sale details:', error);
      alert('Không thể tải chi tiết giao dịch. Vui lòng thử lại.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await axios.delete(`https://localhost:7185/api/sale/${id}`);
        fetchSales();
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa giao dịch. Vui lòng thử lại.");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSaleDetails(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Danh Sách Giao Dịch Bán Hàng
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
        <TextField
          label="Ngày Bắt Đầu"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Ngày Kết Thúc"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={fetchSales}
          sx={{ width: '250px', height: '55px' }}
        >
          Tìm Kiếm
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Vật Nuôi</TableCell>
              <TableCell>Tên Người Mua</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Ngày Giao Dịch</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.animalName}</TableCell>
                  <TableCell>{sale.buyerName}</TableCell>
                  <TableCell>{sale.price.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{formatDate(sale.saleDate)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => fetchSaleDetails(sale.id)}
                      >
                        Chi Tiết
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(sale.id)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu để hiển thị
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRecords}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{
  sx: { borderRadius: 3, maxWidth: '800px', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)' }
}}>
  <DialogTitle sx={{
    bgcolor: '#1976d2',
    color: 'white',
    p: 3,
    position: 'relative',
    textAlign: 'center',
    borderRadius: '8px 8px 0 0',
  }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
      Chi Tiết Giao Dịch
    </Typography>
    <IconButton onClick={handleCloseDialog} sx={{
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'white',
    }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{
    bgcolor: '#f5f5f5',
    p: 3,
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    maxHeight: '80vh',
    overflowY: 'auto',
    fontFamily: 'Roboto, sans-serif',
  }}>
    {saleDetails ? (
      <Stack spacing={3}>
        {/* Thông tin trang trại */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}>
          Thông Tin Trang Trại
        </Typography>
        <Paper elevation={3} sx={{
          padding: 3,
          borderRadius: 3,
          bgcolor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.02)',
            transition: '0.3s',
          },
          marginBottom: 2,
        }}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
              <strong>Tên Trang Trại:</strong> <span style={{ color: '#1976d2' }}>{infoFarm.farm.farmName}</span>
            </Typography>
            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
              <strong>Vị Trí:</strong> {infoFarm.farm.farmLocation}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
              <strong>Giấy Phép:</strong> {infoFarm.farm.farmLicense}
            </Typography>
          </Stack>
        </Paper>

        <Divider sx={{ marginY: 2 }} />

        {/* Thông tin người mua */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Thông Tin Người Mua
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>
          Tên Người Mua: <span style={{ color: '#1976d2' }}>{saleDetails.buyerName}</span>
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* Chi tiết giao dịch */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Chi Tiết Giao Dịch
        </Typography>

        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Tên Vật Nuôi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }} align="right">Số Lượng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }} align="right">Giá (VNĐ)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }} align="right">Ngày Giao Dịch</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saleDetails.sales?.map((sale, index) => (
              <TableRow key={sale.saleId || index}>
                <TableCell component="th" scope="row">{sale.animalName}</TableCell>
                <TableCell align="right">{sale.quantity}</TableCell>
                <TableCell align="right">{sale.price?.toLocaleString()}</TableCell>
                <TableCell align="right">{formatDate(sale.saleDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Tổng hợp thông tin giao dịch */}
        {saleDetails.sales?.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Tổng Số Lượng: {saleDetails.sales.reduce((sum, sale) => sum + sale.quantity, 0)}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Tổng Giá Trị: {saleDetails.sales
                .reduce((sum, sale) => sum + (sale.price * sale.quantity), 0)
                .toLocaleString()} VNĐ
            </Typography>
          </Stack>
        )}
      </Stack>
    ) : (
      <Typography align="center" sx={{ color: '#888', fontStyle: 'italic' }}>
        Đang tải dữ liệu...
      </Typography>
    )}
  </DialogContent>

  <DialogActions sx={{
    bgcolor: '#f5f5f5',
    p: 3,
    justifyContent: 'center',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  }}>
    <Button variant="contained" onClick={handleCloseDialog} sx={{
      minWidth: 100,
      backgroundColor: '#1976d2',
      '&:hover': { backgroundColor: '#1565c0' },
      borderRadius: 5,
      textTransform: 'none',
      fontWeight: 'bold',
    }}>
      Đóng
    </Button>
  </DialogActions>
</Dialog>




    </Paper>
  );
};

export default SaleList;