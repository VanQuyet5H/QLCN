import React, { useState } from "react";
import './LoginForm.css'
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://localhost:7185/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "Đăng nhập thất bại.");
        return;
      }else{
          
          // Lưu token vào localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.id);
          localStorage.setItem("role", data.role);
          navigate('/home');
          
      }
    } catch (err) {
      setError("Đã xảy ra lỗi trong quá trình đăng nhập.");
      console.error(err);
    }
  };
  return (
    <div className="login-container">
    <div className="login-form">
      <h2>Đăng Nhập</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-login">Đăng Nhập</button>
      </form>
      <div className="extra-links">
      <a href="/signup" className="link">Đăng ký</a>
      <a href="/forgot-password" className="link">Quên mật khẩu?</a>
      </div>
    </div>
  </div>
  );
};
export default LoginForm;
