# Firebase Authentication Integration

This document explains how the Firebase Cloud Function integrates with our existing authentication system.

## Overview

We have created a Firebase Cloud Function that automatically adds new users to the Firebase Realtime Database when they sign up using Firebase Authentication. This ensures that every authenticated user has a corresponding entry in the database, which is essential for storing additional user information such as their role (admin or user).

## How It Works

1. **User Signs Up**: When a user signs up using Firebase Authentication (either through the app or directly through Firebase Auth).

2. **Cloud Function Triggers**: The `createUserProfile` function automatically runs when a new user is created in Firebase Auth.

3. **Database Entry Created**: The function creates a new entry in the `users` node of the Realtime Database with:
   - `id`: The user's Firebase Auth UID
   - `email`: The user's email address
   - `name`: The user's display name (if available) or empty string
   - `role`: Default value of "user"
   - `createdAt`: Server timestamp

4. **User Deletion**: Similarly, when a user is deleted from Firebase Auth, the `deleteUserProfile` function automatically removes their data from the database.

## Integration with Existing Code

Our current application already has functions to manage users, but these functions are designed to be called from the client-side. The Firebase Cloud Function complements these by ensuring that:

1. **No Manual Steps Required**: User entries are created automatically in the database upon signup, even if the client-side code fails to create them.

2. **Consistent Data Format**: The function ensures that all users have the same data structure in the database.

3. **Security Enhancement**: Since the function runs server-side, it can't be bypassed by malicious client-side code.

## Admin Users

The function creates all users with the default role of "user". To promote a user to an admin role:

1. **Using the App**: Use the Auth Debug page in the application.
   
2. **Using the Command Line**: Use the provided `promote-admin.js` script:
   ```
   cd functions
   node promote-admin.js YOUR_USER_ID
   ```

3. **Manually in Firebase Console**: Navigate to the Realtime Database in the Firebase Console and change the user's role to "admin".

## Database Rules

For this system to work properly, ensure your database rules allow:

1. The Firebase Cloud Function (using Admin SDK) to write to the `users` node.
2. Authenticated users to read their own user data.
3. Admin users to read and write to all user data.

## Changes to Existing Code

The addition of this Cloud Function means that:

1. The client-side `createUser` function in `userService.ts` may now be redundant for creating the initial database entry (though it's still useful for admin users to create new users).

2. The `loginUser` function doesn't need to check if a database entry exists for the user - it should always exist.

3. For security, you may want to remove any client-side code that sets admin roles, leaving that to the server-side functions or admin interfaces.