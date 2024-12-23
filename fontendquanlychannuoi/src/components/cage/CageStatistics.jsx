import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CageStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/Cage/Statistics');
        setStatistics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu thống kê.');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Chuẩn bị dữ liệu biểu đồ
  const chartData = {
    labels: statistics.map((stat) => stat.cageName), // Tên các chuồng
    datasets: [
      {
        label: 'Sức chứa',
        data: statistics.map((stat) => stat.capacity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Số lượng vật nuôi',
        data: statistics.map((stat) => stat.animalsInCage),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống Kê Chuồng Trại',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Tên Chuồng',
        },
      },
    },
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom align="center">
        Biểu Đồ và Thống Kê Chi Tiết Chuồng Trại
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Bar data={chartData} options={chartOptions} />
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên Chuồng</TableCell>
                  <TableCell>Sức Chứa</TableCell>
                  <TableCell>Số Lượng Hiện Tại</TableCell>
                  <TableCell>Chỗ Trống</TableCell>
                  <TableCell>Thông Báo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((stat) => (
                  <TableRow key={stat.cageName}>
                    <TableCell>{stat.cageName}</TableCell>
                    <TableCell>{stat.capacity}</TableCell>
                    <TableCell>{stat.currentOccupancy}</TableCell>
                    <TableCell>{stat.availableSlots}</TableCell>
                    <TableCell>{stat.repairNotification}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default CageStatistics;
