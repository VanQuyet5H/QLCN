import React from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";  // Cập nhật Routes từ react-router-dom v6
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';  // Form đăng ký của bạn
import ForgetPass from './components/ForgetPass';
import Home from './pages/Home';
import Resetpass from './components/Resetpass';
import LivestockList from './components/livestock/LivestockList'

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/home" element={ <ProtectedRoute>
            <Home/></ProtectedRoute>}/>
          <Route path="/Resetpass" element={<Resetpass/>}/>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgetPass />} />  
          <Route path="/LivestockList" element={<LivestockList />} />
         
        </Routes>
    </Router>
    
  );
}
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
export default App;
