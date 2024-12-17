import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Typography, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const AddHealthRecord = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medication, setMedication] = useState("");
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState(""); // Cần lấy ID người dùng từ đăng nhập hoặc session
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { animalId } = useParams(); // Lấy animalId từ URL
  const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id"); // Lấy UserId từ localStorage

  if (!userId) {
    alert("Vui lòng đăng nhập để thêm lịch sử chăm sóc.");
    return;
  }
    setLoading(true);
    const healthRecord = {
      AnimalId: animalId,
      UserId: userId, // Cần phải lấy ID người dùng thực tế
      CheckupDate: new Date().toISOString(),
      Diagnosis: diagnosis,
      Treatment: treatment,
      Medication: medication,
      Notes: notes,
    };

    try {
      const response = await axios.post(
        `https://localhost:7185/add`,
        healthRecord
      );
      setSuccessMessage(response.data.Message);
      setLoading(false);
      // Chuyển hướng về danh sách vật nuôi
      navigate("/sick-animals"); // Thay đổi URL
    } catch (error) {
      setError(error.response?.data || "Đã có lỗi xảy ra");
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Thêm Lịch Sử Chăm Sóc Cho Vật Nuôi
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Chẩn đoán"
            fullWidth
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Điều trị"
            fullWidth
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Thuốc"
            fullWidth
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Ghi chú"
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang Thêm..." : "Thêm Lịch Sử"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddHealthRecord;
