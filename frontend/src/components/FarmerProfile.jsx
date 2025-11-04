import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// const FarmerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState("");

// useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/profile");
//       setProfile(res.data);
//     } catch (err) {
//       console.error('API error fetching profile', err);
//       if (err.response) {
//         console.error('status', err.response.status);
//         console.error('data', err.response.data);
//         // show a friendly message to the user if server provides one
//         const serverMsg =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           JSON.stringify(err.response.data);
//         setError(`Server error (${err.response.status}): ${serverMsg}`);
//       } else {
//         setError('Unable to reach server. Please try again.');
//       }
//     }
//   };
//   fetchProfile();
// }, []);


//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500 text-lg">
//         {error}
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
//       <div className="flex flex-col md:flex-row items-center gap-6">
//         <img
//           src={profile.avatarUrl || "/default-avatar.png"}
//           alt="Profile Avatar"
//           className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
//         />
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             {profile.firstName} {profile.lastName}
//           </h2>
//           <p className="text-gray-600">{profile.email}</p>
//         </div>
//       </div>

//       <hr className="my-6 border-gray-300" />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
//         <div>
//           <h3 className="text-lg font-semibold text-teal-600 mb-2">Contact</h3>
//           <p>
//             <span className="font-medium">Phone 1:</span> {profile.phone1 || "N/A"}
//           </p>
//           <p>
//             <span className="font-medium">Phone 2:</span> {profile.phone2 || "N/A"}
//           </p>
//           <p>
//             <span className="font-medium">Location:</span> {profile.location || "N/A"}
//           </p>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-teal-600 mb-2">Account Info</h3>
//           <p>
//             <span className="font-medium">Created:</span>{" "}
//             {profile.created_at
//               ? new Date(profile.created_at).toLocaleDateString()
//               : "N/A"}
//           </p>
//           {profile.license_expiry && (
//             <p>
//               <span className="font-medium">License Expiry:</span>{" "}
//               {profile.license_expiry}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FarmerProfile;

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

