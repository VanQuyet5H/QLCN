import React, { useState, useEffect } from "react";
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, Snackbar, Alert } from "@mui/material";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

const TrackByCage = () => {
  const [cages, setCages] = useState([]);
  const [selectedCageId, setSelectedCageId] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [trackingResult, setTrackingResult] = useState(null);
  const [notification, setNotification] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Lấy danh sách chuồng
  useEffect(() => {
    fetch("https://localhost:7185/api/QualityControl/cages")
      .then((response) => response.json())
      .then((data) => setCages(data))
      .catch((error) => console.error("Error fetching cages:", error));
  }, []);

  // Lấy danh sách vật nuôi khi chọn chuồng
  useEffect(() => {
    if (selectedCageId) {
      fetch(`https://localhost:7185/api/QualityControl/cages/${selectedCageId}/animals`)
        .then((response) => response.json())
        .then((data) =>
          setAnimals(
            data.map((animal) => ({
              ...animal,
              checked: false,
              weight: "",
              height: "",
              condition: "",
              remarks: "",
              healthStatus: "",
            }))
          )
        )
        .catch((error) => console.error("Error fetching animals:", error));
    }
  }, [selectedCageId]);

  const handleAnimalCheck = (id) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, checked: !animal.checked } : animal
      )
    );
  };

  const handleAnimalChange = (id, field, value) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, [field]: value } : animal
      )
    );
  };

  const trackAllAnimals = () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setNotification("Vui lòng đăng nhập trước khi theo dõi vật nuôi.");
      setOpenSnackbar(true);
      return;
    }

    const animalDetails = animals
      .filter((animal) => animal.checked)
      .map(({ id, weight, height, condition, remarks, healthStatus }) => ({
        animalId: id,
        weight: parseFloat(weight) || 0,
        height: parseFloat(height) || 0,
        condition: condition || "N/A",
        remarks: remarks || "N/A",
        healthStatus: healthStatus || "Good",
      }));

    const payload = {
      userId: parseInt(userId, 10),
      animalDetails,
    };

    fetch(`https://localhost:7185/api/QualityControl/cages/${selectedCageId}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to track animals");
        }
        return response.json();
      })
      .then((data) => {
        setTrackingResult(data);
        setNotification("Thông tin tăng trưởng đã được lưu thành công.");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        setNotification("Có lỗi xảy ra khi theo dõi vật nuôi.");
        setOpenSnackbar(true);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Theo dõi tăng trưởng vật nuôi
      </Typography>

      {/* Thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={notification.includes("lỗi") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {notification}
        </Alert>
      </Snackbar>

      {/* Chọn chuồng */}
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Chọn chuồng</InputLabel>
          <Select
            value={selectedCageId || ""}
            label="Chọn chuồng"
            onChange={(e) => setSelectedCageId(e.target.value)}
          >
            <MenuItem value="" disabled>
              -- Chọn chuồng --
            </MenuItem>
            {cages.map((cage) => (
              <MenuItem key={cage.id} value={cage.id}>
                {cage.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Danh sách vật nuôi */}
      {animals.length > 0 && (
        <Grid xs={12} spacing={2}>
          {animals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Paper sx={{ padding: 2 }}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={animal.checked}
                    onChange={() => handleAnimalCheck(animal.id)}
                    sx={{ marginRight: 2 }}
                  />
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {animal.name}
                  </Typography>
                </Box>

                {animal.checked && (
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Cân nặng (kg)"
                          variant="outlined"
                          fullWidth
                          value={animal.weight}
                          onChange={(e) => handleAnimalChange(animal.id, "weight", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Chiều cao (cm)"
                          variant="outlined"
                          fullWidth
                          value={animal.height}
                          onChange={(e) => handleAnimalChange(animal.id, "height", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Tình trạng"
                          variant="outlined"
                          fullWidth
                          value={animal.condition}
                          onChange={(e) => handleAnimalChange(animal.id, "condition", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Ghi chú"
                          variant="outlined"
                          fullWidth
                          value={animal.remarks}
                          onChange={(e) => handleAnimalChange(animal.id, "remarks", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Tình trạng sức khỏe"
                          variant="outlined"
                          fullWidth
                          value={animal.healthStatus}
                          onChange={(e) => handleAnimalChange(animal.id, "healthStatus", e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={trackAllAnimals}
          sx={{ padding: "10px 20px", fontSize: "12px" }}
        >
          Lưu thông tin tăng trưởng
        </Button>
      </Box>
    </Container>
  );
};

export default TrackByCage;
