import React, { useState } from "react";
import "./ForgetPass.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7185/api/Auth/forgot-password", { email });
      alert(response.data.message || "Reset link sent!");
      navigate("/login")
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send reset link.");
    }
    // Gửi API để gửi link reset mật khẩu
    console.log("Email:", email);
  };

  return (
    <div className="container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
      <h1>Quên Mật Khẩu</h1>
      <p>Vui lòng nhập địa chỉ email của bạn để đặt lại mật khẩu.</p>
        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn"  >Gửi lại liên kết đặt lại</button>
        <div className="back-links">
          <a href="/login">Quay lại đăng nhập</a>
          <a href="/signup">Tạo tài khoản</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