const ActionDropdown = ({ id }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const actions = [
    { name: 'Edit', handler: () => alert(`Editing record #${id}`) },
    { name: 'Book', handler: () => alert(`Booking appointment for record #${id}`) },
    { name: 'Delete', handler: () => alert(`Deleting record #${id}`) },
  ];

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        Actions 
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map(action => (
              <button 
                key={action.name}
                type="button" 
                onClick={(e) => { e.preventDefault(); action.handler(); setIsOpen(false); }}
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB CONTENT COMPONENTS ---
const PieChartPlaceholder = ({ distribution }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md h-full">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">Species Distribution</h4>
    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 mb-4">
      [Placeholder Chart]
    </div>
    <div className="space-y-1 mt-4">
      {distribution.map((item) => (
        <div key={item.name} className="flex items-center text-sm">
          <div className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: item.fill}}></div>
          <span className="text-gray-700">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const SummaryContent = ({ data }) => {
  const StatCard = ({ title, value, iconClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${iconClass} mr-4`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 12H8V8h2v6zm3 0h-2V8h2v6z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <PieChartPlaceholder distribution={data.speciesDistribution || []} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            title="Total Animals" 
            value={data.totalAnimals || 0} 
            iconClass="bg-indigo-500"
          />
          <StatCard 
            title="Total Species" 
            value={data.totalSpecies || 0} 
            iconClass="bg-green-500"
          />
          <StatCard 
            title="Scheduled Appointments" 
            value={data.scheduledAppointments || 0} 
            iconClass="bg-yellow-500"
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Animal Records</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data.animalRecords || []).map((animal) => (
              <tr key={animal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.species}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.age} yrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionDropdown id={animal.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuickActionsContent = () => {
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  // const activeColor = 'indigo-700'; 

  const AddAnimalCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-indigo-500">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Add New Animal</h4>
      <p className="text-sm text-gray-500 mb-3">Register a new animal profile to the farm.</p>
      <button 
        onClick={() => alert('Launching Add Animal Form...')}
        className={`w-full py-2 px-4 rounded-md text-white bg-indigo-700 hover:bg-indigo-600 transition-colors text-sm`}
      >
        Launch Form
      </button>
    </div>
  );

  const RequestAppointmentCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-green-500">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Request Appointment</h4>
      <p className="text-sm text-gray-500 mb-3">Schedule a checkup or service with the vet.</p>
      <button 
        onClick={() => alert('Launching Appointment Request Tool...')}
        className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors text-sm"
      >
        Book Now
      </button>
    </div>
  );

  const CalendarCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-xl h-full border">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Schedule of Events</h4>
      <div className="p-4 bg-gray-50 rounded-md border text-center text-sm text-gray-500 h-64 flex flex-col justify-center">
        <p className="font-bold mb-1">📅 Calendar Component Placeholder</p>
        <p>This area displays scheduled appointments and tasks.</p>
      </div>
    </div>
  );

  const NotificationPopup = () => (
    <div className="bg-white p-4 rounded-lg shadow-xl h-full border relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
        <button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={`p-2 rounded-full text-white transition-colors ${isNotificationOpen ? `bg-indigo-700` : 'bg-gray-500 hover:bg-gray-600'}`}
          title="Toggle Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.111A9.957 9.957 0 0012 2c4.97 0 9 3.582 9 8z"></path></svg>
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isNotificationOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-600 border-b pb-2">Recent Messages/Alerts:</p>
          <p className="text-sm text-red-600 font-medium">⚠️ Critical: Daisy (Cattle) requires urgent review.</p>
          <p className="text-sm text-yellow-600">🔔 Reminder: Vet visit scheduled tomorrow at 9 AM.</p>
          <p className="text-sm text-gray-700">✅ Report for Buster (Dog) is available.</p>
          <button className={`mt-3 w-full text-center text-xs text-indigo-600 hover:text-indigo-800`}>
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <AddAnimalCard />
        <RequestAppointmentCard />
      </div>
      <div>
        <CalendarCard />
      </div>
      <div>
        <NotificationPopup />
      </div>
    </div>
  );
};

const ProfileContent = ({ data, activeColor }) => { 
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Username" id="username" defaultValue={data.username || ""} />
        <FormField label="First Name" id="firstName" defaultValue={data.firstName || ""} />
        <FormField label="Last Name" id="lastName" defaultValue={data.lastName || ""} />
      </div>
      <fieldset className="border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-medium text-gray-800 px-2">Contact Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <FormField label="Email Address" id="email" type="email" defaultValue={data.email || ""} />
            <FormField label="Location" id="location" defaultValue={data.location || ""} />
          </div>
          <div>
            <FormField label="Phone Number 1" id="phone1" defaultValue={data.phone1 || ""} />
            <FormField label="Phone Number 2 (Optional)" id="phone2" defaultValue={data.phone2 || ""} />
          </div>
        </div>
      </fieldset>
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
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Update Security
          </button>
        </div>
      </fieldset>
    </div>
  );
};

// --- MAIN COMPONENT ---
const FarmerProfile = () => {
  const activeColor = 'indigo-700'; 
  const [activeTab, setActiveTab] = React.useState('summary'); 
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  const tabs = [
    { name: 'Profile', key: 'profile' },
    { name: 'Summary', key: 'summary' },
    { name: 'Quick actions', key: 'actions' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("api/profile");
        setProfile(res.data);

        // Optionally fetch summary data if available from backend
        // If not, you can mock it or leave as null
        if (res.data.summary) {
          setSummary(res.data.summary);
        } else {
          setSummary({
            totalAnimals: res.data.totalAnimals || 0,
            totalSpecies: res.data.totalSpecies || 0,
            scheduledAppointments: res.data.scheduledAppointments || 0,
            speciesDistribution: res.data.speciesDistribution || [],
            animalRecords: res.data.animalRecords || [],
          });
        }
      } catch (err) {
        console.error('API error fetching profile', err);
        if (err.response) {
          const serverMsg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data);
          setError(`Server error (${err.response.status}): ${serverMsg}`);
        } else {
          setError('Unable to reach server. Please try again.');
        }
      }
    };
    fetchProfile();
  }, []);

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfileContent data={profile || {}} activeColor={activeColor} />;
    }
    if (activeTab === 'summary') {
      return <SummaryContent data={summary || {}} />;
    }
    if (activeTab === 'actions') {
      return <QuickActionsContent />;
    }
    return null;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className={`bg-indigo-700 w-full shadow-xl py-10 px-8 flex justify-between items-start rounded-b-lg`}>
        <div className="flex items-center">
          <img
            src={profile.avatarUrl || "/default-avatar.png"}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white mr-6"
          />
          <div className="text-white text-3xl font-bold">
            {profile.firstName} {profile.lastName}
          </div>
        </div>
        <button
          onClick={() => { navigate('/'); }}
          className="flex items-center text-white text-sm font-medium opacity-90 hover:opacity-100 transition-opacity p-2 rounded-md mt-1"
        >
          <LogoutIcon /> 
          <span className="ml-1">logout</span>
        </button>
      </div>
      <div className="w-full pt-0 sm:pt-4"> 
        <div className="bg-white shadow-md">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-grow py-3 px-0 text-sm font-medium transition-colors duration-200
                  focus:outline-none text-center
                  ${activeTab === tab.key
                    ? `text-indigo-700 border-b-2 border-indigo-700`
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="p-6 sm:px-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;

/*
  The following is a combined FarmerProfile component that merges your backend logic (fetching profile data) 
  with the UI/UX from the second code. It uses the fetched profile data for the header, tabs, and profile details.
*/


// --- UTILITY COMPONENTS ---
