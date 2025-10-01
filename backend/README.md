# Backend - Customer Management System

A Flask-based REST API for managing customers and users with Firebase Realtime Database and Swagger documentation.

## 🏗️ Project Structure

```
backend/
├── app.py                 # Main Flask application with Swagger
├── models.py              # Firebase data models and repository
├── utils.py               # Utility functions
├── requirements.txt       # Python dependencies
├── setup.py              # Setup automation script
├── run.py                # Simple run script
├── .env                   # Environment variables (create from .env.example)
├── .env.example          # Environment variables template
├── config/
│   ├── app_config.py     # Application configuration
│   └── firebase_config.py # Firebase configuration
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials.

### 3. Firebase Setup

You need to set up Firebase credentials in your `.env` file. Get these from your Firebase Console:

- Go to Firebase Console → Project Settings → Service Accounts
- Generate a new private key
- Extract the values and add them to your `.env` file

### 4. Run the Application

```bash
python run.py
```

The API will be available at:
- **API Server**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/docs/`
- **Health Check**: `http://localhost:5000/health`

## � API Documentation

### Interactive Swagger UI
Visit `http://localhost:5000/docs/` for interactive API documentation with:
- ✅ Try-it-out functionality
- ✅ Request/response examples
- ✅ Model schemas
- ✅ Authentication info

### API Endpoints

#### Health Check
- `GET /health` - API health status
- `GET /api/v1/health` - Health check (versioned)

#### Users
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/{user_id}` - Get specific user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user (soft delete)

#### Customers
- `GET /api/v1/customers` - Get all customers
- `POST /api/v1/customers` - Create new customer
- `GET /api/v1/customers/{customer_id}` - Get specific customer
- `PUT /api/v1/customers/{customer_id}` - Update customer
- `DELETE /api/v1/customers/{customer_id}` - Delete customer (soft delete)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FLASK_ENV` | Environment (development/production) | No |
| `FLASK_DEBUG` | Enable debug mode | No |
| `SECRET_KEY` | Flask secret key | Yes (production) |
| `FIREBASE_DATABASE_URL` | Firebase Realtime Database URL | Yes |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase Private Key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase Client Email | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

### Firebase Configuration

The app uses **Firebase Realtime Database only** for data storage. Configure your Firebase credentials in the `.env` file using the service account key information.

**⚠️ No Local Database**: This application uses Firebase exclusively - no SQLite or other local database required.

## 🗄️ Data Models

### User Model
```json
{
  "user_id": "user_12345678",
  "email": "user@example.com",
  "role": "admin|user",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

### Customer Model
```json
{
  "customer_id": "cust_12345678",
  "name": "John Doe",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "company": "Acme Corp",
  "notes": "Important customer",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

## 🔐 Security Features

- **Secure Password Hashing**: Uses Werkzeug's PBKDF2 hashing
- **CORS Protection**: Configurable allowed origins
- **Environment Variables**: Sensitive data in environment variables
- **Soft Deletes**: Data is marked inactive instead of deleted
- **Input Validation**: Request validation with detailed error messages

## 🛠️ Development Features

### Swagger Integration
- **Interactive Documentation**: Test APIs directly from browser
- **Model Schemas**: Clear request/response documentation
- **Error Handling**: Standardized error responses
- **Validation**: Automatic request validation

### Firebase Repository Pattern
- **Clean Architecture**: Separated data access logic
- **Error Handling**: Graceful Firebase error handling
- **Type Safety**: Consistent data models

## 📝 Example Usage

### Create a User
```bash
curl -X POST "http://localhost:5000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword",
    "role": "user",
    "full_name": "New User"
  }'
```

### Create a Customer
```bash
curl -X POST "http://localhost:5000/api/v1/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp"
  }'
```

## 🚨 Production Deployment

Before deploying to production:

1. Set `FLASK_ENV=production`
2. Set a strong `SECRET_KEY`
3. Configure all required Firebase environment variables
4. Set appropriate `ALLOWED_ORIGINS`
5. Use a production WSGI server (gunicorn, uWSGI)
6. Set up proper logging
7. Configure Firebase security rules

## 📋 Notes

- **Default Admin**: admin@example.com / admin123 (change immediately!)
- **Firebase Only**: No local database - all data stored in Firebase
- **Soft Deletes**: Data is marked inactive rather than deleted
- **Auto Documentation**: Swagger docs automatically generated from code
- **CORS Ready**: Configured for frontend integration
