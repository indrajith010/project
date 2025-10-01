import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { ref, get, set } from 'firebase/database';

// This is a debug component that will help diagnose issues with user role and admin access
const DebugUserPage = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (!currentUser) {
        setMessage('No user is logged in. Please log in first.');
        setLoading(false);
        return;
      }

      try {
        // Get user data from Firebase
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setMessage(`User found with role: ${data.role}`);
        } else {
          setMessage('User exists in Auth but not in the Database. Creating entry...');
          
          // Create user entry in the database
          const newUserData = {
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "User",
            role: "admin", // Setting as admin for debugging
            createdAt: Date.now()
          };
          
          await set(userRef, newUserData);
          setUserData(newUserData);
          setMessage('User created in database with admin role!');
        }
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Debug error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userRef = ref(db, `users/${user.uid}`);
      
      // Force create/update admin user with guaranteed admin role
      const adminData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || "Admin User",
        role: "admin",
        createdAt: userData?.createdAt || Date.now()
      };
      
      await set(userRef, adminData);
      setMessage('User set as admin! Please reload the page.');
      
      // Force refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      // Reload user data
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    } catch (error) {
      setMessage(`Error setting admin: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Debug Page</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Status</h2>
        <p className="mb-2">{message}</p>
        
        {loading ? (
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Auth User</h3>
              {user ? (
                <div className="bg-gray-50 p-3 rounded mt-1 text-sm">
                  <p><span className="font-semibold">UID:</span> {user.uid}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Display Name:</span> {user.displayName || 'Not set'}</p>
                </div>
              ) : (
                <div>
                  <p className="text-red-500 mb-3">Not logged in</p>
                  <p className="text-sm text-gray-700 mb-3">You need to log in first. Please go to the login page and sign in.</p>
                  <a 
                    href="/login" 
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md inline-block"
                  >
                    Go to Login Page
                  </a>
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="font-medium text-yellow-800 mb-2">First time setup?</h4>
                    <p className="text-sm text-yellow-700 mb-2">If this is your first time setting up the app, you need to create an admin user first.</p>
                    <a 
                      href="/setup-admin" 
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md inline-block"
                    >
                      Go to Admin Setup
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {user && (
              <div>
                <h3 className="font-medium">Database User Data</h3>
                {userData ? (
                  <div className="bg-gray-50 p-3 rounded mt-1 text-sm">
                    <p><span className="font-semibold">ID:</span> {userData.id}</p>
                    <p><span className="font-semibold">Email:</span> {userData.email}</p>
                    <p><span className="font-semibold">Name:</span> {userData.name}</p>
                    <p><span className="font-semibold">Role:</span> <span className={userData.role === 'admin' ? 'text-green-600 font-bold' : 'text-gray-600'}>{userData.role}</span></p>
                    <p><span className="font-semibold">Created:</span> {new Date(userData.createdAt).toLocaleString()}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-500 mb-3">No user data in database</p>
                    <button
                      onClick={makeAdmin}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-bold"
                    >
                      Create Admin User
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {user && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {userData && (
                    <button
                      onClick={makeAdmin}
                      disabled={loading}
                      className={`px-4 py-2 rounded-md ${
                        loading
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {userData?.role === 'admin' ? 'Force Admin Again' : 'Make Admin'}
                    </button>
                  )}
                  
                  <a 
                    href="/users" 
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    Try Users Page
                  </a>
                  
                  <a 
                    href="/"
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                  >
                    Home
                  </a>
                </div>
                
                <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                  <h3 className="text-red-800 font-semibold mb-2">Emergency Admin Reset</h3>
                  <p className="text-sm text-red-700 mb-3">Use this only if other methods fail:</p>
                  <button
                    onClick={async () => {
                      if (!user) return;
                      try {
                        setLoading(true);
                        setMessage('Performing emergency admin reset...');
                        
                        // Directly write to the database with no validation
                        const adminData = {
                          id: user.uid,
                          email: user.email,
                          name: user.displayName || 'Admin User',
                          role: 'admin',
                          createdAt: Date.now()
                        };
                        
                        await set(ref(db, `users/${user.uid}`), adminData);
                        setMessage('Emergency admin reset successful! Reloading in 2 seconds...');
                        
                        setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      } catch (error) {
                        setMessage(`Emergency reset failed: ${error instanceof Error ? error.message : String(error)}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Emergency Admin Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-semibold text-blue-800 mb-2">Instructions</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
          <li>This page helps diagnose issues with admin access.</li>
          <li>If your user exists but doesn't have admin role, click "Make Admin".</li>
          <li>After making changes, you might need to reload the page or log out and back in.</li>
          <li>Click "Try Users Page" to test if you can access the admin page now.</li>
        </ul>
      </div>
      
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="font-semibold text-yellow-800 mb-2">Database Path Validator</h2>
        <div className="space-y-2">
          <button 
            onClick={async () => {
              try {
                setLoading(true);
                setMessage('Checking database paths...');
                
                // Check users node
                const usersRef = ref(db, 'users');
                const usersSnapshot = await get(usersRef);
                const userExists = usersSnapshot.exists();
                
                // Check if current user is in the database
                let currentUserExists = false;
                if (user) {
                  const userRef = ref(db, `users/${user.uid}`);
                  const userSnapshot = await get(userRef);
                  currentUserExists = userSnapshot.exists();
                }
                
                setMessage(`Database check: Users node exists: ${userExists}, Current user exists: ${currentUserExists}`);
              } catch (error) {
                setMessage(`Database check error: ${error instanceof Error ? error.message : String(error)}`);
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            Validate Database Paths
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugUserPage;