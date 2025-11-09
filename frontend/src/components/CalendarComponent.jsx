import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import api from '../api';
import AddAppointmentModal from "./AddApointmentModal";

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const AppointmentCalendar = ({ appointments = [], profile = {}, setProfile, setSummary }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Build lookup by date string
  const appointmentsByDate = appointments.reduce((acc, appt) => {
    // appointment_date expected in ISO or string
    const dt = appt.appointment_date ? new Date(appt.appointment_date) : null;
    const key = dt ? dt.toDateString() : (appt._dateKey || '');
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = date.toDateString();
    const items = appointmentsByDate[key] || [];
    if (items.length === 0) return null;

    // show up to 2 dots, color by status priority (confirmed green, pending yellow, rejected red)
    const colors = items.slice(0, 3).map(it => {
      const st = (it.status || '').toLowerCase();
      if (st === 'approved' || st === 'confirmed') return 'bg-green-500';
      if (st === 'rejected') return 'bg-red-500';
      return 'bg-yellow-500';
    });

    return (
      <div className="flex justify-center mt-1 space-x-1">
        {colors.map((c, i) => <span key={i} className={`w-2 h-2 rounded-full ${c}`} />)}
      </div>
    );
  };

  const selectedDateAppointments = appointmentsByDate[selectedDate.toDateString()] || [];

  // called from modal submit
  const handleCreate = async (payload) => {
    setIsCreating(true);
    setError(null);
    try {
      // include user id from profile if backend expects it
      const body = {
        ...payload,
        user_id: profile?.id || profile?._id || profile?.user_id || null,
        // backend fields mapping: description -> description or reason expected server-side
      };

      const res = await api.post('/api/appointments', body);

      if (!res || res.status >= 400) {
        throw new Error(res?.data?.message || 'Failed to create appointment');
      }

      const created = res.data;
      // optimistic update: add to profile.appointments
      if (typeof setProfile === 'function') {
        setProfile(prev => ({
          ...prev,
          appointments: [ ...(prev?.appointments || []), created ],
        }));
      }

      if (typeof setSummary === 'function') {
        setSummary(prev => ({
          ...prev,
          scheduledAppointments: (prev?.scheduledAppointments || 0) + 1,
        }));
      }

      setModalOpen(false);
      alert('Appointment created successfully');
    } catch (err) {
      console.error('Create appt error', err);
      setError(err?.response?.data?.message || err.message || 'Create failed');
      alert(error || 'Failed to create appointment');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Appointment Calendar</h4>
        <div className="flex items-center space-x-2">
          <button onClick={() => { setModalOpen(true); }} className="px-3 py-1 rounded-md bg-green-600 text-white text-sm">New</button>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="flex-shrink-0">
          <Calendar onChange={setSelectedDate} value={selectedDate} tileContent={tileContent} />
        </div>

        <div className="flex-1">
          <h5 className="font-semibold text-gray-700">{selectedDate.toDateString()}</h5>
            <br />
          {selectedDateAppointments.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No appointments on this day.</p>
          ) : (
            <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {selectedDateAppointments.map((appt, i) => {
                const st = (appt.status || '').toLowerCase();
                const badgeClass = statusStyles[st] || 'bg-gray-100 text-gray-800';
                return (
                  <li key={appt.appointment_id || appt._id || i} className="p-3 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{appt.animalName || appt.animalName || appt.animal?.name || appt.animal_id || 'Animal'}</p>
                        <p className="text-xs text-gray-600">{appt.description || appt.reason || appt.reason_text || 'No description'}</p>
                        <p className="text-xs text-gray-500 mt-1">⏰ {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        {appt.vet_id || appt.vetName || appt.vet?.name ? (
                          <p className="text-xs text-gray-600 mt-1">👩‍⚕️ {appt.vetName || appt.vet?.name || appt.vet_id}</p>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <div className={`inline-block px-2 py-1 text-xs font-medium rounded ${badgeClass}`}>
                          {(appt.status || 'pending').toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(appt.created_at || appt.createdAt || appt.createdAt).toLocaleString ? new Date(appt.created_at || appt.createdAt || appt.createdAt).toLocaleString() : ''}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <AddAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        animals={profile?.animalRecords || []}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
};
export default AppointmentCalendar;