// Add this to your main App.tsx or index.tsx to clear Firebase cache on startup
// This can resolve persistent connection issues

// Clear Firebase cache function
export const clearFirebaseCache = async () => {
  try {
    // Clear IndexedDB data used by Firebase
    if ('indexedDB' in window) {
      const databases = await indexedDB.databases();
      const firebaseDatabases = databases.filter(db => 
        db.name && db.name.includes('firebase')
      );
      
      for (const db of firebaseDatabases) {
        if (db.name) {
          const deleteReq = indexedDB.deleteDatabase(db.name);
          await new Promise((resolve, reject) => {
            deleteReq.onsuccess = () => resolve(null);
            deleteReq.onerror = () => reject(deleteReq.error);
          });
        }
      }
    }
    
    // Clear localStorage Firebase data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('firebase:')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Firebase cache cleared successfully');
  } catch (error) {
    console.warn('Failed to clear Firebase cache:', error);
  }
};

// Call this function when you have persistent connection issues:
// clearFirebaseCache().then(() => window.location.reload());