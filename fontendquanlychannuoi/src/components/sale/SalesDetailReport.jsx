import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { format } from 'date-fns';

const SalesDetailReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSalesDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://localhost:7185/api/Sale/sales-detail",
        {
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        }
      );
      console.log('apireportdetails', response.data);
      setSales(response.data);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h6" style={{ marginBottom: 16 }}>
        Báo Cáo Chi Tiết Bán Hàng
      </Typography>

      {/* Bộ lọc theo ngày */}
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
          onClick={fetchSalesDetail}
          disabled={!startDate || !endDate}
          style={{ width: '250px', height: '55px' }}
        >
          Xem Báo Cáo
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên Vật Nuôi</TableCell>
                <TableCell>Tên Người Mua</TableCell>
                <TableCell>Số Lượng</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tổng Tiền</TableCell>
                <TableCell>Ngày Giao Dịch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(sales) && sales.length > 0 ? (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.animalName}</TableCell>
                    <TableCell>{sale.buyerName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{sale.price ? sale.price.toLocaleString() : 'N/A'} VND</TableCell>
                    <TableCell>{sale.totalAmount ? sale.totalAmount.toLocaleString() : 'N/A'} VND</TableCell>
                    <TableCell>
                      {sale.saleDate && !isNaN(new Date(sale.saleDate))
                        ? format(new Date(sale.saleDate), "yyyy-MM-dd")
                        : 'Invalid Date'}
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
      )}
    </Paper>
  );
};

export default SalesDetailReport;
