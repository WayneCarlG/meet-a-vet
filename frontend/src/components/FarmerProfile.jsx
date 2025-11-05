import React, { useEffect, useState } from "react";
import api from "../api";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import AddAnimalModal from './AddAnimalModal';
import BookingModal from './BookingModal';


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
          <p className="text-2xl font-bold text-gray-900">{(value || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <SpeciesPieChart distribution={data.speciesDistribution || []} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Animals" value={data.totalAnimals || 0} iconClass="bg-indigo-500" />
          <StatCard title="Total Species" value={data.totalSpecies || 0} iconClass="bg-green-500" />
          <StatCard title="Scheduled Appointments" value={data.scheduledAppointments || 0} iconClass="bg-yellow-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Animal Records</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data.animalRecords || []).map((animal) => (
              <tr key={animal.id || animal._id || Math.random()} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.id || animal._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.breed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.species}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.age} yrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionDropdown id={animal.id || animal._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- TAB CONTENT COMPONENTS ---
// Species pie chart using Recharts + Tailwind for layout
const SpeciesPieChart = ({ distribution = [] }) => {
  const data = (distribution || []).map((d) => ({ name: d.name, value: d.count || 0, fill: d.fill || '#8884d8' }));
  const total = data.reduce((s, it) => s + (it.value || 0), 0);

  if (!data.length || total === 0) {
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md h-full">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Species Distribution</h4>
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-500 mb-4">
          No species data
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md h-full">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Species Distribution</h4>
      <div className="flex items-center gap-6">
        <div className="w-1/2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                label={({ percent }) => `${Math.round(percent * 100)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2">
          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-sm mr-3" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-sm text-gray-500">{item.value} ({total ? Math.round((item.value / total) * 100) : 0}%)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionsContent = ({ profile, setProfile, setSummary }) => {
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isAddAnimalModalOpen, setIsAddAnimalModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddAnimal = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Debug: log token, baseURL and payload before request
      console.log('Client debug (add animal): token =', localStorage.getItem('token'));
      console.log('Client debug (add animal): api.defaults.baseURL =', api.defaults.baseURL);
      console.log('Client debug (add animal): payload =', data);

      // Use the api axios instance so baseURL and auth interceptor apply
      const res = await api.post('/api/add_animal', data);

      if (!res || res.status >= 400) {
        throw new Error(res?.data?.message || 'Failed to add animal');
      }

      const newAnimal = res.data;
      console.log('Animal added:', newAnimal);

      // Update profile local state if setter provided
      if (typeof setProfile === 'function') {
        setProfile((prev = {}) => ({
          ...prev,
          animalRecords: [ ...(prev.animalRecords || []), newAnimal ],
        }));
      }

      // Update summary counts
      if (typeof setSummary === 'function') {
        setSummary((prev = {}) => ({
          ...prev,
          totalAnimals: (prev.totalAnimals || 0) + 1,
          animalRecords: [ ...(prev.animalRecords || []), newAnimal ],
        }));
      }

      // close add-animal modal
      setIsAddAnimalModalOpen(false);

      // notify user
      alert('Animal added successfully');
    } catch (err) {
      console.error('Error adding animal', err);
      setError(err?.response?.data?.message || err.message || 'Failed to add animal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Debug: log token, baseURL and payload before request
      console.log('Client debug (book appointment): token =', localStorage.getItem('token'));
      console.log('Client debug (book appointment): api.defaults.baseURL =', api.defaults.baseURL);
      console.log('Client debug (book appointment): payload =', data);

      // post appointment to backend
      const res = await api.post('/api/appointments', data);

      if (!res || res.status >= 400) {
        throw new Error(res?.data?.message || 'Failed to book appointment');
      }

      const appointment = res.data;
      console.log('Appointment created:', appointment);

      // update summary counts
      if (typeof setSummary === 'function') {
        setSummary((prev = {}) => ({
          ...prev,
          scheduledAppointments: (prev.scheduledAppointments || 0) + 1,
        }));
      }

      // update profile appointments list
      if (typeof setProfile === 'function') {
        setProfile((prev = {}) => ({
          ...prev,
          appointments: [ ...(prev.appointments || []), appointment ],
        }));
      }

      setIsBookingModalOpen(false);
      alert('Appointment booked successfully');
    } catch (err) {
      console.error('Error booking appointment', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to book appointment';
      setError(msg);
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple card subcomponents that close over modal state
  const AddAnimalCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-indigo-500">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Add New Animal</h4>
      <p className="text-sm text-gray-500 mb-3">Register a new animal profile to the farm.</p>
      <button 
        onClick={() => setIsAddAnimalModalOpen(true)}
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
        onClick={() => setIsBookingModalOpen(true)}
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
    <>
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

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      <AddAnimalModal
        isOpen={isAddAnimalModalOpen}
        onClose={() => {
          setIsAddAnimalModalOpen(false)
          setError(null);
        }}
        onSubmit={handleAddAnimal}
        isLoading={isLoading}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookAppointment}
        animals={profile?.animalRecords || []}
        isLoading={isLoading}
      />
    </>
  );
};

const EditProfileModal = ({ isOpen, onClose, onSubmit, initialData = {}, isLoading }) => {
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [phone1, setPhone1] = useState(initialData.phone1 || '');
  const [phone2, setPhone2] = useState(initialData.phone2 || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || '');

  useEffect(() => {
    // keep form in sync when initialData changes
    setFirstName(initialData.firstName || '');
    setLastName(initialData.lastName || '');
    setEmail(initialData.email || '');
    setLocation(initialData.location || '');
    setPhone1(initialData.phone1 || '');
    setPhone2(initialData.phone2 || '');
    setAvatarUrl(initialData.avatarUrl || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { firstName, lastName, email, location, phone1, phone2, avatarUrl };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone 1</label>
            <input value={phone1} onChange={(e) => setPhone1(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone 2</label>
            <input value={phone2} onChange={(e) => setPhone2(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white">{isLoading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

const ProfileContent = ({ data, setProfile }) => { 
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (payload) => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      const res = await api.put('/api/profile', payload);
      if (res.status >= 400) throw new Error(res.data?.error || 'Failed to update');

      // optimistic local update: merge payload into profile
      setProfile((prev = {}) => ({ ...prev, ...payload }));
      setIsEditOpen(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error', err);
      setErrorMsg(err?.response?.data?.error || err.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Details</h2>
        <button onClick={() => setIsEditOpen(true)} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Edit Profile</button>
      </div>
      {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
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

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSubmit}
        initialData={data}
        isLoading={isSaving}
      />
    </div>
  );
}

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
  console.log('Fetching profile data...');
  console.log('Client debug: token in localStorage =', localStorage.getItem('token'));
  console.log('Client debug: api.defaults.baseURL =', api.defaults.baseURL);
  const res = await api.get('/api/profile');
  console.log('Profile response:', res.data);
        setProfile(res.data);

        // Fetch summary data from backend
  console.log('Fetching summary data...');
  console.log('Client debug: token in localStorage =', localStorage.getItem('token'));
  console.log('Client debug: api.defaults.baseURL =', api.defaults.baseURL);
  const summaryRes = await api.get('/api/summary');
  console.log('Summary response:', summaryRes.data);

        if (summaryRes.data) {
          setSummary(summaryRes.data);
        } else {
          // Construct summary from profile data
          const animalRecords = res.data.animalRecords || [];
          console.log('Constructing summary from animal records:', animalRecords);
          
          const animalsBySpecies = animalRecords.reduce((acc, animal) => {
            acc[animal.species] = (acc[animal.species] || 0) + 1;
            return acc;
          }, {});

          const summaryData = {
            totalAnimals: animalRecords.length,
            totalSpecies: Object.keys(animalsBySpecies).length,
            scheduledAppointments: res.data.appointments?.length || 0,
            speciesDistribution: Object.entries(animalsBySpecies).map(([name, count]) => ({
              name,
              count,
              fill: `#${Math.floor(Math.random()*16777215).toString(16)}`
            })),
            animalRecords: animalRecords
          };
          
          console.log('Constructed summary:', summaryData);
          setSummary(summaryData);
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
      return (
        <QuickActionsContent
          profile={profile}
          setProfile={setProfile}
          summary={summary}
          setSummary={setSummary}
        />
      );
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
