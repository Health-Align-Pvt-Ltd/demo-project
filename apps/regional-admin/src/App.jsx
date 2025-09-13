import React from 'react';

function RegionalAdminApp() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Regional Admin Dashboard</h1>
        <p className="text-blue-600">Welcome to the Regional Admin panel</p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">Regional statistics and metrics</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Hospitals</h2>
            <p className="text-gray-600">Manage hospitals in your region</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <p className="text-gray-600">Generate regional reports</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegionalAdminApp;