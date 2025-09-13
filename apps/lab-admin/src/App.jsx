import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">App Dashboard</h1>
        <p className="text-gray-600">Welcome to the App panel</p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
            <p className="text-gray-600">Description of feature 1</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
            <p className="text-gray-600">Description of feature 2</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Feature 3</h2>
            <p className="text-gray-600">Description of feature 3</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;