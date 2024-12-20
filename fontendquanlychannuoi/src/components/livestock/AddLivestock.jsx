import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import "./AddLivestock.css";
import axios from "axios";
import Notification from "../utils/Notification";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Grid, // Add Grid for layout
} from "@mui/material";

function AddLivestock({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    gender: "Male",
    birthDate: "",
    status: "",
    weight: "",
    breed: "",
    otherType: "", // Thêm trường otherType
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập tên vật nuôi";
    if (!formData.type && !formData.otherType) newErrors.type = "Vui lòng chọn loại vật nuôi hoặc nhập loại khác";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
    if (!formData.birthDate) newErrors.birthDate = "Vui lòng nhập ngày sinh";
    if (!formData.status) newErrors.status = "Vui lòng nhập trạng thái";
    if (!formData.weight) newErrors.weight = "Vui lòng nhập cân nặng";
    if (!formData.breed) newErrors.breed = "Vui lòng chọn giống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalType = formData.type === "Other" && formData.otherType ? formData.otherType : formData.type;
    if (validateForm()) {
      const formattedData = {
        ...formData,
        type: finalType,
        weight: parseFloat(formData.weight),
        createdAt: new Date().toISOString(),
      };
      // Gọi API thêm vật nuôi
      try {
        const response = await axios.post("https://localhost:7185/api/Animal/ThemGiong", formattedData);
        console.log("Vật nuôi đã được thêm thành công:", response.data);
        setNotification({ message: "Thêm vật nuôi thành công!", type: "success" });
      } catch (error) {
        console.error("Lỗi khi thêm vật nuôi: ", error);
        setNotification({ message: "Lỗi khi thêm vật nuôi", type: "error" });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value !== "Other") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        otherType: "", // Reset otherType nếu không chọn "Khác"
      }));
    } else if (name === "type" && value === "Other") {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Giữ lại giá trị "Other"
      }));
    } else if (name === "otherType") {
      setFormData((prev) => ({
        ...prev,
        otherType: value, // Cập nhật giá trị "otherType" khi người dùng nhập vào
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Reset lỗi cho trường này nếu có
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      gender: "Male",
      birthDate: "",
      status: "",
      weight: "",
      breed: "",
      otherType: "", // Reset otherType khi hủy
    });
    if (onClose) {
      onClose(); // Đóng form nếu có hàm onClose
    }
  };

  return (
    <Box className="add-livestock-container" sx={{ p: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Vật Nuôi Mới
      </Typography>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
      <form onSubmit={handleSubmit} className="add-livestock-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên vật nuôi *"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.type}>
              <InputLabel id="type-label">Loại vật nuôi *</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={formData.type}
                onChange={handleChange}
                label="Loại vật nuôi"
                name="type"
              >
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="Cattle">Gia súc</MenuItem>
                <MenuItem value="Pig">Heo</MenuItem>
                <MenuItem value="Chicken">Gà</MenuItem>
                <MenuItem value="Other">Khác</MenuItem>
              </Select>
              {errors.type && <Typography color="error">{errors.type}</Typography>}
            </FormControl>
          </Grid>

          {/* Hiển thị trường nhập loại nếu chọn "Khác" */}
          {formData.type === "Other" && (
            <Grid item xs={6} sm={12}>
              <TextField
                fullWidth
                label="Nhập loại vật nuôi khác"
                variant="outlined"
                name="otherType"
                value={formData.otherType}
                onChange={handleChange}
                error={!!errors.otherType}
                helperText={errors.otherType}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Giới tính *</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Giới tính"
                name="gender"
              >
                <MenuItem value="Male">Đực</MenuItem>
                <MenuItem value="Female">Cái</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Ngày sinh *"
              variant="outlined"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              error={!!errors.birthDate}
              helperText={errors.birthDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Trạng thái *"
              variant="outlined"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={!!errors.status}
              helperText={errors.status}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cân nặng (kg) *"
              variant="outlined"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              error={!!errors.weight}
              helperText={errors.weight}
              type="number"
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} >
            <TextField
              fullWidth
              label="Giống *"
              variant="outlined"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              error={!!errors.breed}
              helperText={errors.breed}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              
              <Button variant="contained" color="primary" sx={{ mr: 1 }} startIcon={<FaSave />} type="submit">
                Lưu
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<FaTimes />}
                onClick={handleCancel}
                
              >
                Hủy
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default AddLivestock;
