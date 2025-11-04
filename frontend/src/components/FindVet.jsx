import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icons ---

const CheckBadgeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5 text-blue-500"
  >
    <path 
      fillRule="evenodd" 
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm3.397 3.001a.75.75 0 00-1.06-1.06l-4.25 4.25a.75.75 0 000 1.06l1.5 1.5a.75.75 0 101.06-1.06L10.8 9.06l3.197-3.197z" 
      clipRule="evenodd" 
    />
  </svg>
);

const MapPinIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-5 h-5"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
    />
  </svg>
);

const IdentificationIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-5 h-5"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zM12 15.75c0 .598-.237 1.17-.659 1.591a.696.696 0 01-.412.159h-3.858a.696.696 0 01-.412-.159A2.24 2.24 0 016 15.75v-1.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5z" 
    />
  </svg>
);

// --- New Nav Icons ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.4c.566 0 .81.758.37 1.108l-4.4 3.192a.563.563 0 00-.182.635l1.658 5.36a.562.562 0 01-.812.621l-4.4-3.192a.563.563 0 00-.656 0l-4.4 3.192a.562.562 0 01-.812-.621l1.658-5.36a.563.563 0 00-.182-.635l-4.4-3.192a.563.563 0 01.37-1.108h5.4a.563.563 0 00.475-.31l2.125-5.111z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// --- NAV COMPONENTS ---

const navLinks = [
  { name: 'Home', href: '#', icon: HomeIcon, current: false },
  { name: 'Search Vets', href: '#', icon: SearchIcon, current: true }, // Set as current for demo
  { name: 'My Vets', href: '#', icon: UsersIcon, current: false },
  { name: 'Recommended', href: '#', icon: StarIcon, current: false },
];

const NavLink = ({ item }) => (
  <a
    key={item.name}
    href={item.href}
    className={`
      ${item.current
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
      }
      group flex items-center px-3 py-2 text-sm font-medium rounded-md
    `}
  >
    <item.icon
      className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
      aria-hidden="true"
    />
    {item.name}
  </a>
);

const SideNav = () => (
  <div className="hidden md:flex md:flex-shrink-0">
    <div className="flex w-64 flex-col bg-indigo-800">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          {/* You can put a logo here */}
          <h1 className="text-2xl font-bold text-white">Meet-A-Vet</h1>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navLinks.map((item) => (
            <NavLink item={item} key={item.name} />
          ))}
        </nav>
      </div>
    </div>
  </div>
);

