import React from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";  // Cập nhật Routes từ react-router-dom v6
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';  // Form đăng ký của bạn
import ForgetPass from './components/ForgetPass';
import Resetpass from './components/Resetpass';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from './pages/Theme';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
    <Router>
      <Routes>
        
          <Route path="/*" element={ 
            <Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/Resetpass" element={<Resetpass/>}/>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgetPass />} />  
        </Routes>
    </Router>
    </ThemeProvider>
  );
}
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
export default App;