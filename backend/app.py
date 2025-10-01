"""
Flask application for Customer Management System.
SQLite backend with Swagger API documentation.
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restx import Api, Resource, fields, Namespace
from flask_migrate import Migrate
from datetime import datetime

# Import local modules
from models import db, User, Customer, UserRepository, CustomerRepository
from config.app_config import get_config

def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config()
    app.config.from_object(config)
    
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": app.config['CORS_ORIGINS']
        }
    })
    
    # Initialize Swagger
    api = Api(
        app,
        version='1.0',
        title='Customer Management API',
        description='A comprehensive API for managing customers and users with SQLite backend',
        doc='/docs/',
        prefix='/api/v1'
    )
    
    # Create database tables
    with app.app_context():
        db.create_all()
        app.logger.info("Database tables created successfully")
        
        # Create default admin user
        create_default_admin()
    
    # Register API namespaces
    register_namespaces(api)
    
    return app

def create_default_admin():
    """Create default admin user if it doesn't exist"""
    try:
        existing_admin = UserRepository.get_by_email('admin@example.com')
        if not existing_admin:
            admin_user = UserRepository.create(
                email='admin@example.com',
                password='admin123',
                username='System Administrator',
                role='admin'
            )
            print("✅ Default admin user created")
    except Exception as e:
        print(f"❌ Error creating default admin: {e}")

