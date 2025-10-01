import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      console.log("ProtectedRoute checking authentication...");
      
      try {
        // Check for auth token and user data in localStorage
        const authToken = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');
        
        console.log("Auth token exists:", !!authToken);
        console.log("User data exists:", !!userDataStr);
        
        if (authToken && userDataStr) {
          const userData = JSON.parse(userDataStr) as User;
          console.log("User data from localStorage:", userData);
          console.log("User role:", userData.role);
          console.log("User is active:", userData.is_active);
          
          if (userData.is_active) {
            setUser(userData);
            
            // Save debug information
            setDebugInfo({
              hasToken: !!authToken,
              userData: userData,
              userRole: userData.role,
              isActive: userData.is_active,
              requireAdmin,
              isAdmin: userData.role === 'admin',
              accessGranted: !requireAdmin || userData.role === 'admin'
            });
          } else {
            console.log("User account is inactive");
            // Clear invalid session
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            
            setDebugInfo({
              hasToken: !!authToken,
              error: "User account is inactive",
              userData: userData
            });
          }
        } else {
          console.log("No valid authentication found");
          setUser(null);
          
          setDebugInfo({
            hasToken: !!authToken,
            hasUserData: !!userDataStr,
            error: "No authentication token or user data found"
          });
        }
      } catch (error: any) {
        console.error("Error checking authentication:", error);
        // Clear potentially corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        
        setDebugInfo({
          error: `Error parsing authentication data: ${error.message}`
        });
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin access required but user is not admin
  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-700 mb-2">Access Denied</h2>
            <p className="text-gray-700 mb-4">You don't have administrator privileges to access this page.</p>
          </div>
          
          <div className="mb-6 bg-white p-4 rounded-lg border border-red-100">
            <h3 className="text-md font-medium text-red-800 mb-2">Troubleshooting Information:</h3>
            <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
              <li>User is logged in but doesn't have admin privileges</li>
              <li>Current role: <code className="bg-gray-100 px-1 rounded">{user.role}</code></li>
              <li>Required role: <code className="bg-gray-100 px-1 rounded">admin</code></li>
              <li>Contact an administrator to update your permissions</li>
            </ul>
          </div>
          
          {debugInfo && (
            <div className="mb-6 text-left">
              <details>
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Show technical details
                </summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;