import React from "react";
import { useNavigate } from "react-router-dom";
import myPhoto from "../assets/pet.jpg";
import { FaStethoscope, FaUserMd, FaComments, FaPaw } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("register");
  }
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <FaPaw className="text-blue-600 text-3xl" />
          <h1 className="text-2xl font-bold text-gray-800">Meet-A-Vet</h1>
        </div>
        <nav className="space-x-6 text-gray-700">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
          <button onClick={handleRegister} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            Signup
          </button>
          <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Your Pet’s Health, <span className="text-blue-600">Anywhere, Anytime</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Connect with certified veterinary professionals instantly for 
            teleconsultations, prescriptions, and personalized advice — 
            all from the comfort of your home.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <img
            src={myPhoto}
            alt="Vet consultation"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-blue-100 py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-10">Why Choose Meet-A-Vet?</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaStethoscope className="text-blue-600 text-4xl mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">24/7 Consultations</h4>
              <p className="text-gray-600">
                Connect with vets anytime for expert care and quick diagnosis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaUserMd className="text-blue-600 text-4xl mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Certified Professionals</h4>
              <p className="text-gray-600">
                All vets are licensed and experienced in animal healthcare.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaComments className="text-blue-600 text-4xl mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Seamless Communication</h4>
              <p className="text-gray-600">
                Chat or video call for real-time consultations with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Meet-A-Vet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}