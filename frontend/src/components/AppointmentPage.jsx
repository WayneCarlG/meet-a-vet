import React, { useState } from 'react';
import VideoComponent from './VideoComponent'; // Import the component

// Your existing page component
export default function AppointmentPage() {
  const [callConfig, setCallConfig] = useState(null);
  const [inCall, setInCall] = useState(false);

  // You would fetch this from your Flask server
  const fetchTokenAndJoin = async () => {
    // const response = await fetch(...);
    // const data = await response.json();
    const mockData = {
      appId: 'YOUR_APP_ID',
      channel: 'appointment-123',
      token: 'YOUR_RTC_TOKEN',
      uid: 'vet-sarah',
    };
    setCallConfig(mockData);
    setInCall(true);
  };

  return (
    <div>
      <h1 className="text-2xl">Your Appointment</h1>
      
      {!inCall ? (
        <button onClick={fetchTokenAndJoin}>Join Call</button>
      ) : (
        <div>
          {/* The VideoComponent now handles all the video logic.
            Just pass it the config.
          */}
          <VideoComponent config={callConfig} />
          
          <button onClick={() => setInCall(false)}>
            Leave Call
          </button>
        </div>
      )}

      {/* Your other page content */}
    </div>
  );
}