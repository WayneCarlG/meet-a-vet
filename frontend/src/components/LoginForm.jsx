import React, { useState } from "react";
import { FaPaw } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from '../api';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for handling errors
  const navigate = useNavigate();

  // const API_URL = 'http://localhost:5000/login';

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission
  //   setError(""); // Clear previous errors

  //   try {
  //     // Send login data to the Flask backend
  //     const response = await axios.post(API_URL, {
  //       email: email,
  //       password: password},
  //       { withCredentials: true
  //   });

  //     // Handle Success (HTTP 200 OK)
  //     if (response.status === 200) {
  //       // 1. Save the token to localStorage to keep the user logged in
  //       localStorage.setItem('token', response.data.access_token);

  //       // 2. Navigate based on role
  //       const userRole = response.data.role;
        
  //       if (userRole === 'farmer') {
  //         navigate('/farmer-profile') // Redirect farmer
  //       } else if (userRole === 'surgeon' || userRole === 'paraprofessional') {
  //         window.location.href = '/vet-dashboard'; // Redirect vets
  //       } else {
  //           navigate('/'); // Fallback
  //       }
  //     }

  //   } catch (err) {
  //     // Handle Errors (401, 400, or Network Error)
  //     if (err.response) {
  //       // The server responded with an error (e.g., "Invalid email or password")
  //       setError(err.response.data.error || 'Login failed. Please try again.');
  //     } else if (err.request) {
  //       // Network error (server is down)
  //       setError('Network Error: Could not connect to the server.');
  //     } else {
  //       setError('An unexpected error occurred.');
  //     }
  //     console.error('Login Error:', err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const loginData = {
      email,
      password
    };

    try {
      console.log('Attempting login with:', { email }); // Log email only, not password
      const response = await api.post('/login', loginData);
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
      
      // Handle successful login
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        if (response.data.role === 'farmer') {
          navigate('/farmer-profile');
        } else if (response.data.role === 'surgeon' || response.data.role === 'paraprofessional') {
          navigate('/vet-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        code: err.code,
        config: err.config,
        response: err.response,
        request: err.request
      });

      if (err.response) {
        // Server responded with error (e.g. 401)
        console.error('Server error response:', {
          status: err.response.status,
          data: err.response.data
        });
        setError(err.response.data?.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request made but no response
        console.error('No response received:', {
          method: err.config?.method,
          url: err.config?.url
        });
        setError('Could not reach the server. Please check your connection and try again.');
      } else {
        // Something else failed
        console.error('Request setup error:', err.message);
        setError('Connection error. Please try again later.');
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <FaPaw />
          <h1 className="text-2xl font-bold text-gray-800">Meet-A-Vet</h1>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">
          Login to Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => alert("Forgot password functionality not yet built.")}
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}