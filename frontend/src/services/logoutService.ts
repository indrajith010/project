import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

/**
 * Utility class for handling logout functionality
 */
export class LogoutService {
  /**
   * Sign out the current user
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Error during logout:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  }

  /**
   * Sign out and redirect to login page
   * @param navigate - React Router navigate function
   */
  static async logoutAndRedirect(navigate: (path: string) => void): Promise<void> {
    try {
      await this.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout and redirect:', error);
      // Still redirect even if logout fails
      navigate('/login');
    }
  }

  /**
   * Sign out with confirmation dialog
   * @param navigate - React Router navigate function
   */
  static async logoutWithConfirmation(navigate: (path: string) => void): Promise<void> {
    const confirmed = window.confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      await this.logoutAndRedirect(navigate);
    }
  }

  /**
   * Clear local session data (if any)
   */
  static clearLocalData(): void {
    try {
      // Clear any cached user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Clear any cached data from sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userData');
      
      console.log('Local session data cleared');
    } catch (error) {
      console.error('Error clearing local data:', error);
    }
  }

  /**
   * Complete logout with local data cleanup
   * @param navigate - React Router navigate function
   */
  static async completeLogout(navigate: (path: string) => void): Promise<void> {
    try {
      // Sign out from Firebase
      await this.logout();
      
      // Clear local data
      this.clearLocalData();
      
      // Redirect to login
      navigate('/login');
      
      console.log('Complete logout successful');
    } catch (error) {
      console.error('Error during complete logout:', error);
      
      // Even if logout fails, clear local data and redirect
      this.clearLocalData();
      navigate('/login');
    }
  }
}

export default LogoutService;