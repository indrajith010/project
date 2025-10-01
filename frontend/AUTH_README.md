# Authentication System Setup Guide

This document provides a comprehensive guide on how the authentication system works in this application and how to troubleshoot common issues.

## Overview

The application uses Firebase Authentication along with Firebase Realtime Database to manage users and their roles. The basic flow is:

1. Users sign up/login using Firebase Authentication
2. User data including role (admin/user) is stored in Firebase Realtime Database
3. Protected routes check both authentication status and role permissions

## Setup Process

### First-time Admin Setup

1. Navigate to `/setup-admin` in your browser
2. Enter your details and use "admin123" as the admin key
3. This creates your admin account in both Firebase Auth and Database

### Adding Additional Users

As an admin:
1. Log in with your admin account
2. Navigate to the User Management page
3. Add new users who will have regular (non-admin) access

## Authentication Flow

1. User logs in via `/login` page
2. Firebase authenticates the email/password
3. The app checks Firebase Realtime Database for the user's role
4. The user is granted access based on their role:
   - Regular users: Can access customer management features
   - Admin users: Can access user management and all other features

## Common Issues & Troubleshooting

### "Access Denied" Message

If you're seeing "Access Denied" when trying to access admin pages:

1. **Verify Admin Status**: 
   - Navigate to `/auth-debug` 
   - Check if your user has `role: "admin"` in the database
   - If not, use the "Force Admin Role" button

2. **Database Issues**:
   - Your user might exist in Firebase Auth but not in the Database
   - Use the Auth Debug page to verify your user exists in both places

### Login Failures

If you're unable to login:

1. **Invalid Credentials Error**:
   - Ensure you're using the correct email/password
   - Try creating a new test user on the Auth Debug page

2. **Database Rules**:
   - Firebase security rules might be blocking database access
   - Check that your database.rules.json has the proper permissions

## Advanced Debugging

### Auth Debug Page (`/auth-debug`)

This page offers several tools to diagnose authentication issues:

1. **View Auth State**: See your current authentication status
2. **Create Test Users**: Create test users with admin privileges
3. **Force Admin Role**: Ensure your user has admin privileges
4. **View All Users**: See all users in the database
5. **Database Rules Info**: Get information on the required database rules

### Database Rules

Your database rules should look like:

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

The important part is `"users": { ".write": true }` which allows creating the first admin user.

## Security Considerations

- The `".write": true` rule for the users node allows anyone to write to the users collection, which is necessary for first-time setup but is a security risk if left indefinitely
- After creating the first admin user, consider changing this rule to `".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"`

## Additional Help

If you're still having issues:
1. Visit `/debug-user` for more user debugging options
2. Visit `/auth-debug` to use the authentication debugging tools
3. Check the browser console for detailed error messages