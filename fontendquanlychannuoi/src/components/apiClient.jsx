import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7185/api/",
});

// Interceptor để kiểm tra token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn, chuyển hướng đến trang đăng nhập
      localStorage.removeItem("token");
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
