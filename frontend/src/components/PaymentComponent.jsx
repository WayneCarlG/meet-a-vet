import React, { useState, useEffect, useRef } from 'react';

// This is the URL of your Flask server
const API_URL = 'http://127.0.0.1:5000'; // Or your deployed backend URL

export default function PaymentComponent({ appointment }) {
  // appointment prop should be an object like:
  // { id: 'appt-123', amount: 1, description: 'Consultation' }
  // We'll use '1' KES for testing.
  const testAmount = 1;

  const [phone, setPhone] = useState('254'); // Default with 254
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'prompted', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  
  // This will store the payment ID we get from our backend
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

  // A ref to store the polling interval
  const pollIntervalRef = useRef(null);

  // Cleanup effect to stop polling if the component unmounts
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // --- Main Polling Function ---
  const pollPaymentStatus = (checkout_id) => {
    // Clear any existing poll
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Start a new poll
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/payment-status/${checkout_id}`);
        
        if (!response.ok) {
          // Stop polling if the payment ID is not found (404)
          setStatus('failed');
          setErrorMessage('Payment session expired or not found.');
          clearInterval(pollIntervalRef.current);
          return;
        }

        const data = await response.json();

        if (data.status === 'completed') {
          setStatus('success');
          clearInterval(pollIntervalRef.current);
        } else if (data.status === 'failed') {
          setStatus('failed');
          setErrorMessage('Payment failed or was cancelled by the user.');
          clearInterval(pollIntervalRef.current);
        }
        // If status is still 'pending', the interval continues...
        
      } catch (error) {
        console.error("Polling error:", error);
        setErrorMessage('Error checking payment status.');
        // Don't stop polling on a network error, it might recover
      }
    }, 3000); // Poll every 3 seconds
  };

  // --- Form Submit Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 12 || !phone.startsWith('254')) {
      setErrorMessage('Please enter a valid M-Pesa number (e.g., 254712345678).');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      // 1. Call our Flask backend to start the payment
      const response = await fetch(`${API_URL}/api/initiate-stk-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          amount: testAmount, // Use the test amount
          appointment_id: appointment.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start payment.');
      }

      // 2. We got a good response!
      const checkout_id = data.checkout_request_id;
      setCheckoutRequestId(checkout_id);
      setStatus('prompted'); // 
      
      // 3. Start polling for the result
      pollPaymentStatus(checkout_id);

    } catch (error) {
      console.error(error);
      setStatus('failed');
      setErrorMessage(error.message);
    }
  };

  // Render different UI based on status
  if (status === 'success') {
    return (
      <div className="p-6 text-center bg-green-100 border border-green-300 rounded-lg">
        <h3 className="text-xl font-bold text-green-800">Payment Successful!</h3>
        <p className="mt-2 text-green-700">Your consultation is confirmed. Preparing your call...</p>
        {/* You would typically navigate the user away or show the video call now */}
      </div>
    );
  }

  return (
    <div className="max-w-md p-8 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center">Confirm Payment</h2>
      <p className="mt-2 text-center text-gray-600">
        Pay <span className="font-bold">KES {testAmount}</span> for {appointment.description}
      </p>

      {status === 'idle' || status === 'loading' ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              M-Pesa Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="254712345678"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {status === 'loading' ? 'Processing...' : `Pay KES ${testAmount}`}
          </button>
        </form>
      ) : null}

      {status === 'prompted' && (
        <div className="p-4 mt-6 text-center bg-blue-100 border border-blue-300 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Check Your Phone</h3>
          <p className="mt-2 text-blue-700">
            A payment prompt for KES {testAmount} has been sent to <span className="font-bold">{phone}</span>. Please enter your M-Pesa PIN to complete the payment.
          </p>
          <div className="w-12 h-12 mx-auto mt-4 border-4 border-t-4 rounded-full border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500">Waiting for confirmation...</p>
        </div>
      )}

      {(status === 'failed' || errorMessage) && (
        <div className="p-3 mt-4 text-red-800 bg-red-100 border border-red-300 rounded-md">
          <p>{errorMessage}</p>
          {status === 'failed' && (
             <button
              onClick={() => { setStatus('idle'); setErrorMessage(''); }}
              className="w-full px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}