import React from 'react';

function HospitalStaffApp() {
  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800">Hospital Staff Dashboard</h1>
        <p className="text-purple-600">Welcome to the Hospital Staff panel</p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Patient Records</h2>
            <p className="text-gray-600">Access and update patient information</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Schedule</h2>
            <p className="text-gray-600">View your work schedule and shifts</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-gray-600">Manage your assigned tasks</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HospitalStaffApp;