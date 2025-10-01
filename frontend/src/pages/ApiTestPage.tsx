import React, { useState } from 'react';

const ApiTestPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Not tested');
  const [usersResult, setUsersResult] = useState<string>('Not tested');

  const testApiHealth = async () => {
    try {
      setApiStatus('Testing...');
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setApiStatus(`✅ Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setApiStatus(`❌ Error: ${error}`);
    }
  };

  const testUsersApi = async () => {
    try {
      setUsersResult('Testing...');
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsersResult(`✅ Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setUsersResult(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={testApiHealth}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API Health
          </button>
          <p className="mt-2 text-sm break-all">{apiStatus}</p>
        </div>

        <div>
          <button 
            onClick={testUsersApi}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Users API
          </button>
          <p className="mt-2 text-sm break-all">{usersResult}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;