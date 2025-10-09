import React, { useState } from "react";
// import axios from "axios";

const Register = () => {
  const [role, setRole] = useState("farmer"); // default selection
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "", // only for vets
    location: "",      // for both
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    // try {
    //   const res = await axios.post("http://localhost:5000/api/register", {
    //     ...formData,
    //     role,
    //   });

    //   if (res.status === 201) {
    //     setMessage("✅ Registration successful!");
    //     setFormData({
    //       name: "",
    //       email: "",
    //       phone: "",
    //       password: "",
    //       confirmPassword: "",
    //       licenseNumber: "",
    //       location: "",
    //     });
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setMessage("⚠️ Registration failed. Please try again.");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => handleRoleChange("farmer")}
            className={`px-4 py-2 rounded-full border ${
              role === "farmer"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Farmer
          </button>

          <button
            onClick={() => handleRoleChange("vet")}
            className={`px-4 py-2 rounded-full border ${
              role === "vet"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Veterinary
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* License Number - Only for Veterinary Professionals */}
          {role === "vet" && (
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          )}

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg ${
              role === "vet" ? "bg-blue-600" : "bg-green-600"
            } hover:opacity-90`}
          >
            Register as {role === "vet" ? "Veterinary" : "Farmer"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Register;
