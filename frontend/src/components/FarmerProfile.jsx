import React from 'react';

// Sample data for the user (can be used to pre-fill the form)
const userData = {
  name: 'Wayne Carl',
  username: 'WayneC',
  firstName: 'Wayne',
  lastName: 'Geno',
  avatarUrl: 'https://i.pravatar.cc/150?img=1', 
  email: 'wcgw@example.com',
  phone1: '555-123-4567',
  phone2: '',
  location: 'San Francisco, CA',
};

// Simple Logout Icon component
const LogoutIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
    />
  </svg>
);

// Reusable Input Field Component
const FormField = ({ label, id, type = 'text', defaultValue, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      defaultValue={defaultValue}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
      {...props}
    />
  </div>
);


// Profile Tab Content Component (Child)
// **FIXED: Accepts activeColor as a prop**
const ProfileContent = ({ data, activeColor }) => { 
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Details</h2>

      {/* 1. Username, First Name, Last Name fields across the screen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Username" id="username" defaultValue={data.username} />
        <FormField label="First Name" id="firstName" defaultValue={data.firstName} />
        <FormField label="Last Name" id="lastName" defaultValue={data.lastName} />
      </div>

      {/* 2. Contact Fieldset */}
      <fieldset className="border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-medium text-gray-800 px-2">Contact Information</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* Email and Location (Left Column) */}
          <div>
            <FormField label="Email Address" id="email" type="email" defaultValue={data.email} />
            <FormField label="Location" id="location" defaultValue={data.location} />
          </div>
          
          {/* Phone Number 1 and Phone Number 2 (Right Column) */}
          <div>
            <FormField label="Phone Number 1" id="phone1" defaultValue={data.phone1} />
            <FormField label="Phone Number 2 (Optional)" id="phone2" defaultValue={data.phone2} />
          </div>
        </div>
      </fieldset>

      {/* 3. Security Group with fields for password modification */}
      <fieldset className="border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-medium text-gray-800 px-2">Security</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Current Password" id="currentPassword" type="password" />
          <FormField label="New Password" id="newPassword" type="password" />
          <FormField label="Confirm New Password" id="confirmNewPassword" type="password" />
        </div>
        
        <div className="mt-4 flex justify-end">
             <button
                type="submit"
                // **FIXED: Uses activeColor prop for styling**
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-${activeColor} hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
             >
                Update Security
             </button>
        </div>
      </fieldset>
      
    </div>
  );
};


// Main Component (Parent)
const ProfileHeaderCard = () => {
  const activeColor = 'indigo-700'; // Defined here
  const [activeTab, setActiveTab] = React.useState('profile');

  const tabs = [
    { name: 'Profile', key: 'profile' },
    { name: 'Summary', key: 'summary' },
    { name: 'Quick actions', key: 'actions' },
  ];

  const handleLogout = () => {
    alert('Logging out...');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        // **FIXED: activeColor is passed down as a prop**
        return <ProfileContent data={userData} activeColor={activeColor} />; 
      case 'summary':
        return <p className="p-6">Content for the **Summary** tab...</p>;
      case 'actions':
        return <p className="p-6">Content for the **Quick actions** tab...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* Header Card */}
      <div 
        className={`bg-${activeColor} w-full shadow-xl py-10 px-8 flex justify-between items-start rounded-b-lg`}
      >
        <div className="flex items-center">
          <img
            src={userData.avatarUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white mr-6"
          />
          <div className="text-white text-3xl font-bold">
            {userData.name}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center text-white text-sm font-medium opacity-90 hover:opacity-100 transition-opacity p-2 rounded-md mt-1"
        >
          <LogoutIcon /> 
          <span className="ml-1">logout</span>
        </button>
      </div>

      {/* Tabs and Content Wrapper */}
      <div className="w-full pt-0 sm:pt-4"> 
          <div className="bg-white shadow-md">
            
            {/* Tabbed Navigation Section */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-grow py-3 px-0 text-sm font-medium transition-colors duration-200
                    focus:outline-none text-center
                    ${activeTab === tab.key
                      ? `text-${activeColor} border-b-2 border-${activeColor}`
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="p-6 sm:px-8">
                {renderContent()}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;