def register_namespaces(api):
    """Register API namespaces"""
    
    # Health namespace
    health_ns = Namespace('health', description='Health check operations')
    
    @health_ns.route('')
    class HealthCheck(Resource):
        @health_ns.doc('health_check')
        def get(self):
            """Health check endpoint"""
            return {
                'status': 'success',
                'message': 'API is running',
                'timestamp': datetime.utcnow().isoformat(),
                'environment': os.getenv('FLASK_ENV', 'development'),
                'database': 'SQLite'
            }
    
    # Users namespace
    users_ns = Namespace('users', description='User management operations')
    
    # User models for Swagger
    user_model = users_ns.model('User', {
        'id': fields.Integer(description='User ID'),
        'email': fields.String(required=True, description='User email'),
        'username': fields.String(required=True, description='Username'),
        'role': fields.String(required=True, description='User role', enum=['admin', 'user']),
        'is_active': fields.Boolean(description='User active status'),
        'created_at': fields.String(description='Creation timestamp'),
        'updated_at': fields.String(description='Last update timestamp')
    })
    
    user_input = users_ns.model('UserInput', {
        'email': fields.String(required=True, description='User email'),
        'password': fields.String(required=True, description='User password'),
        'username': fields.String(required=True, description='Username'),
        'role': fields.String(required=True, description='User role', enum=['admin', 'user'])
    })
    
    user_update = users_ns.model('UserUpdate', {
        'email': fields.String(description='User email'),
        'password': fields.String(description='User password'),
        'username': fields.String(description='Username'),
        'role': fields.String(description='User role', enum=['admin', 'user']),
        'is_active': fields.Boolean(description='User active status')
    })
    
    @users_ns.route('')
    class UserList(Resource):
        @users_ns.doc('get_users')
        @users_ns.marshal_list_with(user_model)
        def get(self):
            """Get all users"""
            try:
                users = UserRepository.get_all()
                return [user.to_dict() for user in users]
            except Exception as e:
                users_ns.abort(500, f'Error retrieving users: {str(e)}')
        
        @users_ns.doc('create_user')
        @users_ns.expect(user_input)
        @users_ns.marshal_with(user_model, code=201)
        def post(self):
            """Create a new user"""
            try:
                data = request.json
                
                # Validate required fields
                required_fields = ['email', 'password', 'username', 'role']
                for field in required_fields:
                    if not data.get(field):
                        users_ns.abort(400, f'Missing required field: {field}')
                
                # Check if email already exists
                if UserRepository.get_by_email(data['email']):
                    users_ns.abort(400, 'Email already exists')
                
                # Create user
                user = UserRepository.create(
                    email=data['email'],
                    password=data['password'],
                    username=data['username'],
                    role=data['role']
                )
                
                return user.to_dict(), 201
                
            except Exception as e:
                users_ns.abort(500, f'Error creating user: {str(e)}')
    
    @users_ns.route('/<int:user_id>')
    class UserResource(Resource):
        @users_ns.doc('get_user')
        @users_ns.marshal_with(user_model)
        def get(self, user_id):
            """Get a specific user"""
            try:
                user = UserRepository.get_by_id(user_id)
                if not user:
                    users_ns.abort(404, 'User not found')
                return user.to_dict()
            except Exception as e:
                users_ns.abort(500, f'Error retrieving user: {str(e)}')
        
        @users_ns.doc('update_user')
        @users_ns.expect(user_update)
        @users_ns.marshal_with(user_model)
        def put(self, user_id):
            """Update a user"""
            try:
                user = UserRepository.get_by_id(user_id)
                if not user:
                    users_ns.abort(404, 'User not found')
                
                data = request.json
                
                # Handle password separately
                if 'password' in data:
                    user.set_password(data.pop('password'))
                
                # Update other fields
                updated_user = UserRepository.update(user_id, **data)
                return updated_user.to_dict()
                
            except Exception as e:
                users_ns.abort(500, f'Error updating user: {str(e)}')
        
        @users_ns.doc('delete_user')
        def delete(self, user_id):
            """Delete a user"""
            try:
                if UserRepository.delete(user_id):
                    return {'message': 'User deleted successfully'}
                else:
                    users_ns.abort(404, 'User not found')
            except Exception as e:
                users_ns.abort(500, f'Error deleting user: {str(e)}')
    
    # Customers namespace
    customers_ns = Namespace('customers', description='Customer management operations')
    
    # Customer models for Swagger
    customer_model = customers_ns.model('Customer', {
        'id': fields.Integer(description='Customer ID'),
        'name': fields.String(required=True, description='Customer name'),
        'email': fields.String(required=True, description='Customer email'),
        'phone': fields.String(description='Customer phone'),
        'company': fields.String(description='Customer company'),
        'notes': fields.String(description='Customer notes'),
        'is_active': fields.Boolean(description='Customer active status'),
        'created_at': fields.String(description='Creation timestamp'),
        'updated_at': fields.String(description='Last update timestamp')
    })
    
    customer_input = customers_ns.model('CustomerInput', {
        'name': fields.String(required=True, description='Customer name'),
        'email': fields.String(required=True, description='Customer email'),
        'phone': fields.String(description='Customer phone'),
        'company': fields.String(description='Customer company'),
        'notes': fields.String(description='Customer notes')
    })
    
    customer_update = customers_ns.model('CustomerUpdate', {
        'name': fields.String(description='Customer name'),
        'email': fields.String(description='Customer email'),
        'phone': fields.String(description='Customer phone'),
        'company': fields.String(description='Customer company'),
        'notes': fields.String(description='Customer notes'),
        'is_active': fields.Boolean(description='Customer active status')
    })
    
    @customers_ns.route('')
    class CustomerList(Resource):
        @customers_ns.doc('get_customers')
        @customers_ns.marshal_list_with(customer_model)
        def get(self):
            """Get all customers"""
            try:
                search_query = request.args.get('search', '')
                if search_query:
                    customers = CustomerRepository.search(search_query)
                else:
                    customers = CustomerRepository.get_all()
                return [customer.to_dict() for customer in customers]
            except Exception as e:
                customers_ns.abort(500, f'Error retrieving customers: {str(e)}')
        
        @customers_ns.doc('create_customer')
        @customers_ns.expect(customer_input)
        @customers_ns.marshal_with(customer_model, code=201)
        def post(self):
            """Create a new customer"""
            try:
                data = request.json
                
                # Validate required fields
                required_fields = ['name', 'email']
                for field in required_fields:
                    if not data.get(field):
                        customers_ns.abort(400, f'Missing required field: {field}')
                
                # Check if email already exists
                if CustomerRepository.get_by_email(data['email']):
                    customers_ns.abort(400, 'Email already exists')
                
                # Create customer
                customer = CustomerRepository.create(
                    name=data['name'],
                    email=data['email'],
                    phone=data.get('phone'),
                    company=data.get('company'),
                    notes=data.get('notes')
                )
                
                return customer.to_dict(), 201
                
            except Exception as e:
                customers_ns.abort(500, f'Error creating customer: {str(e)}')
    
    @customers_ns.route('/<int:customer_id>')
    class CustomerResource(Resource):
        @customers_ns.doc('get_customer')
        @customers_ns.marshal_with(customer_model)
        def get(self, customer_id):
            """Get a specific customer"""
            try:
                customer = CustomerRepository.get_by_id(customer_id)
                if not customer:
                    customers_ns.abort(404, 'Customer not found')
                return customer.to_dict()
            except Exception as e:
                customers_ns.abort(500, f'Error retrieving customer: {str(e)}')
        
        @customers_ns.doc('update_customer')
        @customers_ns.expect(customer_update)
        @customers_ns.marshal_with(customer_model)
        def put(self, customer_id):
            """Update a customer"""
            try:
                customer = CustomerRepository.get_by_id(customer_id)
                if not customer:
                    customers_ns.abort(404, 'Customer not found')
                
                data = request.json
                updated_customer = CustomerRepository.update(customer_id, **data)
                return updated_customer.to_dict()
                
            except Exception as e:
                customers_ns.abort(500, f'Error updating customer: {str(e)}')
        
        @customers_ns.doc('delete_customer')
        def delete(self, customer_id):
            """Delete a customer"""
            try:
                if CustomerRepository.delete(customer_id):
                    return {'message': 'Customer deleted successfully'}
                else:
                    customers_ns.abort(404, 'Customer not found')
            except Exception as e:
                customers_ns.abort(500, f'Error deleting customer: {str(e)}')
    
    # Authentication namespace
    auth_ns = Namespace('auth', description='Authentication operations')
    
    auth_input = auth_ns.model('AuthInput', {
        'email': fields.String(required=True, description='User email'),
        'password': fields.String(required=True, description='User password')
    })
    
    @auth_ns.route('/login')
    class Login(Resource):
        @auth_ns.doc('login')
        @auth_ns.expect(auth_input)
        def post(self):
            """Authenticate user"""
            try:
                data = request.json
                
                if not data.get('email') or not data.get('password'):
                    auth_ns.abort(400, 'Email and password are required')
                
                user = UserRepository.authenticate(data['email'], data['password'])
                if user:
                    return {
                        'status': 'success',
                        'message': 'Login successful',
                        'user': user.to_dict()
                    }
                else:
                    auth_ns.abort(401, 'Invalid credentials')
                    
            except Exception as e:
                auth_ns.abort(500, f'Error during authentication: {str(e)}')
    
    # Register namespaces
    api.add_namespace(health_ns, path='/health')
    api.add_namespace(users_ns, path='/users')
    api.add_namespace(customers_ns, path='/customers')
    api.add_namespace(auth_ns, path='/auth')

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)