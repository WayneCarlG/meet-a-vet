import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Note: Icon imports removed and replaced with inline SVG for environment compliance.

// Tailwind CSS replacement for FaPawIcon
const FaPawIcon = ({ className = "w-10 h-10 text-blue-600" }) => (
  <div className={`relative inline-block ${className}`}>
    {/* Main Pad */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[45%] bg-current rounded-b-full rounded-t-lg"></div>
    {/* Toes */}
    <div className="absolute top-0 left-0 w-[22%] h-[22%] bg-current rounded-full"></div>
    <div className="absolute top-[5%] left-[28%] w-[22%] h-[22%] bg-current rounded-full"></div>
    <div className="absolute top-[5%] right-[28%] w-[22%] h-[22%] bg-current rounded-full"></div>
    <div className="absolute top-0 right-0 w-[22%] h-[22%] bg-current rounded-full"></div>
  </div>
);


// --- TAB CONTENT COMPONENTS ---

const DashboardContent = () => {
  const recentClients = [
    { id: 101, name: "Sunset Dairy Farm", status: "Active", lastContact: "2 days ago" },
    { id: 102, name: "Sarah Jenkins", status: "Active", lastContact: "Today" },
    { id: 103, name: "Green Acres Ranch", status: "Inactive", lastContact: "1 month ago" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Veterinarian Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Section (Stats + Client List) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Appointments Today" value="3" color="blue" />
            <StatCard title="New Consultation Requests" value="1" color="yellow" />
            <StatCard title="Active Clients" value="18" color="green" />
          </div>

          {/* Recent Client Activity Table */}
          <div>
            <h4 className="font-semibold text-lg mb-2 text-gray-700">Recent Client Activity</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Farm</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{client.lastContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl shadow-inner border">
          <h4 className="font-semibold text-lg mb-2 text-gray-700">Upcoming Tasks</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Review Farmer John's cattle report - Due 10:00 AM</li>
            <li>Virtual check-in with paraprofessional Sarah.</li>
            <li>Update your profile specialization fields.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProfileContent = () => (
  <div>
    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Manage Your Vet Profile</h3>
    <form className="space-y-4 max-w-lg mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" defaultValue="Dr. Eleanor Vance" className="w-full border border-gray-300 rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <select className="w-full border border-gray-300 rounded-lg p-2 mt-1">
            <option>Large Animal Surgery</option>
            <option>Livestock Disease Management</option>
          </select>
        </div>
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio / Qualifications</label>
          <textarea rows="3" defaultValue="Board-certified large animal surgeon with 15 years of experience focusing on dairy and beef cattle in the Midwest region." className="w-full border border-gray-300 rounded-lg p-2 mt-1"></textarea>
        </div>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
        Save Profile Changes
      </button>
    </form>
  </div>
);

const ClientsContent = () => {
  const clients = [
    { id: 101, name: "Sunset Dairy Farm", type: "Farmer", status: "Active", lastContact: "2 days ago" },
    { id: 102, name: "Sarah Jenkins", type: "Paraprofessional", status: "Active", lastContact: "Today" },
    { id: 103, name: "Green Acres Ranch", type: "Farmer", status: "Inactive", lastContact: "1 month ago" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Your Managed Clients</h3>
      
      <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Farm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.lastContact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   </div>
  );
};

const AppointmentsContent = () => {
  const appointments = [
    { id: 1, date: "2024-11-06 10:00 AM", client: "Sunset Dairy Farm", type: "Virtual", status: "Confirmed" },
    { id: 2, date: "2024-11-07 02:00 PM", client: "Green Acres Ranch", type: "On-Site", status: "Confirmed" },
    { id: 3, date: "2024-11-05 08:30 AM", client: "Farmer John Doe", type: "Virtual", status: "Completed" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Upcoming Appointments Schedule</h3>
      <div className="space-y-3 mt-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="mb-2 sm:mb-0">
              <p className="font-medium text-gray-900">{appt.date} - <span className="text-blue-600">{appt.client}</span></p>
              <p className="text-sm text-gray-500">{appt.type} Consultation</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full self-start sm:self-center ${appt.status === 'Completed' ? 'bg-gray-200 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
              {appt.status}
            </span>
          </div>
        ))}
      </div>
  </div>
  );
};

// Helper card for dashboard stats
const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };
  return (
   <div className={`${colorClasses[color]} text-white p-5 rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-300`}>
      <p className="text-sm font-light uppercase opacity-80">{title}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
   </div>
  );
};


// --- MAIN VET PROFILE COMPONENT ---

export function VetProfile() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const tabs = [
    { id: "Dashboard", label: "Dashboard", content: <DashboardContent /> },
    { id: "Profile", label: "My Profile", content: <ProfileContent /> },
    { id: "Clients", label: "Clients", content: <ClientsContent /> },
    { id: "Appointments", label: "Appointments", content: <AppointmentsContent /> },
];

  const currentTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-200 gap-4">
          <div className="flex items-center space-x-3 self-start sm:self-center">
            <FaPawIcon /> {/* Updated icon call */}
            <h1 className="text-3xl font-extrabold text-gray-900">Veterinarian Portal</h1>
          </div>
          <button
            onClick={() => navigate('/')} // Mock logout
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200 shadow-md w-full sm:w-auto"
          >
            Logout
          </button>
        </header>

        {/* Tabs Navigation */}
        <nav className="mt-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
            {tabs.map(tab => (
              <li key={tab.id} className="flex-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-block w-full p-4 rounded-t-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 font-semibold'
                      : 'border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab Content Area */}
        <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-white shadow-lg min-h-[500px] md:min-h-[70vh]">
          {currentTabContent}
        </div>

      </div>
    </div>
  );
}

export default VetProfile;