import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GrowthStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7185/api/QualityControl/growth-statistics")
      .then((response) => {
        const data = response.data?.data || [];
        console.log("API response data:", data);
        setStatistics(data);
        setLoading(false);

        // Tạo dữ liệu cho biểu đồ
        const chartData = createChartData(data);
        setChartData(chartData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  // Hàm tạo dữ liệu cho biểu đồ
  const createChartData = (data) => {
    const animalTypes = data.map((item) => item.animalType);

    // Tính giá trị trung bình của growth cho bestGrowth và worstGrowth
    const bestGrowth = data.map((item) =>
      item.bestGrowthAnimals && item.bestGrowthAnimals.length > 0
        ? item.bestGrowthAnimals.reduce((sum, animal) => sum + animal.growth, 0) / item.bestGrowthAnimals.length
        : 0
    );

    const worstGrowth = data.map((item) =>
      item.worstGrowthAnimals && item.worstGrowthAnimals.length > 0
        ? item.worstGrowthAnimals.reduce((sum, animal) => sum + animal.growth, 0) / item.worstGrowthAnimals.length
        : 0
    );

    return {
      labels: animalTypes,
      datasets: [
        {
          label: "Tăng Trưởng Tốt Nhất",
          data: bestGrowth,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Tăng Trưởng Kém Nhất",
          data: worstGrowth,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!Array.isArray(statistics) || statistics.length === 0) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
        Không có dữ liệu thống kê tăng trưởng.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh',overflow: 'auto' }}>
      {/* Chart Section */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Biểu Đồ Tăng Trưởng Vật Nuôi
        </Typography>
        <Bar data={chartData} />
      </Box>

      {/* Table Section */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 3,
          overflow: 'hidden',
          boxShadow: 2,
          '& .MuiTableCell-root': {
            px: 2,
            py: 1.5,
          }
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
          }}
        >
          Thống Kê Tăng Trưởng Vật Nuôi
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Loại Vật Nuôi</TableCell>
              <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', width: '42.5%' }}>
                Tăng Trưởng Tốt Nhất
              </TableCell>
              <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', width: '42.5%' }}>
                Tăng Trưởng Kém Nhất
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell></TableCell>
              {['ID', 'Tên', 'Tăng Trưởng (kg)', 'Trạng Thái'].map((header) => (
                <TableCell key={`best-${header}`} sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
              {['ID', 'Tên', 'Tăng Trưởng (kg)', 'Trạng Thái'].map((header) => (
                <TableCell key={`worst-${header}`} sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((stat, index) => (
              stat.bestGrowthAnimals.map((bestAnimal, bestIndex) => (
                <TableRow 
                  key={`${index}-${bestIndex}`}
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  {bestIndex === 0 && (
                    <TableCell 
                      rowSpan={Math.max(stat.bestGrowthAnimals.length, stat.worstGrowthAnimals.length)} 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {stat.animalType}
                    </TableCell>
                  )}
                  <TableCell>{bestAnimal.animalId}</TableCell>
                  <TableCell>{bestAnimal.animalName}</TableCell>
                  <TableCell>{bestAnimal.growth}</TableCell>
                  <TableCell>{bestAnimal.healthStatus}</TableCell>
                  
                  {stat.worstGrowthAnimals[bestIndex] ? (
                    <>
                      <TableCell>{stat.worstGrowthAnimals[bestIndex].animalId}</TableCell>
                      <TableCell>{stat.worstGrowthAnimals[bestIndex].animalName}</TableCell>
                      <TableCell>{stat.worstGrowthAnimals[bestIndex].growth}</TableCell>
                      <TableCell>{stat.worstGrowthAnimals[bestIndex].healthStatus}</TableCell>
                    </>
                  ) : (
                    <TableCell colSpan={4} />
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GrowthStatistics;
