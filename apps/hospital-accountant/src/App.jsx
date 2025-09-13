import React from 'react';

function HospitalAccountantApp() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-800">Hospital Accountant Dashboard</h1>
        <p className="text-yellow-600">Welcome to the Hospital Accountant panel</p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Financial Reports</h2>
            <p className="text-gray-600">View and generate financial reports</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Billing</h2>
            <p className="text-gray-600">Manage patient billing and invoices</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Payroll</h2>
            <p className="text-gray-600">Manage staff payroll and payments</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HospitalAccountantApp;