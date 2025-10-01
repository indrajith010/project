import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { ref, set, get } from 'firebase/database';
import { LogoutService } from '../services/logoutService';
import { 
  checkUserInDatabase, 
  setCurrentUserAsAdmin, 
  getAllUsers, 
  repairDatabasePermissions,
  getDatabaseRulesInfo
} from '../utils/adminDebugUtils';

// This is a special page for debugging auth issues
const AuthDebugPage = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test Admin User');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any>(null);
  const [dbRules, setDbRules] = useState<any>(null);

  const createTestUser = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Create a test user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add the user to the database
      await set(ref(db, `users/${user.uid}`), {
        id: user.uid,
        email: email,
        name: name || 'Test User',
        role: 'admin',
        createdAt: Date.now()
      });
      
      setMessage(`Test user created successfully! UID: ${user.uid}`);
      checkAuthState();
    } catch (error: any) {
      setMessage(`Error creating test user: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithTestUser = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Try to login with the test user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      setMessage(`Logged in successfully! UID: ${user.uid}`);
      checkAuthState();
    } catch (error: any) {
      setMessage(`Login error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const checkAuthState = async () => {
    const user = auth.currentUser;
    
    if (user) {
      // Get additional user data from the database
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified
            },
            userData: userData
          });
        } else {
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified
            },
            userData: null,
            warning: "User exists in Firebase Auth but NOT in the database. This will cause admin permission issues."
          });
        }
      } catch (error: any) {
        setAuthState({
          user: {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified
          },
          error: error.message
        });
      }
    } else {
      setAuthState({ user: null });
    }
  };
  
  const signOutUser = async () => {
    try {
      await LogoutService.logout();
      setMessage('Signed out successfully');
      checkAuthState();
    } catch (error: any) {
      setMessage(`Sign out error: ${error.message}`);
    }
  };
  
  const forceAdminRole = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await setCurrentUserAsAdmin();
      setMessage('User has been set as admin in the database');
      checkAuthState();
    } catch (error: any) {
      setMessage(`Error setting admin role: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllUsers = async () => {
    setLoading(true);
    
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error: any) {
      setMessage(`Error fetching users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const repairDatabase = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await repairDatabasePermissions();
      setMessage('Database repair attempt completed');
    } catch (error: any) {
      setMessage(`Database repair error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const showDatabaseRules = () => {
    setDbRules(getDatabaseRulesInfo());
  };
  
  // Check auth state when component loads
  React.useEffect(() => {
    checkAuthState();
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuthState();
      } else {
        setAuthState({ user: null });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Warning</h2>
        <p className="text-yellow-700">
          This page is for debugging authentication issues only. Do not use in production.
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Current Auth State</h2>
        {authState ? (
          <div>
            {authState.warning && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                <p className="text-yellow-800 font-medium">{authState.warning}</p>
              </div>
            )}
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Loading auth state...</p>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Test User Credentials</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="text" // Text so we can see it for debugging
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Auth Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={createTestUser}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Create Test User'}
            </button>
            
            <button
              onClick={loginWithTestUser}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Login with Test User'}
            </button>
            
            <button
              onClick={checkAuthState}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Check Auth State'}
            </button>
            
            <button
              onClick={signOutUser}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Sign Out'}
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Admin Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={forceAdminRole}
              disabled={loading || !authState?.user}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Force Admin Role'}
            </button>
            
            <button
              onClick={fetchAllUsers}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'View All Users'}
            </button>
            
            <button
              onClick={repairDatabase}
              disabled={loading}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Repair Database'}
            </button>
            
            <button
              onClick={showDatabaseRules}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400"
            >
              {loading ? 'Working...' : 'Database Rules Info'}
            </button>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}
      
      {allUsers && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">All Users in Database</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
            {JSON.stringify(allUsers, null, 2)}
          </pre>
        </div>
      )}
      
      {dbRules && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Database Rules</h2>
          <div className="mb-4">
            <p className="text-gray-700">{dbRules.message}</p>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
            {JSON.stringify(dbRules.recommendedRules, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Troubleshooting Guide</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Create a test user with admin role using the form above</li>
          <li>Try to login with the created user</li>
          <li>Check if the user exists in both Auth and Database</li>
          <li>If logged in but getting "Access Denied", check if your user has <code className="bg-gray-100 px-1 rounded">role: "admin"</code> in the database</li>
          <li>Use "Force Admin Role" button to update current user to admin role</li>
          <li>Verify database rules are correctly set (view recommended settings above)</li>
        </ol>
      </div>
      
      <div className="space-y-2">
        <a href="/debug-user" className="text-blue-500 hover:underline">Go to User Debug Page</a>
        <br />
        <a href="/login" className="text-blue-500 hover:underline">Go to Login Page</a>
        <br />
        <a href="/setup-admin" className="text-blue-500 hover:underline">Go to Admin Setup Page</a>
      </div>
    </div>
  );
};

export default AuthDebugPage;