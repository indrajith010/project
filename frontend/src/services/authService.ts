import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { withRetry } from '../utils/firebaseUtils';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Authentication service class
export class AuthService {
  // Sign up with email and password - REMOVED
  static async signup(_signupData: SignupData): Promise<User> {
    throw new Error('Signup is disabled');
  }

  // Sign in with email and password - REMOVED
  static async login(_loginData: LoginData): Promise<User> {
    throw new Error('Login is disabled');
  }

  // Store user data in Firestore
  static async storeUserData(userData: User): Promise<void> {
    return withRetry(async () => {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, userData);
    }, 'storeUserData');
  }

  // Get user data from Firestore
  static async getUserData(uid: string): Promise<User | null> {
    return withRetry(async () => {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        return snapshot.data() as User;
      }
      return null;
    }, 'getUserData');
  }

  // Update user data in Firestore
  static async updateUserData(uid: string, updates: Partial<User>): Promise<void> {
    return withRetry(async () => {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
    }, 'updateUserData');
  }

  // Get current authenticated user - Stub implementation
  static getCurrentUser(): null {
    return null;
  }

  // Listen to authentication state changes - No-op implementation
  static onAuthStateChange(_callback: (user: null) => void): () => void {
    return () => {};
  }

  // Convert Firebase error codes to user-friendly messages - Simplified
  static getErrorMessage(_errorCode: string): string {
    return 'Authentication is disabled in this application';
  }

  // Get all users (for admin purposes - requires proper security rules)
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const users: User[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        users.push(doc.data() as User);
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Delete user data (call this when deleting a user account)
  static async deleteUserData(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }
}

export default AuthService;
