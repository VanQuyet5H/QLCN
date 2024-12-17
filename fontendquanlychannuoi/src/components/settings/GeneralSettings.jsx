import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Select, MenuItem, Snackbar, IconButton } from "@mui/material";
import { IntlProvider, FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CloseIcon from '@mui/icons-material/Close';

const messages = {
  en: {
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    save: "Save",
    cancel: "Cancel",
    saveSuccess: "Settings saved successfully!",
    cancelSuccess: "Changes canceled.",
  },
  vi: {
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    theme: "Giao diện",
    light: "Sáng",
    dark: "Tối",
    save: "Lưu",
    cancel: "Hủy",
    saveSuccess: "Cài đặt đã được lưu!",
    cancelSuccess: "Thay đổi đã được hủy.",
  },
};

const GeneralSettings = ({ setThemeMode }) => {
  const navigate = useNavigate();  // Khởi tạo useNavigate
  const defaultTheme = localStorage.getItem("theme") || "light";
  const defaultLanguage = localStorage.getItem("language") || "en";

  const [language, setLanguage] = useState(defaultLanguage);
  const [themeModeLocal, setThemeModeLocal] = useState(defaultTheme);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [open, setOpen] = useState(true);  // Quản lý việc mở form

  // Cập nhật theme khi thay đổi
  useEffect(() => {
    setThemeMode(themeModeLocal);
    document.body.style.backgroundColor = themeModeLocal === "light" ? "#fff" : "#121212";
  }, [themeModeLocal, setThemeMode]);

  // Cập nhật ngôn ngữ khi thay đổi
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const handleSave = () => {
    localStorage.setItem("theme", themeModeLocal);
    setSnackbarMessage(messages[language].saveSuccess);
    setOpenSnackbar(true);
  };

  const handleCancel = () => {
    setLanguage(defaultLanguage);
    setThemeModeLocal(defaultTheme);
    setSnackbarMessage(messages[language].cancelSuccess);
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpen(false);  // Đóng form khi nhấn "Thoát"
    navigate('/home');  // Quay về trang home
  };

  return (
    <IntlProvider locale={language} messages={messages[language]}>
      {open && (
        <Box sx={{ maxWidth: "900px", p: 4, mx: "auto", my: 4, backgroundColor: "#f9fafb", position: "relative" }}>
          <IconButton
            onClick={handleClose}  // Gọi handleClose khi nhấn đóng
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            <FormattedMessage id="settings" />
          </Typography>
          
          {/* Chọn Ngôn Ngữ */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, fontWeight: 600 }}>
              <FormattedMessage id="language" />
            </Typography>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
              sx={{ fontSize: 16 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="vi">Tiếng Việt</MenuItem>
            </Select>
          </Box>

          {/* Chọn Theme */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, fontWeight: 600 }}>
              <FormattedMessage id="theme" />
            </Typography>
            <Select
              value={themeModeLocal}
              onChange={(e) => setThemeModeLocal(e.target.value)}
              fullWidth
              sx={{ fontSize: 16 }}
            >
              <MenuItem value="light">
                <FormattedMessage id="light" />
              </MenuItem>
              <MenuItem value="dark">
                <FormattedMessage id="dark" />
              </MenuItem>
            </Select>
          </Box>

          {/* Lưu và Hủy */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: 16, padding: "8px 16px" }}
              onClick={handleSave}
            >
              <FormattedMessage id="save" />
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ fontSize: 16, padding: "8px 16px" }}
              onClick={handleCancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              variant="text"
              color="error"
              sx={{ fontSize: 16, padding: "8px 16px" }}
              onClick={handleClose}
            >
              Thoát
            </Button>
          </Box>

          {/* Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage}
          />
        </Box>
      )}
    </IntlProvider>
  );
};

export default GeneralSettings;
