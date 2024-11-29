import axios from "axios";

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: "https://localhost:7185/api",  // Thay đổi URL này thành URL API của bạn
  timeout: 10000,  // Thời gian timeout là 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm Interceptor (nếu cần)
// Ví dụ: xử lý token cho xác thực
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // Lấy token từ localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Thêm token vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Ví dụ: nếu bị lỗi xác thực, bạn có thể chuyển hướng người dùng đến trang login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default api;