const MobileNav = ({ isOpen, setIsOpen }) => (
  <div
    className={`
      fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}
  >
    {/* Flyout Menu */}
    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-800 pt-5 pb-4">
      {/* Close Button */}
      <div className="absolute top-0 right-0 -mr-12 pt-2">
        <button
          type="button"
          className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setIsOpen(false)}
        >
          <span className="sr-only">Close sidebar</span>
          <CloseIcon className="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </div>
      
      <div className="flex flex-shrink-0 items-center px-4">
        <h1 className="text-2xl font-bold text-white">Meet-A-Vet</h1>
      </div>
      <div className="mt-5 h-0 flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navLinks.map((item) => (
            <NavLink item={item} key={item.name} />
          ))}
        </nav>
      </div>
    </div>
    
    {/* Overlay (to close menu on click) */}
    <div className="w-14 flex-shrink-0" aria-hidden="true" onClick={() => setIsOpen(false)}>
    </div>
  </div>
);

const Header = ({ setIsOpen }) => (
  <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow md:hidden">
    <button
      type="button"
      className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      onClick={() => setIsOpen(true)}
    >
      <span className="sr-only">Open sidebar</span>
      <MenuIcon className="h-6 w-6" aria-hidden="true" />
    </button>
    <div className="flex flex-1 justify-between px-4">
      <div className="flex flex-1 items-center">
        <h1 className="text-xl font-bold text-indigo-700">Find a Professional</h1>
      </div>
    </div>
  </div>
);


// --- PROFILE CARD COMPONENT ---

const API_URL = 'http://localhost:5000/api/vets';

const VetProfileCard = ({ vet }) => {
  if (!vet) return null;

  const {
    name,
    avatarUrl,
    role,
    isVerified,
    location,
    licenseNumber,
    specialties,
  } = vet;

  const isSurgeon = role === 'Veterinary Surgeon';

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-2xl">
      
      {/* Card Header: Avatar, Name, Role */}
      <div className="pt-8 pb-6 px-6 bg-gray-50 flex flex-col items-center">
        <img
          src={avatarUrl}
          alt={`${name}'s profile`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          onError={(e) => { e.target.src = 'https://placehold.co/100x100/EBF4FF/7F9CF5?text=Vet'; }}
        />
        <h3 className="text-2xl font-bold text-gray-900 text-center mt-4">{name}</h3>
        
        <div className="flex justify-center items-center mt-1 space-x-2">
          {/* STATIC COLOR FIX */}
          <span className="text-md font-medium text-indigo-600">{role}</span>
          {isVerified && (
            <span title="Verified Professional">
              <CheckBadgeIcon />
            </span>
          )}
        </div>
      </div>

      {/* Card Body: Details */}
      <div className="p-6 space-y-4">
        {/* Location */}
        <div className="flex items-center text-gray-700">
          <MapPinIcon />
          <span className="ml-3 text-sm">{location || 'Location not provided'}</span>
        </div>
        
        {/* License (Conditional) */}
        {isSurgeon && (
          <div className="flex items-center text-gray-700">
            <IdentificationIcon />
            <span className="ml-3 text-sm">License: {licenseNumber || 'N/A'}</span>
          </div>
        )}

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-500 uppercase mb-2">Specialties</h5>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <span
                  key={specialty}
                  // STATIC COLOR FIX
                  className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {/* FIX: Corrected typo from {specialD:specialty} to {specialty} */}
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
        <button 
          // STATIC COLOR FIX
          className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => alert(`Booking appointment with ${name}`)}
        >
          Book Appointment
        </button>
        <button 
          className="w-full py-2 px-4 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => alert(`Viewing full profile for ${name}`)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};


// --- Mock Data ---

const mockSurgeon = {
  name: "Dr. Evelyn Reed",
  avatarUrl: "https://i.pravatar.cc/150?img=32", // Placeholder image
  role: "Veterinary Surgeon",
  isVerified: true,
  location: "Nairobi, Kenya",
  licenseNumber: "VET-00123",
  specialties: ["Large Animals", "Equine", "Surgical Diagnostics"]
};

const mockParaprofessional = {
  name: "David Kimani",
  avatarUrl: "https://i.pravatar.cc/150?img=60", // Placeholder image
  role: "Veterinary Paraprofessional",
  isVerified: true,
  location: "Rongai, Nakuru County",
  licenseNumber: null,
  specialties: ["Cattle Vaccination", "Poultry Health", "AI Services"]
};


const FindProfessionalsContent = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchVets = async () => {
      try {
        const res = await axios.get(API_URL);
        if (mounted && Array.isArray(res.data)) {
          setVets(res.data);
        } else if (mounted) {
          // If API returns a single object or unexpected shape, wrap or fallback
          setVets(res.data ? [res.data] : [mockSurgeon, mockParaprofessional]);
        }
      } catch (err) {
        // On error, use mock data so UI remains functional during development
        if (mounted) setVets([mockSurgeon, mockParaprofessional]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVets();

    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center hidden md:block">
        Find a Professional
      </h1>

      {/* Container for profile cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {loading ? (
          <p className="text-gray-500">Loading professionals...</p>
        ) : vets.length === 0 ? (
          <p className="text-gray-500">No professionals found.</p>
        ) : (
          vets.map((vet) => (
            <VetProfileCard key={vet.licenseNumber || vet.name} vet={vet} />
          ))
        )}
        {/* <VetProfileCard vet={mockParaprofessional} /> */}
      </div>
    </div>
  );
};


/**
 * VetProfilePage (Main Layout Component)
 * This is the new main component that wraps the layout and content.
 */
const VetProfilePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <SideNav />
      
      {/* Mobile Flyout Menu */}
      <MobileNav isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile Header */}
        <Header setIsOpen={setMobileMenuOpen} />
        
        {/* Page Content */}
        <main className="flex-1">
          <FindProfessionalsContent />
        </main>
      </div>
    </div>
  );
};

export default VetProfilePage;