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
        <h1>Forgot Password</h1>
        <p>Please enter your email address to reset your password.</p>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn"  >Send Reset Link</button>
        <div className="back-links">
          <a href="/login">Back to Login</a>
          <a href="/signup">Create an Account</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
