import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';

const AddAppointmentModal = ({ isOpen, onClose, date, animals = [], onSubmit, isLoading }) => {
  const [animalId, setAnimalId] = useState(animals[0]?.id || animals[0]?._id || '');
  const [vetId, setVetId] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    setAnimalId(animals[0]?.id || animals[0]?._id || '');
  }, [animals, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build ISO datetime: combine date (Date obj or string) with time (HH:MM)
    const baseDate = date instanceof Date ? date : new Date(date);
    let appointmentDateISO;
    if (time) {
      const [hh, mm] = time.split(':').map(Number);
      const dt = new Date(baseDate);
      dt.setHours(hh, mm || 0, 0, 0);
      appointmentDateISO = dt.toISOString();
    } else {
      // if no time, send date-only at midnight UTC
      const dt = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()));
      appointmentDateISO = dt.toISOString();
    }

    const payload = {
      vet_id: vetId || null,
      animal_id: animalId || null,
      appointment_date: appointmentDateISO,
      reason: reason || '',
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Appointment</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input value={(date instanceof Date) ? date.toDateString() : new Date(date).toDateString()} readOnly className="mt-1 block w-full rounded-md border-gray-300 p-2 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Animal</label>
            <select value={animalId} onChange={(e) => setAnimalId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2">
              {animals.length === 0 && <option value="">No animals available</option>}
              {animals.map(a => (
                <option key={a.id || a._id} value={a.id || a._id}>
                  {a.name || `ID: ${a.id || a._id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vet ID (optional)</label>
            <input value={vetId} onChange={(e) => setVetId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" placeholder="Vet id or leave blank" />
            <p className="text-xs text-gray-400 mt-1">Provide vet id if you already have one — backend can map to an existing vet.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status (optional)</label>
              <input className="mt-1 block w-full rounded-md border-gray-300 p-2 bg-gray-50" value="pending" readOnly />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason / Description</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white">
            {isLoading ? 'Saving...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddAppointmentModal;