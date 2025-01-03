import React, { useState,useEffect } from "react";
import { useSearchParams,useNavigate } from "react-router-dom"; // Sử dụng React Router để lấy token từ URL
import './Resetpass.css';
import axios from 'axios'; // Import axios
function Resetpass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token,setToken]=useState(null);
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setError("Invalid or missing token.");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    setLoading(true); // Bắt đầu loading khi yêu cầu gửi đi

    try {
      const response = await axios.post("https://localhost:7185/api/Auth/reset-password", {
        token, 
        newPassword
      });

      if (response.status === 200) {
        setSuccess(response.data.message || "Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      setError(error.response?.data || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="login-container">
    <div className="login-form">
      <h2>Đổi Mật Khẩu</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu Mới</label>
          <input
            type="password"
            id="password"
            name="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Xác Nhận Mật Khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleSubmit} className="btn-login">Đổi Mật Khẩu</button>
      </form>
    </div>
  </div>
  );
}

export default Resetpass;
