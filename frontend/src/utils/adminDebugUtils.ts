import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

/**
 * Utility functions for emergency admin setup and user management
 * IMPORTANT: These functions are for debugging purposes only
 */

/**
 * Check if the current user exists in the database
 */
export const checkUserInDatabase = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user is currently logged in');
    return null;
  }

  try {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('User exists in Auth but not in Database');
      return null;
    }
  } catch (error) {
    console.error('Error checking user in database:', error);
    return null;
  }
};

/**
 * Force set current user as admin
 */
export const setCurrentUserAsAdmin = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently logged in');
  }

  try {
    // First check if user exists in database
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      // Update existing user
      const userData = snapshot.val();
      await set(userRef, {
        ...userData,
        role: 'admin',
        updatedAt: Date.now()
      });
      console.log('User updated to admin role');
    } else {
      // Create new user entry
      await set(userRef, {
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Admin User',
        role: 'admin',
        createdAt: Date.now()
      });
      console.log('User created with admin role');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
};

/**
 * Get all users from the database
 */
export const getAllUsers = async () => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error getting users:', error);
    return {};
  }
};

/**
 * Fix any database issues
 */
export const repairDatabasePermissions = async () => {
  try {
    // Check if the current user exists
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently logged in');
    }
    
    // Check if users node exists
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      // Create users node
      await set(ref(db, 'users'), {});
      console.log('Created users node in database');
    }
    
    return true;
  } catch (error) {
    console.error('Error repairing database:', error);
    throw error;
  }
};

/**
 * Add test user with admin role
 */
export const addTestAdmin = async (email: string, name: string, uid: string) => {
  try {
    await set(ref(db, `users/${uid}`), {
      id: uid,
      email,
      name,
      role: 'admin',
      createdAt: Date.now()
    });
    
    console.log('Test admin user added to database');
    return true;
  } catch (error) {
    console.error('Error adding test admin:', error);
    throw error;
  }
};

/**
 * Get database rules (simulated - actual rules can only be seen in Firebase console)
 */
export const getDatabaseRulesInfo = () => {
  return {
    status: 'Simulated rules check',
    recommendedRules: {
      rules: {
        '.read': 'auth != null',
        '.write': 'auth != null',
        'users': {
          '.read': 'auth != null',
          '.write': true, // Allow initial write for first admin creation
          '$uid': {
            '.write': true,
            '.validate': "newData.hasChildren(['email', 'name', 'role'])",
            'role': {
              '.validate': "newData.val() === 'admin' || newData.val() === 'user'"
            }
          }
        }
      }
    },
    message: 'These are the recommended rules. Ensure your database.rules.json has similar permissions.'
  };
};

export default {
  checkUserInDatabase,
  setCurrentUserAsAdmin,
  getAllUsers,
  repairDatabasePermissions,
  addTestAdmin,
  getDatabaseRulesInfo
};