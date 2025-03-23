import React from 'react';

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <header className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payment</h1>
          <div className="flex gap-2 items-center">
            <img src="razorpay-logo.png" alt="Razorpay Trusted Business" className="h-6 w-6" />
            <p className="text-sm">Razorpay Trusted Business</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.25l-7.5-7.5 7.5-7.5" />
            </svg>
          </div>
        </header>

        {/* Payment Options */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Options</h2>
          <div className="space-y-4">
            {/* UPI Payment Option */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.25l-7.5-7.5 7.5-7.5" />
                </svg>
                <p className="ml-2 font-medium">UPI</p>
                <div className="flex ml-auto gap-2">
                  <img src="upi-logo.png" alt="UPI" className="h-6 w-6" />
                  <img src="google-pay-logo.png" alt="Google Pay" className="h-6 w-6" />
                  <img src="phonepe-logo.png" alt="PhonePe" className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Netbanking Payment Option */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.25l-7.5-7.5 7.5-7.5" />
                </svg>
                <p className="ml-2 font-medium">Netbanking</p>
              </div>
            </div>

            {/* Card Payment Option */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.25l-7.5-7.5 7.5-7.5" />
                </svg>
                <p className="ml-2 font-medium">Credit / Debit Card</p>
              </div>
            </div>

            {/* Wallet Payment Option */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.25l-7.5-7.5 7.5-7.5" />
                </svg>
                <p className="ml-2 font-medium">Wallet</p>
                <div className="flex ml-auto gap-2">
                  <img src="paytm-logo.png" alt="PayTM" className="h-6 w-6" />
                  <img src="mobikwik-logo.png" alt="Mobikwik" className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Summary</h2>
            <p className="text-2xl font-bold text-gray-900">₹6,000</p>
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg mt-4 hover:bg-blue-700 transition-all" onClick={() => console.log('Continue clicked')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
