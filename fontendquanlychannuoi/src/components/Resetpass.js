import React, { useState,useEffect } from "react";
import { useSearchParams,useNavigate } from "react-router-dom"; // Sử dụng React Router để lấy token từ URL
import './LoginForm.css'
function Resetpass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

    try {
      const response = await fetch("https://localhost:7185/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message ||"Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
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
        <button type="submit" className="btn-login">Đổi Mật Khẩu</button>
      </form>
    </div>
  </div>
  );
}

export default Resetpass;
