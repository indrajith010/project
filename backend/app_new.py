from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import hashlib
import uuid
import firebase_admin
from firebase_admin import credentials, db as firebase_db

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "app.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Initialize Firebase Admin
try:
    # Load Firebase service account
    cred = credentials.Certificate('service-account.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://coustomer-master-default-rtdb.firebaseio.com/'
    })
    firebase_ref = firebase_db.reference()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    firebase_ref = None

# SQLAlchemy Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), unique=True, nullable=False, default=lambda: f"user_{uuid.uuid4().hex[:8]}")
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    full_name = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.email,
            'role': self.role,
            'full_name': self.full_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(50), unique=True, nullable=False, default=lambda: f"cust_{uuid.uuid4().hex[:8]}")
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    company = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'company': self.company,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }

# Helper functions
def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def sync_to_firebase(path, data):
    """Sync data to Firebase Realtime Database"""
    if firebase_ref:
        try:
            firebase_ref.child(path).set(data)
            return True
        except Exception as e:
            print(f"Firebase sync error: {e}")
            return False
    return False

def delete_from_firebase(path):
    """Delete data from Firebase Realtime Database"""
    if firebase_ref:
        try:
            firebase_ref.child(path).delete()
            return True
        except Exception as e:
            print(f"Firebase delete error: {e}")
            return False
    return False

# User API Endpoints
@app.route('/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = User.query.filter_by(is_active=True).all()
        return jsonify({
            'status': 'success',
            'message': 'Users retrieved successfully',
            'data': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'failed',
            'message': f'Error retrieving users: {str(e)}'
        }), 500

@app.route('/users', methods=['POST'])
def add_user():
    """Add new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'status': 'failed',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'status': 'failed',
                'message': 'Email already exists'
            }), 400
        
        # Create new user
        user = User(
            email=data['email'],
            password_hash=hash_password(data['password']),
            role=data['role'],
            full_name=data.get('full_name', ''),
            user_id=data.get('user_id', f"user_{uuid.uuid4().hex[:8]}")
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Sync to Firebase
        user_data = user.to_dict()
        sync_to_firebase(f'users/{user.user_id}', user_data)
        
        return jsonify({
            'status': 'success',
            'message': 'User created successfully',
            'data': user_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error creating user: {str(e)}'
        }), 500

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'status': 'failed',
                'message': 'User not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if 'email' in data:
            # Check if new email already exists (excluding current user)
            existing_user = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing_user:
                return jsonify({
                    'status': 'failed',
                    'message': 'Email already exists'
                }), 400
            user.email = data['email']
        
        if 'password' in data and data['password']:
            user.password_hash = hash_password(data['password'])
        
        if 'role' in data:
            user.role = data['role']
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        
        if 'is_active' in data:
            user.is_active = data['is_active']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Sync to Firebase
        user_data = user.to_dict()
        sync_to_firebase(f'users/{user.user_id}', user_data)
        
        return jsonify({
            'status': 'success',
            'message': 'User updated successfully',
            'data': user_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error updating user: {str(e)}'
        }), 500

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user (soft delete)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'status': 'failed',
                'message': 'User not found'
            }), 404
        
        # Soft delete - mark as inactive
        user.is_active = False
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Delete from Firebase
        delete_from_firebase(f'users/{user.user_id}')
        
        return jsonify({
            'status': 'success',
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error deleting user: {str(e)}'
        }), 500

# Customer API Endpoints
@app.route('/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    try:
        customers = Customer.query.filter_by(is_active=True).all()
        return jsonify({
            'status': 'success',
            'message': 'Customers retrieved successfully',
            'data': [customer.to_dict() for customer in customers]
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'failed',
            'message': f'Error retrieving customers: {str(e)}'
        }), 500

@app.route('/customers', methods=['POST'])
def add_customer():
    """Add new customer"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'status': 'failed',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Create new customer
        customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            company=data.get('company', ''),
            notes=data.get('notes', ''),
            customer_id=data.get('customer_id', f"cust_{uuid.uuid4().hex[:8]}")
        )
        
        db.session.add(customer)
        db.session.commit()
        
        # Sync to Firebase
        customer_data = customer.to_dict()
        sync_to_firebase(f'customers/{customer.customer_id}', customer_data)
        
        return jsonify({
            'status': 'success',
            'message': 'Customer created successfully',
            'data': customer_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error creating customer: {str(e)}'
        }), 500

@app.route('/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update customer"""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({
                'status': 'failed',
                'message': 'Customer not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            customer.name = data['name']
        if 'email' in data:
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'address' in data:
            customer.address = data['address']
        if 'company' in data:
            customer.company = data['company']
        if 'notes' in data:
            customer.notes = data['notes']
        if 'is_active' in data:
            customer.is_active = data['is_active']
        
        customer.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Sync to Firebase
        customer_data = customer.to_dict()
        sync_to_firebase(f'customers/{customer.customer_id}', customer_data)
        
        return jsonify({
            'status': 'success',
            'message': 'Customer updated successfully',
            'data': customer_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error updating customer: {str(e)}'
        }), 500

@app.route('/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete customer (soft delete)"""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({
                'status': 'failed',
                'message': 'Customer not found'
            }), 404
        
        # Soft delete - mark as inactive
        customer.is_active = False
        customer.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Delete from Firebase
        delete_from_firebase(f'customers/{customer.customer_id}')
        
        return jsonify({
            'status': 'success',
            'message': 'Customer deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
            'message': f'Error deleting customer: {str(e)}'
        }), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'API is running',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# Initialize database
@app.before_first_request
def create_tables():
    """Create database tables"""
    db.create_all()
    
    # Create default admin user if it doesn't exist
    admin_user = User.query.filter_by(email='admin@example.com').first()
    if not admin_user:
        admin_user = User(
            user_id='admin_001',
            email='admin@example.com',
            password_hash=hash_password('admin123'),
            role='admin',
            full_name='System Administrator'
        )
        db.session.add(admin_user)
        db.session.commit()
        
        # Sync to Firebase
        sync_to_firebase(f'users/{admin_user.user_id}', admin_user.to_dict())
        print("✅ Default admin user created")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)