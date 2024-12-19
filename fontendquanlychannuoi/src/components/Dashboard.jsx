import React, { useState, useEffect } from "react";
import { FaHorse, FaPiggyBank, FaExclamationTriangle, FaThermometerHalf, FaWater, FaWeight } from "react-icons/fa";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';
import { Bar as ChartJSBar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import axios from "axios";
import { Box } from '@mui/system';

function Dashboard() {
  const icons = [<FaHorse />, <FaPiggyBank />, <FaWeight />, <FaExclamationTriangle />];

  // API calls and data fetching logic
  const fetchApiRecentAction = async () => {
    try {
      const response = await axios.get("https://localhost:7185/api/Dashboard/recent-activities");
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("API returned an error", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching animal growth data:", error);
      return [];
    }
  };

  const loadRecentActive = async () => {
    try {
      const data = await fetchApiRecentAction();
      if (Array.isArray(data)) {
        const formattedStats = data.map((item) => ({
          action: item.action,
          time: item.time,
          type: item.type,
          priority: item.priority
        }));
        setRecentActivities(formattedStats);
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const fetchAnimal = async () => {
    try {
      const response = await axios.get("https://localhost:7185/api/Dashboard/CattleSummary");
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("API returned an error", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error Api:", error);
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const data = await fetchAnimal();
      if (Array.isArray(data)) {
        const formattedStats = data.map((item, index) => ({
          icon: icons[index % icons.length],
          title: item.title.join(', '),
          value: item.value,
          trend: item.trend,
          details: item.details,
        }));
        setStats(formattedStats);
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const environmentStats = [
    { icon: <FaThermometerHalf />, title: "Nhiệt độ", value: "25°C", status: "normal" },
    { icon: <FaWater />, title: "Độ ẩm", value: "65%", status: "warning" },
  ];

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedConsumptionData, setFeedConsumptionData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState([]);
  const [recentActivitie, setRecentActivities] = useState([]);

  const fetchAnimalGrowthData = async (startDate, endDate) => {
    try {
      const response = await axios.post("https://localhost:7185/api/Dashboard/AnimalByMonthGrouped", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("API returned an error", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching animal growth data:", error);
      return [];
    }
  };

  const getRandomColor = () =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;

  const loadGrowthData = async () => {
    setLoading(true);
    const data = await fetchAnimalGrowthData(startDate, endDate);
    if (data && data.length > 0) {
      const months = [...new Set(data.map((item) => item.month))];
      const animalTypes = [...new Set(data.map((item) => item.animalType))];

      const datasets = animalTypes.map((type) => ({
        label: type,
        data: months.map((month) =>
          data.find((item) => item.month === month && item.animalType === type)?.total || 0
        ),
        backgroundColor: getRandomColor(),
      }));

      setChartData({
        labels: months,
        datasets,
      });
    } else {
      setChartData(null);
    }
    setLoading(false);
  };
  const fetchFeedConsumptionData = async (year) => {
    try {
      const response = await axios.post("https://localhost:7185/api/Dashboard/weekly", {
        year: year,
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("API returned an error", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching feed consumption data:", error);
      return [];
    }
  };
  const loadData = async () => {
    setLoading(true);
    const feedData = await fetchFeedConsumptionData(year);
    if (feedData && feedData.length > 0) {
      const formattedData = feedData.map((item) => ({
        name: item.name,
        thức_ăn: item.totalQuantity,
      })).sort((a, b) => {
        const weekA = parseInt(a.name.replace("Tuần ", ""), 10);
        const weekB = parseInt(b.name.replace("Tuần ", ""), 10);
        return weekA - weekB;
      });
      setFeedConsumptionData(formattedData);
    } else {
      setFeedConsumptionData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGrowthData();
    loadData();
    fetchStats();
    loadRecentActive();
  }, [startDate, endDate, year]);

  return (
    <Box className="dashboard">
    <Grid container spacing={3} className="grid-container">
      {/* Stats Section */}
      <Grid item xs={12} sm={6} md={4}>
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <Card key={index} className="card">
              <CardContent className="card-content">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box className="icon">{stat.icon}</Box>
                  <Typography variant="h6">{stat.title}</Typography>
                </Box>
                <Typography variant="body1">{stat.value}</Typography>
                <Typography variant="body2" color="textSecondary" className="details">{stat.trend}</Typography>
                <Typography variant="body2">{stat.details}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No stats available.</Typography>
        )}
      </Grid>
  
      {/* Environment Stats Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Paper className="paper">
          {environmentStats.map((stat, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <Box className="icon">{stat.icon}</Box>
              <Typography variant="body1">{stat.title}: {stat.value}</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
  
      {/* Growth Chart Section */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom className="chart-section">Tăng trưởng đàn vật nuôi theo tháng</Typography>
        <Box sx={{ display: 'flex', gap: 2 }} className="date-picker">
          <Box>
            <Typography>Từ ngày:</Typography>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" />
          </Box>
          <Box>
            <Typography>Đến ngày:</Typography>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" />
          </Box>
          <Button onClick={loadGrowthData} variant="contained" disabled={loading} className="button">{loading ? "Đang tải..." : "Xem báo cáo"}</Button>
        </Box>
  
        {chartData && chartData.labels && chartData.datasets && chartData.datasets.length > 0 ? (
          <div className="chart-container">
            <ChartJSBar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Tăng trưởng đàn vật nuôi theo tháng"
                  },
                },
              }}
            />
          </div>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </Grid>
  
      {/* Feed Consumption Chart Section */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom className="chart-section">Tiêu thụ thức ăn (kg)</Typography>
        <Box sx={{ display: 'flex', gap: 2 }} className="date-picker">
          <Box>
            <Typography>Chọn năm:</Typography>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min="2020"
              max="2030"
              className="feed-consumption-input"
            />
          </Box>
          <Button onClick={loadData} variant="contained" disabled={loading} className="button">
            {loading ? "Đang tải dữ liệu..." : "Xem dữ liệu"}
          </Button>
        </Box>
  
        {feedConsumptionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="thức_ăn" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </Grid>
  
      {/* Recent Activities Section */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom className="recent-activities-section">Hoạt động gần đây</Typography>
        <Box className="recent-activities-list">
          {recentActivitie.length > 0 ? (
            recentActivitie.map((activity, index) => (
              <Box key={index} className="recent-activities-item">
                <Typography variant="body1">{activity.action}</Typography>
                <Typography variant="body2" color="textSecondary" className="time">{activity.time}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No recent activities available.</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  </Box>
  
  );
}

export default Dashboard;
