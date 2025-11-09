import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/LoginForm';
import FarmerProfile from './components/FarmerProfile';
import SignUpForm from './components/RegisterForm';
import VetProfile from './components/vet_components/VetProfile';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PaymentComponent from './components/PaymentComponent';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/farmer-profile" element={<FarmerProfile />} />
          <Route path="register" element={<SignUpForm />}/>
          <Route path ="/vet-profile" element={<VetProfile />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/payment" element={<PaymentComponent />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;