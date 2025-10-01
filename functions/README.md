# Firebase Functions

This directory contains Firebase Cloud Functions that handle automatic user creation in the Realtime Database when a new user signs up using Firebase Authentication.

## Functions Overview

### `createUserProfile`

This function automatically creates a new user profile in the Realtime Database when a new user is created in Firebase Authentication.

- **Trigger**: Firebase Authentication user creation
- **Action**: Creates a document in the "users" node with:
  - `id`: Same as Firebase Auth uid
  - `email`: User's email address
  - `name`: User's display name (or empty string if not provided)
  - `role`: Default to "user"
  - `createdAt`: Server timestamp when the profile was created

### `deleteUserProfile`

This function automatically removes the user's data from the Realtime Database when a user is deleted from Firebase Authentication.

- **Trigger**: Firebase Authentication user deletion
- **Action**: Deletes the user document from the "users" node

## Deployment Instructions

### Prerequisites

1. Make sure you have Firebase CLI installed:
```
npm install -g firebase-tools
```

2. Make sure you're logged in to Firebase:
```
firebase login
```

3. Make sure your Firebase project is set up:
```
firebase use --add
```

### Deploy Functions

To deploy the functions to Firebase:

```
cd functions
npm install
firebase deploy --only functions
```

## Local Testing

To test the functions locally:

```
firebase emulators:start
```

This will start the Firebase emulators, allowing you to test the functions locally.

## Monitoring and Logs

To view logs for the deployed functions:

```
firebase functions:log
```

## Adding Admin Users

Since the function creates all new users with the default role of "user", you'll need to manually update a user to the "admin" role for the first admin user. You can do this:

1. Through the Firebase console by navigating to the Realtime Database and changing the role.
2. Using the Firebase Admin SDK in a one-time script.
3. Using the Auth Debug page you've created in the application.

## Security Considerations

- Make sure your database rules are properly set to restrict access to user data.
- Consider implementing additional security measures like email verification before granting certain permissions.