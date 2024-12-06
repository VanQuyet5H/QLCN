import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';
import { useNavigate } from 'react-router-dom';
import image from '../assets/default-avatar.jpg';
function RegisterForm() {
    const navigate=useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        image:image,
        role: 'User', // Mặc định là User
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Tên đăng nhập không được để trống.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ.';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Mật khẩu không được để trống.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        }
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống.';
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống.';
        } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại phải từ 10-11 chữ số.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true); 
        const requestData = { ...formData, role: 'User',image:image };
        try {
            const response = await axios.post('https://localhost:7185/api/Auth/Register', requestData);
            setMessage('Đăng ký thành công!');
            setTimeout(() => navigate("/login"), 3000);
            console.log(response.data);
        } catch (error) {
            setMessage('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error(error);
        }
        finally {
            setIsSubmitting(false); // Kết thúc trạng thái gửi
          }
    };

    return (
        <div className="register-form-container">
            <form className="register-form" onSubmit={handleSubmit} >
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
                     {errors.username && <p className="error">{errors.username}</p>}
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
                    {errors.email && <p className="error">{errors.email}</p>}
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
                    {errors.password && <p className="error">{errors.password}</p>}
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
                     {errors.fullName && <p className="error">{errors.fullName}</p>}
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
                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                </div>
                 
                <button type="submit" className="btn" disabled={isSubmitting}>Đăng ký {isSubmitting ? "Đang gửi..." : "Gửi"}</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
}

export default RegisterForm;
