import React, { useState } from 'react';

const SignUpForm = () => {
  const roles = [
    { value: 'paraprofessional', label: 'Veterinary Paraprofessional' },
    { value: 'surgeon', label: 'Veterinary Surgeon' },
    { value: 'farmer', label: 'Farmer' },
  ];

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: roles[0].value, // Default to the first role
    licenseNumber: '',
    licenseExpiry: '',
  });

  const [error, setError] = useState('');

  const isSurgeon = formData.role === 'surgeon';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (newRole) => {
    setFormData(prev => ({ 
      ...prev, 
      role: newRole,
      licenseNumber: newRole === 'surgeon' ? prev.licenseNumber : '',
      licenseExpiry: newRole === 'surgeon' ? prev.licenseExpiry : '',
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (isSurgeon && (!formData.licenseNumber || !formData.licenseExpiry)) {
      setError('Veterinary Surgeons must provide a valid license number and expiry date.');
      return;
    }
    
    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields.');
      return;
    }

    console.log('Attempting signup with data:', formData);
    alert(`Account created for ${formData.email} as a ${formData.role}!`);
  };

  const FormField = ({ label, id, type = 'text', required = true }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={formData[id]}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );

  const handleLoginClick = (e) => {
      // Prevent default hash navigation if the link is a real button/route component
      e.preventDefault(); 
      alert("Navigating to Login...");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection Tabs */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-3">Select Your Role</legend>
            <div className="flex border-b border-gray-200">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleChange(role.value)}
                  className={`
                    flex-grow py-3 px-4 text-sm font-medium transition-colors duration-200
                    focus:outline-none text-center
                    ${formData.role === role.value
                      ? `text-indigo-600 border-b-2 border-indigo-600`
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }
                  `}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </fieldset>
          
          <hr className="border-gray-100" />
          
          {/* Common Fields */}
          <div className="space-y-4">
            <FormField label="Email Address" id="email" type="email" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Password" id="password" type="password" />
              <FormField label="Confirm Password" id="confirmPassword" type="password" />
            </div>
          </div>

          {/* Conditional Fields for Veterinary Surgeon */}
          {isSurgeon && (
            <div className="border border-yellow-300 p-4 rounded-lg bg-yellow-50 space-y-4 transition-all duration-300">
              <h4 className="text-lg font-semibold text-yellow-800">License Information Required</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField 
                  label="Veterinary License Number" 
                  id="licenseNumber"
                  type="text"
                  required={true}
                />
                <FormField 
                  label="License Expiry Date" 
                  id="licenseExpiry"
                  type="date"
                  required={true}
                />
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Register Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600`}
            >
              Register
            </button>
          </div>
        </form>
        
        {/* Added Login Link - FIX APPLIED HERE */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? 
            <a 
              // FIX: Used a valid looking path instead of '#'
              href="/login" 
              onClick={handleLoginClick}
              className="font-medium text-indigo-600 hover:text-indigo-700 ml-1"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;