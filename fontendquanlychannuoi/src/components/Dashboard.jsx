import React, { useState, useEffect } from "react";
import { FaHorse, FaPiggyBank, FaExclamationTriangle, FaThermometerHalf, FaWater, FaWeight } from "react-icons/fa";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';
import { Bar as ChartJSBar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";
import axios from "axios";
function Dashboard() {
  const icons = [<FaHorse />, <FaPiggyBank />, <FaWeight />, <FaExclamationTriangle />];
  //api lấy thông báo
  const fetchApiRecentAction = async () => {
    try {
      const response = await axios.get("https://localhost:7185/api/Dashboard/recent-activities");
      if (response.status === 200) { // Kiểm tra dữ liệu ở đây
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
        // Duyệt qua từng phần tử trong mảng và tạo đối tượng stat
        const formattedStats = data.map((item, index) => ({
          action: item.action,
          time: item.time,
          type: item.type,
          priority: item.priority
        }));
        setRecentActivities(formattedStats)
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };
  useEffect(() => { loadRecentActive(); }, []);
  //api lấy số animal trong tháng
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
        // Duyệt qua từng phần tử trong mảng và tạo đối tượng stat
        const formattedStats = data.map((item, index) => ({
          icon: icons[index % icons.length], // Lựa chọn icon theo index
          title: item.title.join(', '), // Hiển thị tất cả các giá trị trong mảng title
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
  useEffect(() => { fetchStats(); }, []);
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
      if (response.status === 200) { // Kiểm tra dữ liệu ở đây
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
      // Không có dữ liệu
      setChartData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGrowthData();
  }, [startDate, endDate]);

  const handleFetchData = () => {
    loadGrowthData();
  };

  //api lấy sô liệu tổng thức ăn tiêu thụ theo tuần để vẽ biểu đồ
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

    // Lấy dữ liệu tiêu thụ thức ăn
    const feedData = await fetchFeedConsumptionData(year);
    if (feedData && feedData.length > 0) {
      const formattedData = feedData.map((item) => ({
        name: item.name,
        thức_ăn: item.totalQuantity,
      })).sort((a, b) => {
        const weekA = parseInt(a.name.replace("Tuần ", ""), 10);
        const weekB = parseInt(b.name.replace("Tuần ", ""), 10);
        return weekA - weekB
      });

      setFeedConsumptionData(formattedData); // Cập nhật dữ liệu thức ăn

    } else {
      setFeedConsumptionData([]); // Không có dữ liệu
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [year]);
  const handleDataFeed = () => {
    loadData();
  };
  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
                <span className="trend">{stat.trend}</span>
                <span className="details">{stat.details}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No stats available.</p>
        )}
      </div>



      <div className="environment-stats">
        {environmentStats.length > 0 ? (
          environmentStats.map((stat, index) => (
            <div key={index} className={`env-stat ${stat.status}`}>
              {stat.icon}
              <div className="env-stat-info">
                <h4>{stat.title}</h4>
                <p>{stat.value}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No environmental statistics available.</p>
        )}
      </div>


      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Biểu đồ tăng trưởng đàn</h2>
          <div className="date-picker-container">
            <div>
              <label htmlFor="startDate">Từ ngày:</label>
              <DatePicker id="startDate"
                placeholderText="Chọn ngày bắt đầu" aria-label="Chọn ngày bắt đầu" title="Chọn ngày bắt đầu" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" />
            </div>
            <div>
              <label htmlFor="endDate">Đến ngày:</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" id="endDate"
                placeholderText="Chọn ngày kết thúc" aria-label="Chọn ngày kết thúc"
                title="Chọn ngày kết thúc" />
            </div>
            <button
              onClick={handleFetchData} disabled={loading} title={loading ? "Đang tải dữ liệu..." : "Nhấn để xem báo cáo"}
              aria-label={loading ? "Đang tải dữ liệu" : "Xem báo cáo"}>
              {loading ? "Đang tải..." : "Xem báo cáo"}
            </button></div>
          <div className="chart-container">
            {chartData && chartData.labels && chartData.datasets && chartData.datasets.length > 0 ? (
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
                    font: {
                      size: 20, // Chỉnh kích thước font của tiêu đề
                      weight: 'bold',
                    },
                    color: '#333',
                    scales: {
                      x: {
                        type: 'category',  // Trục X là các tháng
                        title: {
                          display: true,
                          text: 'Tháng',
                        },
                      },
                      y: {
                        type: 'linear',  // Trục Y là số lượng vật nuôi
                        title: {
                          display: true,
                          text: 'Số lượng',
                        },
                      }
                    } // Màu tiêu đề
                  },
                }}
              />
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </div>
        </div>

        <div className="feed-consumption">
          <h2>Tiêu thụ thức ăn (kg)</h2>
          <div className="year-selector">
            <label htmlFor="year">Chọn năm:</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min="2020"
              max="2030"
            />
            <button onClick={handleDataFeed} disabled={loading}>
              {loading ? "Đang tải dữ liệu..." : "Xem dữ liệu"}
            </button>
          </div>
          {feedConsumptionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Tuần", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Thức ăn (kg)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => `${value} kg`} />
                <Bar dataKey="thức_ăn" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>) : (
            <p>Không có dữ liệu</p>)}
        </div>
      </div>

      <div className="activities-section">
        <h2>Hoạt động gần đây</h2>
        <div className="activities-list">
          {recentActivitie && recentActivitie.length > 0 ? (
            recentActivitie.map((activity, index) => (
              <div
                key={index}
                className={`activity-item ${activity.type} ${activity.priority || ""}`}
              >
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No recent activities available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
