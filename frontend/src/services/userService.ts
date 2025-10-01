import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updateProfile,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { ref, set, get, remove, update } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdBy?: string;
  createdAt: number;
}

// Check if a user exists by email
const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = Object.values(snapshot.val() as UserData[]);
      return users.some(user => user.email === email);
    }
    return false;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Create a new user (admin only)
export const createUser = async (email: string, password: string, name: string): Promise<UserData> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be logged in to create users');
  }

  const isAdminUser = await isAdmin(currentUser.uid);
  if (!isAdminUser) {
    throw new Error('Only administrators can create new users');
  }

  const userExists = await checkUserExists(email);
  if (userExists) {
    throw new Error('A user with this email already exists');
  }

  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user data in Realtime Database
    const userData: UserData = {
      id: user.uid,
      email: user.email!,
      name: name,
      role: 'user',
      createdBy: auth.currentUser?.uid,
      createdAt: Date.now()
    };

    // Save user data
    await set(ref(db, `users/${user.uid}`), userData);
    
    // Update user profile
    await updateProfile(user, { displayName: name });

    return userData;
  } catch (error: any) {
    console.error('Error creating user:', error);
    const errorMessage = error.code === 'auth/email-already-in-use'
      ? 'An account with this email already exists.'
      : error.message || 'Failed to create user';
    throw new Error(errorMessage);
  }
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users) as UserData[];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId: string, updates: Partial<UserData>): Promise<void> => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, updates);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUserAccount = async (userId: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be logged in to delete users');
  }

  const isAdminUser = await isAdmin(currentUser.uid);
  if (!isAdminUser) {
    throw new Error('Only administrators can delete users');
  }

  try {
    // Delete from Realtime Database
    await remove(ref(db, `users/${userId}`));
    
    // If the user is currently logged in, delete their auth account
    if (currentUser.uid === userId) {
      await deleteUser(currentUser);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Error logging in:', error);
    const errorMessages = {
      'auth/user-not-found': 'No account exists with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.'
    };
    const errorMessage = error.code && error.code in errorMessages 
      ? errorMessages[error.code as keyof typeof errorMessages]
      : error.message || 'Failed to login';
    throw new Error(errorMessage);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

// Check if current user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val() as UserData;
      return userData.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};