import React from 'react';

function HospitalAdminApp() {
  return (
    <div className="min-h-screen bg-green-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">Hospital Admin Dashboard</h1>
        <p className="text-green-600">Welcome to the Hospital Admin panel</p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Patient Management</h2>
            <p className="text-gray-600">Manage patient records and appointments</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Staff Management</h2>
            <p className="text-gray-600">Manage hospital staff and schedules</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Inventory</h2>
            <p className="text-gray-600">Manage medical supplies and equipment</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HospitalAdminApp;