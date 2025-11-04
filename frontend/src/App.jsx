import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/LoginForm';
import FarmerProfile from './components/FarmerProfile';
import SignUpForm from './components/RegisterForm';
import VetProfilePage from './components/FindVet';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/farmer-profile" element={<FarmerProfile />} />
          <Route path="register" element={<SignUpForm />}/>
          <Route path ="/vet-profile" element={<VetProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;