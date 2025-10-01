# Logout Functionality Documentation

This document explains the comprehensive logout functionality that has been implemented in your application.

## Overview

The logout functionality consists of several components working together to provide a secure and user-friendly logout experience:

1. **LogoutService** - Core service handling logout operations
2. **LogoutButton** - Reusable component for logout buttons
3. **Updated userService** - Added logout function
4. **Integration** - Updated Navigation and other components

## Components

### 1. LogoutService (`src/services/logoutService.ts`)

A comprehensive service class that handles different types of logout operations:

#### Methods:

- **`logout()`** - Basic logout from Firebase Auth
- **`logoutAndRedirect(navigate)`** - Logout and redirect to login page
- **`logoutWithConfirmation(navigate)`** - Logout with confirmation dialog
- **`clearLocalData()`** - Clear any cached user data from localStorage/sessionStorage
- **`completeLogout(navigate)`** - Complete logout with data cleanup and redirect

#### Usage:
```typescript
import { LogoutService } from '../services/logoutService';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Basic logout
await LogoutService.logout();

// Logout with redirect
await LogoutService.logoutAndRedirect(navigate);

// Logout with confirmation
await LogoutService.logoutWithConfirmation(navigate);

// Complete logout (recommended)
await LogoutService.completeLogout(navigate);
```

### 2. LogoutButton Component (`src/components/LogoutButton.tsx`)

A reusable button component for logout functionality:

#### Props:
- `variant` - Button style ('primary', 'outline', 'secondary')
- `className` - Additional CSS classes
- `showConfirmation` - Whether to show confirmation dialog
- `children` - Button content (default: 'Sign Out')

#### Usage:
```tsx
import { LogoutButton } from '../components/LogoutButton';

// Basic logout button
<LogoutButton />

// With confirmation
<LogoutButton showConfirmation={true} />

// Custom styling
<LogoutButton 
  variant="primary" 
  className="my-custom-class"
  showConfirmation={true}
>
  Custom Logout Text
</LogoutButton>
```

### 3. Updated userService (`src/services/userService.ts`)

Added a `logoutUser()` function to the existing userService:

```typescript
import { logoutUser } from '../services/userService';

// Simple logout
await logoutUser();
```

## Integration Examples

### Navigation Component

The Navigation component now uses LogoutService in the user dropdown menu:

```tsx
<button
  onClick={async () => {
    setShowUserMenu(false);
    await LogoutService.completeLogout(navigate);
  }}
  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
  role="menuitem"
>
  Sign Out
</button>
```

### Custom Page Implementation

You can implement logout in any page component:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutService } from '../services/logoutService';
import { LogoutButton } from '../components/LogoutButton';

export default function MyPage() {
  const navigate = useNavigate();

  const handleCustomLogout = async () => {
    try {
      // Perform any custom cleanup here
      console.log('Performing custom cleanup...');
      
      // Then logout
      await LogoutService.completeLogout(navigate);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {/* Using the LogoutButton component */}
      <LogoutButton showConfirmation={true} />
      
      {/* Custom logout button */}
      <button onClick={handleCustomLogout}>
        Custom Logout
      </button>
    </div>
  );
}
```

## Features

### 1. Security Features
- Proper Firebase Auth sign out
- Local data cleanup (localStorage/sessionStorage)
- Session termination

### 2. User Experience Features
- Loading states during logout
- Confirmation dialogs (optional)
- Automatic redirect to login page
- Error handling with user feedback

### 3. Developer Features
- Multiple logout methods for different use cases
- Reusable components
- TypeScript support
- Comprehensive error handling
- Console logging for debugging

## Best Practices

1. **Use `completeLogout()`** for most cases as it handles cleanup and redirect
2. **Use confirmation dialogs** for important logout actions
3. **Handle errors gracefully** - always redirect even if logout fails
4. **Clear sensitive data** from local storage during logout
5. **Provide visual feedback** during logout operations

## Error Handling

All logout methods include comprehensive error handling:

- If logout fails, users are still redirected to login page
- Local data is cleared even if Firebase logout fails
- Error messages are logged to console for debugging
- User-friendly error handling prevents broken states

## Migration from Old Logout

If you had previous logout implementations, replace them with:

```typescript
// Old way
auth.signOut().then(() => navigate('/login'));

// New way
await LogoutService.completeLogout(navigate);
```

This ensures consistent behavior and proper cleanup across your application.