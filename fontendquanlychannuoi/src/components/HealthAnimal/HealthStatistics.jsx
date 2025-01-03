import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import './HealthStatistics.css';

const HealthStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchStatistics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.get('https://localhost:7185/thongketheodoisuckhoevatnuoi', {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi lấy dữ liệu.');
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '20px' }}>
        Báo Cáo Sức Khỏe Vật Nuôi
      </Typography>

      {/* Các input để lọc dữ liệu */}
      <Box sx={{ marginBottom: '20px' }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              label="Ngày bắt đầu"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Ngày kết thúc"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <Button variant="contained" color="primary" onClick={fetchStatistics} fullWidth sx={{height:'55px'}}>
              Lọc
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage && (
        <Typography variant="body1" color="error" align="center" sx={{ marginBottom: '20px' }}>
          {errorMessage}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      ) : statistics ? (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Thống Kê Tổng Quan
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Tổng số vật nuôi</TableCell>
                  <TableCell align="center">Số vật nuôi ốm</TableCell>
                  <TableCell align="center">Số vật nuôi khỏe mạnh</TableCell>
                  <TableCell align="center">Tổng số bản ghi sức khỏe</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{statistics.totalAnimals}</TableCell>
                  <TableCell align="center">{statistics.totalSickAnimals}</TableCell>
                  <TableCell align="center">{statistics.totalHealthyAnimals}</TableCell>
                  <TableCell align="center">{statistics.totalRecords}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Danh sách vật nuôi */}
          <Typography variant="h6" gutterBottom>
            Danh Sách Vật Nuôi Ốm
          </Typography>
          {Array.isArray(statistics.sickAnimals) && statistics.sickAnimals.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Tên</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics.sickAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell align="center">{animal.id}</TableCell>
                      <TableCell align="center">{animal.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" align="center" sx={{ marginBottom: '20px' }}>
              Không có vật nuôi ốm.
            </Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Danh Sách Vật Nuôi Khỏe Mạnh
          </Typography>
          {Array.isArray(statistics.healthyAnimals) && statistics.healthyAnimals.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Tên</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics.healthyAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell align="center">{animal.id}</TableCell>
                      <TableCell align="center">{animal.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" align="center">
              Không có vật nuôi khỏe mạnh.
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="body1" align="center" sx={{ marginTop: '20px' }}>
          Không có dữ liệu.
        </Typography>
      )}
    </Container>
  );
};

export default HealthStatistics;
