import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgetPass from "./components/ForgetPass";
import Resetpass from "./components/Resetpass";
import Home from "./pages/Home";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyle } from "./pages/Theme";
import GeneralSettings from "./components/settings/GeneralSettings";
// Component ProtectedRoute để bảo vệ các route cần đăng nhập
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme") || "light");

  // Cập nhật theme vào localStorage khi theme thay đổi
  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);
  return (
    <ThemeProvider theme={theme[themeMode]}>
      <GlobalStyle  theme={theme[themeMode]} />
      <Router>
        <Routes>
          {/* Route mặc định */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Route bảo vệ */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Các route không cần bảo vệ */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgetPass />} />
          <Route path="/Resetpass" element={<Resetpass />} />

          {/* Cài đặt */}
          <Route path="/settings" element={<GeneralSettings setThemeMode={setThemeMode} />} />

          {/* Xử lý route không tồn tại */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
