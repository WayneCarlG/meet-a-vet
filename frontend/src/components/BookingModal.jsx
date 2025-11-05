import React, { useState } from 'react';

// animals: array of { id, name }
const BookingModal = ({ isOpen, onClose, onSubmit, animals = [], isLoading = false }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    // ensure selected animal/time/date are included
    const payload = {
      ...data,
      animalId: selectedAnimal || data.animal,
      appointmentDate: selectedDate || data.appointmentDate,
      appointmentTime: selectedTime || data.appointmentTime,
    };
    onSubmit(payload);
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 17; i++) {
      slots.push(`${i}:00`);
      slots.push(`${i}:30`);
    }
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Book Appointment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="animal" className="block text-sm font-medium text-gray-700">
              Select Animal
            </label>
            <select
              id="animal"
              name="animal"
              required
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Choose animal</option>
              {animals.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
              Appointment Date
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
              Preferred Time
            </label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select time</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Visit
            </label>
            <select
              id="reason"
              name="reason"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select reason</option>
              <option value="checkup">Regular Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="emergency">Emergency</option>
              <option value="consultation">Consultation</option>
              <option value="followup">Follow-up Visit</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;