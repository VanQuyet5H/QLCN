import React, { useState, useEffect } from "react";
import axios from "axios";
import './SickAnimals.css';
import AnimalStatus from './AnimalStatus';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, Alert, Typography } from '@mui/material';

const SickAnimalsList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medication, setMedication] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios
      .get("https://localhost:7185/danhsachvatnuoicandieutri")
      .then((response) => {
        setAnimals(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể lấy dữ liệu vật nuôi bị ốm.");
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (animal) => {
    setSelectedAnimal(animal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnimal(null);
    setDiagnosis("");
    setTreatment("");
    setMedication("");
    setNotes("");
    setSuccessMessage(null);
    setError(null);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("Vui lòng đăng nhập để thêm lịch sử chăm sóc.");
      return;
    }

    const healthRecord = {
      AnimalId: selectedAnimal.id,
      UserId: userId,
      CheckupDate: new Date().toISOString(),
      Diagnosis: diagnosis,
      Treatment: treatment,
      Medication: medication,
      Notes: notes,
    };

    try {
      const response = await axios.post("https://localhost:7185/add", healthRecord);
      console.log(response);
      setSuccessMessage(response.data.Message);
      alert("Lịch sử chăm sóc đã được thêm thành công!");
      handleCloseModal(); // Close modal after success
    } catch (error) {
      setError(error.response?.data || "Đã có lỗi xảy ra");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sick-animals-list">
      <h2>Danh Sách Vật Nuôi Bị Bệnh</h2>
      {animals.length > 0 ? (
        <table className="animals-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Loại</th>
              <th>Giới Tính</th>
              <th>Ngày Sinh</th>
              <th>Cân Nặng</th>
              <th>Giống</th>
              <th>Tình Trạng</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal, index) => (
              <tr key={animal.id}>
                <td>{index + 1}</td>
                <td>{animal.name}</td>
                <td>{animal.type}</td>
                <td>{animal.gender}</td>
                <td>{formatDate(animal.birthDate)}</td>
                <td>{animal.weight} kg</td>
                <td>{animal.breed}</td>
                <td>
                  <AnimalStatus animalId={animal.id} currentStatus={animal.status} />
                </td>
                <td>
                  {(animal.status.toLowerCase() === "ốm" || animal.status.toLowerCase() === "đang điều trị") && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(animal)}
                    >
                      Điều trị
                    </Button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có vật nuôi bị ốm.</p>
      )}

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Thêm Lịch Sử Chăm Sóc Cho Vật Nuôi</DialogTitle>
        <DialogContent>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

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
          </Grid>
        </DialogContent>
        <DialogActions>

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Thêm Lịch Sử
          </Button>
          <Button onClick={handleCloseModal} color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SickAnimalsList;
