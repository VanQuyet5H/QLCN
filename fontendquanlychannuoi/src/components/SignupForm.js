import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        role: 'User', // Mặc định là User
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestData = { ...formData, role: 'User' };
        try {
            const response = await axios.post('https://localhost:7185/api/Auth/Register', requestData);
            setMessage('Đăng ký thành công!');
            setTimeout(() => navigate("/login"), 3000);
            console.log(response.data);
        } catch (error) {
            setMessage('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error(error);
        }
    };

    return (
        <div className="register-form-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Đăng ký tài khoản</h2>
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
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
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fullName">Họ và Tên</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        required
                    />
                </div>
                 
                <button type="submit" className="btn">Đăng ký</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
}

export default RegisterForm;
