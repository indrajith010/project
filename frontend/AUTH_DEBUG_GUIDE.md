# Authentication Debugging Guide

This guide will help you troubleshoot the authentication issues you're experiencing with your application.

## Setup Steps

1. **Access the Auth Debug Page**
   - Navigate to `/auth-debug` in your browser
   - This page has been created specifically to help troubleshoot authentication issues

2. **Test Creating a User**
   - Use the "Create Test User" button with the default credentials or modify them
   - Note any error messages that appear

3. **Test Login**
   - After creating a test user, try logging in with the "Login with Test User" button
   - Check the error message if login fails

## Common Issues and Solutions

### 1. Invalid Credential Error

If you see "Firebase: Error (auth/invalid-credential)" when logging in, it could mean:

- The email/password combination is incorrect
- The user account has been deleted or disabled
- The Firebase project settings have changed

**Solution:**
- Try creating a new test user through the Auth Debug page
- Verify the email and password carefully
- Check if the user exists in Firebase Authentication console

### 2. Database Write Permission Issues

If you see errors about database permissions when creating users:

**Solution:**
- Check your `database.rules.json` file
- Make sure it contains the following permissions:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      ".read": "auth != null",
      ".write": true,
      "$uid": {
        ".write": true,
        ".validate": "newData.hasChildren(['email', 'name', 'role'])",
        "role": {
          ".validate": "newData.val() === 'admin' || newData.val() === 'user'"
        }
      }
    }
  }
}
```

- Deploy these updated rules to Firebase

### 3. Admin Role Not Being Recognized

If your user has admin: true but still gets "Access Denied":

**Solution:**
- Use the Auth Debug page to check if the user data in the database has `role: "admin"`
- If not, you can manually set it by following these steps:
  1. Go to the Firebase console
  2. Navigate to Realtime Database
  3. Find your user under the "users" node
  4. Edit the user and ensure it has `"role": "admin"`

### 4. Firebase Connection Issues

**Solution:**
- Verify your Firebase configuration in `firebaseConfig.ts`
- Make sure the `databaseURL` is correct
- Check if you can access the Firebase console

## Next Steps

1. Start with the Auth Debug page at `/auth-debug`
2. Follow the troubleshooting steps above
3. If issues persist, check the Firebase console directly to verify user data

## Firebase Console Access

1. Go to https://console.firebase.google.com/
2. Select your project "coustomer-master"
3. Navigate to "Authentication" to view/manage users
4. Navigate to "Realtime Database" to check your database structure and rules