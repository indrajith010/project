    import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Utility functions to handle Firestore connection issues
export class FirebaseConnectionManager {
  private static isOnline = true;
  private static retryCount = 0;
  private static maxRetries = 3;

  // Force enable network connection
  static async forceOnline(): Promise<boolean> {
    try {
      await enableNetwork(db);
      this.isOnline = true;
      this.retryCount = 0;
      console.log('Firestore: Successfully enabled network connection');
      return true;
    } catch (error) {
      console.error('Firestore: Failed to enable network:', error);
      return false;
    }
  }

  // Disable network (for testing offline behavior)
  static async goOffline(): Promise<boolean> {
    try {
      await disableNetwork(db);
      this.isOnline = false;
      console.log('Firestore: Successfully disabled network connection');
      return true;
    } catch (error) {
      console.error('Firestore: Failed to disable network:', error);
      return false;
    }
  }

  // Retry connection with exponential backoff
  static async retryConnection(): Promise<boolean> {
    if (this.retryCount >= this.maxRetries) {
      console.error('Firestore: Max retry attempts reached');
      return false;
    }

    this.retryCount++;
    const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff

    console.log(`Firestore: Retrying connection (attempt ${this.retryCount}/${this.maxRetries}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return await this.forceOnline();
  }

  // Check connection status
  static getConnectionStatus(): { isOnline: boolean; retryCount: number } {
    return {
      isOnline: this.isOnline,
      retryCount: this.retryCount
    };
  }

  // Reset retry counter
  static resetRetryCount(): void {
    this.retryCount = 0;
  }
}

// Error handler for Firestore operations
export const handleFirestoreError = async (error: any, operation: string): Promise<void> => {
  console.error(`Firestore ${operation} error:`, error);

  // Check if it's a network/connection error
  if (error.code === 'unavailable' || error.code === 'deadline-exceeded' || error.message.includes('offline')) {
    console.log('Firestore: Detected connection issue, attempting to reconnect...');
    
    const reconnected = await FirebaseConnectionManager.retryConnection();
    
    if (reconnected) {
      console.log('Firestore: Reconnection successful');
    } else {
      console.error('Firestore: Failed to reconnect after multiple attempts');
    }
  }
};

// Wrapper for Firestore operations with automatic retry
export const withRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      if (attempt > 1) {
        console.log(`Firestore: ${operationName} succeeded on attempt ${attempt}`);
      }
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`Firestore: ${operationName} failed on attempt ${attempt}:`, error);
      
      // If it's a connection error and we have retries left, try to reconnect
      if (attempt < maxRetries && (error.code === 'unavailable' || error.code === 'deadline-exceeded')) {
        console.log(`Firestore: Retrying ${operationName} in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        await FirebaseConnectionManager.forceOnline();
      }
    }
  }
  
  throw lastError;
};