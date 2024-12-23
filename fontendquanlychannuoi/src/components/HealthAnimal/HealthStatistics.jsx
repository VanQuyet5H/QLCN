import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,Grid } from '@mui/material';
import './HealthStatistics.css';

const HealthStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Lấy dữ liệu thống kê
  const fetchStatistics = async () => {
    setLoading(true);
    setErrorMessage(null); // Reset lỗi trước khi gọi API
    try {
      const response = await axios.get('https://localhost:7185/thongketheodoisuckhoevatnuoi', {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }
      });
      console.log('Dữ liệu API:', response.data);
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
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom align="center">
        Báo Cáo Sức Khỏe Vật Nuôi
      </Typography>
      
      {/* Các input để lọc dữ liệu */}
      <div className="filters">
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
      <Button variant="contained" color="primary" onClick={fetchStatistics} fullWidth>
        Lọc
      </Button>
    </Grid>
  </Grid></div>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage && <Typography variant="body1" color="error" align="center">{errorMessage}</Typography>}

      {loading ? (
        <CircularProgress />
      ) : statistics ? (
        <div className="report">
          <Typography variant="h6" gutterBottom>
            Thống Kê Tổng Quan
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tổng số vật nuôi</TableCell>
                  <TableCell>Số vật nuôi ốm</TableCell>
                  <TableCell>Số vật nuôi khỏe mạnh</TableCell>
                  <TableCell>Tổng số bản ghi sức khỏe</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{statistics.totalAnimals}</TableCell>
                  <TableCell>{statistics.totalSickAnimals}</TableCell>
                  <TableCell>{statistics.totalHealthyAnimals}</TableCell>
                  <TableCell>{statistics.totalRecords}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom>
            Danh sách vật nuôi ốm:
          </Typography>
          {Array.isArray(statistics.sickAnimals) && statistics.sickAnimals.length > 0 ? (
            <ul>
              {statistics.sickAnimals.map((animalId, index) => (
                <li key={index}>Vật nuôi ID: {animalId}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">Không có vật nuôi ốm.</Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Danh sách vật nuôi khỏe mạnh:
          </Typography>
          {Array.isArray(statistics.healthyAnimals) && statistics.healthyAnimals.length > 0 ? (
            <ul>
              {statistics.healthyAnimals.map((animalId, index) => (
                <li key={index}>Vật nuôi ID: {animalId}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">Không có vật nuôi khỏe mạnh.</Typography>
          )}
        </div>
      ) : (
        <Typography variant="body1" align="center">
          Không có dữ liệu.
        </Typography>
      )}
    </Container>
  );
};

export default HealthStatistics;
