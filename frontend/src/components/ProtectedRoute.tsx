import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("ProtectedRoute auth state changed:", currentUser ? currentUser.uid : "No user");
        setUser(currentUser);
        
        if (currentUser && requireAdmin) {
          console.log("Checking admin status for", currentUser.uid, "requireAdmin:", requireAdmin);
          try {
            // Check if user has admin role from the users node in the database
            const userRef = ref(db, `users/${currentUser.uid}`);
            const snapshot = await get(userRef);
            
            console.log("User data exists:", snapshot.exists());
            
            if (snapshot.exists()) {
              const userData = snapshot.val();
              console.log("User data from DB in ProtectedRoute:", userData);
              console.log("User role in ProtectedRoute:", userData?.role);
              const isAdminUser = userData?.role === 'admin';
              console.log("Is admin user:", isAdminUser);
              setIsAdmin(isAdminUser);
              
              // Save debug information
              setDebugInfo({
                userExists: !!currentUser,
                userUid: currentUser.uid,
                userEmail: currentUser.email,
                requireAdmin,
                userDataInDb: snapshot.exists(),
                userData,
                userRole: userData?.role,
                isAdmin: isAdminUser
              });
            } else {
              console.log("No user data found in database");
              setIsAdmin(false);
              
              // Save debug information with error
              setDebugInfo({
                userExists: !!currentUser,
                userUid: currentUser.uid,
                userEmail: currentUser.email,
                requireAdmin,
                userDataInDb: snapshot.exists(),
                error: "User exists in auth but not in database"
              });
            }
          } catch (error: any) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
            
            // Add error to debug information
            setDebugInfo({
              error: `Error checking admin status: ${error.message}`,
              errorCode: error.code
            });
          }
        }
        
        setLoading(false);
      });
      
      return () => unsubscribe();
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
  if (requireAdmin && !isAdmin) {
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
              <li>Ensure your user account has <code className="bg-gray-100 px-1 rounded">role: "admin"</code> in the Firebase database</li>
              <li>Visit <a href="/auth-debug" className="underline">Auth Debug Page</a> to diagnose and fix this issue</li>
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
            <a 
              href="/auth-debug" 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Debug Auth
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;