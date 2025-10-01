import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutService } from '../services/logoutService';
import { LogoutButton } from '../components/LogoutButton';
import { logoutUser } from '../services/userService';

/**
 * Demo page showing different logout implementations
 * This page is for testing and demonstration purposes
 */
export default function LogoutDemoPage() {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleBasicLogout = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await LogoutService.logout();
      setMessage('Basic logout successful - still on page');
    } catch (error: any) {
      setMessage(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutWithRedirect = async () => {
    setLoading(true);
    setMessage('Logging out and redirecting...');
    
    try {
      await LogoutService.logoutAndRedirect(navigate);
    } catch (error: any) {
      setMessage(`Logout failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleCompleteLogout = async () => {
    setLoading(true);
    setMessage('Performing complete logout...');
    
    try {
      await LogoutService.completeLogout(navigate);
    } catch (error: any) {
      setMessage(`Logout failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleUserServiceLogout = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await logoutUser();
      setMessage('UserService logout successful');
    } catch (error: any) {
      setMessage(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLocalData = () => {
    LogoutService.clearLocalData();
    setMessage('Local data cleared');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logout Functionality Demo</h1>
        <p className="text-gray-600">Test different logout methods and components</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('failed') || message.includes('error') 
            ? 'bg-red-50 text-red-800' 
            : 'bg-green-50 text-green-800'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LogoutButton Components */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">LogoutButton Components</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Basic logout button:</p>
              <LogoutButton />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">With confirmation:</p>
              <LogoutButton showConfirmation={true} />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Primary variant:</p>
              <LogoutButton variant="primary" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Custom text:</p>
              <LogoutButton>Log Me Out</LogoutButton>
            </div>
          </div>
        </div>

        {/* LogoutService Methods */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">LogoutService Methods</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Basic logout (no redirect):</p>
              <button
                onClick={handleBasicLogout}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Working...' : 'Basic Logout'}
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Logout with redirect:</p>
              <button
                onClick={handleLogoutWithRedirect}
                disabled={loading}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
              >
                {loading ? 'Working...' : 'Logout + Redirect'}
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Complete logout (recommended):</p>
              <button
                onClick={handleCompleteLogout}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? 'Working...' : 'Complete Logout'}
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">UserService logout:</p>
              <button
                onClick={handleUserServiceLogout}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
              >
                {loading ? 'Working...' : 'UserService Logout'}
              </button>
            </div>
          </div>
        </div>

        {/* Utility Functions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Utility Functions</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Clear local storage data:</p>
              <button
                onClick={clearLocalData}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Local Data
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Logout with confirmation dialog:</p>
              <button
                onClick={() => LogoutService.logoutWithConfirmation(navigate)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout with Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Basic Logout:</strong> Signs out from Firebase Auth only</p>
            <p><strong>Logout + Redirect:</strong> Signs out and redirects to login</p>
            <p><strong>Complete Logout:</strong> Signs out, clears data, and redirects</p>
            <p><strong>With Confirmation:</strong> Shows confirmation dialog first</p>
            <p><strong>Clear Local Data:</strong> Only clears localStorage/sessionStorage</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Note</h3>
        <p className="text-yellow-700">
          This demo page is for testing logout functionality. In production, you'll typically use 
          the <code>LogoutButton</code> component or <code>LogoutService.completeLogout()</code> method.
        </p>
      </div>
    </div>
  );
}