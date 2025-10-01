"""
Development server without Firebase for testing Swagger.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields, Namespace
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_demo_app():
    """Create demo app without Firebase"""
    app = Flask(__name__)
    
    # Basic configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'demo-secret-key')
    app.config['DEBUG'] = True
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize Swagger
    api = Api(
        app,
        version='1.0',
        title='Customer Management API (Demo)',
        description='Demo API without Firebase - showcasing Swagger documentation',
        doc='/docs/',
        prefix='/api/v1'
    )
    
    # Register demo namespaces
    register_demo_namespaces(api)
    
    return app

def register_demo_namespaces(api):
    """Register demo API namespaces"""
    
    # Health namespace
    health_ns = Namespace('health', description='Health check operations')
    
    @health_ns.route('')
    class HealthCheck(Resource):
        @health_ns.doc('health_check')
        def get(self):
            """Health check endpoint"""
            return {
                'status': 'success',
                'message': 'Demo API is running',
                'timestamp': datetime.utcnow().isoformat(),
                'environment': 'demo',
                'note': 'This is a demo version without Firebase integration'
            }
    
    # Demo Users namespace
    users_ns = Namespace('users', description='User management operations (Demo)')
    
    # User models for Swagger
    user_model = users_ns.model('User', {
        'user_id': fields.String(description='Unique user identifier', example='user_12345678'),
        'email': fields.String(required=True, description='User email', example='user@example.com'),
        'role': fields.String(required=True, description='User role', enum=['admin', 'user'], example='user'),
        'full_name': fields.String(description='User full name', example='John Doe'),
        'is_active': fields.Boolean(description='User active status', example=True),
        'created_at': fields.String(description='Creation timestamp', example='2023-01-01T00:00:00Z'),
        'updated_at': fields.String(description='Last update timestamp', example='2023-01-01T00:00:00Z')
    })
    
    user_input = users_ns.model('UserInput', {
        'email': fields.String(required=True, description='User email', example='newuser@example.com'),
        'password': fields.String(required=True, description='User password', example='securepassword'),
        'role': fields.String(required=True, description='User role', enum=['admin', 'user'], example='user'),
        'full_name': fields.String(description='User full name', example='New User')
    })
    
    # Demo data
    demo_users = [
        {
            'user_id': 'user_12345678',
            'email': 'demo@example.com',
            'role': 'user',
            'full_name': 'Demo User',
            'is_active': True,
            'created_at': '2023-01-01T00:00:00Z',
            'updated_at': '2023-01-01T00:00:00Z'
        },
        {
            'user_id': 'admin_001',
            'email': 'admin@example.com',
            'role': 'admin',
            'full_name': 'Admin User',
            'is_active': True,
            'created_at': '2023-01-01T00:00:00Z',
            'updated_at': '2023-01-01T00:00:00Z'
        }
    ]
    
    @users_ns.route('')
    class UserList(Resource):
        @users_ns.doc('get_users')
        @users_ns.marshal_list_with(user_model)
        def get(self):
            """Get all users (Demo data)"""
            return demo_users
        
        @users_ns.doc('create_user')
        @users_ns.expect(user_input)
        @users_ns.marshal_with(user_model, code=201)
        def post(self):
            """Create a new user (Demo - returns mock data)"""
            data = users_ns.payload
            new_user = {
                'user_id': f"user_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
                'email': data.get('email', 'demo@example.com'),
                'role': data.get('role', 'user'),
                'full_name': data.get('full_name', 'Demo User'),
                'is_active': True,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            return new_user, 201
    
    @users_ns.route('/<string:user_id>')
    class UserDetail(Resource):
        @users_ns.doc('get_user')
        @users_ns.marshal_with(user_model)
        def get(self, user_id):
            """Get a specific user (Demo data)"""
            for user in demo_users:
                if user['user_id'] == user_id:
                    return user
            users_ns.abort(404, 'User not found')
    
    # Demo Customers namespace
    customers_ns = Namespace('customers', description='Customer management operations (Demo)')
    
    # Customer models for Swagger
    customer_model = customers_ns.model('Customer', {
        'customer_id': fields.String(description='Unique customer identifier', example='cust_12345678'),
        'name': fields.String(required=True, description='Customer name', example='John Doe'),
        'email': fields.String(required=True, description='Customer email', example='customer@example.com'),
        'phone': fields.String(description='Customer phone', example='+1234567890'),
        'address': fields.String(description='Customer address', example='123 Main St'),
        'company': fields.String(description='Customer company', example='Acme Corp'),
        'notes': fields.String(description='Customer notes', example='VIP customer'),
        'is_active': fields.Boolean(description='Customer active status', example=True),
        'created_at': fields.String(description='Creation timestamp', example='2023-01-01T00:00:00Z'),
        'updated_at': fields.String(description='Last update timestamp', example='2023-01-01T00:00:00Z')
    })
    
    customer_input = customers_ns.model('CustomerInput', {
        'name': fields.String(required=True, description='Customer name', example='Jane Smith'),
        'email': fields.String(required=True, description='Customer email', example='jane@example.com'),
        'phone': fields.String(description='Customer phone', example='+1987654321'),
        'address': fields.String(description='Customer address', example='456 Oak Ave'),
        'company': fields.String(description='Customer company', example='Tech Corp'),
        'notes': fields.String(description='Customer notes', example='New customer')
    })
    
    # Demo customer data
    demo_customers = [
        {
            'customer_id': 'cust_12345678',
            'name': 'Demo Customer',
            'email': 'customer@example.com',
            'phone': '+1234567890',
            'address': '123 Demo Street',
            'company': 'Demo Corp',
            'notes': 'This is a demo customer',
            'is_active': True,
            'created_at': '2023-01-01T00:00:00Z',
            'updated_at': '2023-01-01T00:00:00Z'
        },
        {
            'customer_id': 'cust_87654321',
            'name': 'Another Customer',
            'email': 'another@example.com',
            'phone': '+1987654321',
            'address': '456 Test Avenue',
            'company': 'Test Inc',
            'notes': 'Another demo customer',
            'is_active': True,
            'created_at': '2023-01-01T00:00:00Z',
            'updated_at': '2023-01-01T00:00:00Z'
        }
    ]
    
    @customers_ns.route('')
    class CustomerList(Resource):
        @customers_ns.doc('get_customers')
        @customers_ns.marshal_list_with(customer_model)
        def get(self):
            """Get all customers (Demo data)"""
            return demo_customers
        
        @customers_ns.doc('create_customer')
        @customers_ns.expect(customer_input)
        @customers_ns.marshal_with(customer_model, code=201)
        def post(self):
            """Create a new customer (Demo - returns mock data)"""
            data = customers_ns.payload
            new_customer = {
                'customer_id': f"cust_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
                'name': data.get('name', 'Demo Customer'),
                'email': data.get('email', 'demo@example.com'),
                'phone': data.get('phone', ''),
                'address': data.get('address', ''),
                'company': data.get('company', ''),
                'notes': data.get('notes', ''),
                'is_active': True,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            return new_customer, 201
    
    @customers_ns.route('/<string:customer_id>')
    class CustomerDetail(Resource):
        @customers_ns.doc('get_customer')
        @customers_ns.marshal_with(customer_model)
        def get(self, customer_id):
            """Get a specific customer (Demo data)"""
            for customer in demo_customers:
                if customer['customer_id'] == customer_id:
                    return customer
            customers_ns.abort(404, 'Customer not found')
    
    # Register namespaces
    api.add_namespace(health_ns, path='/health')
    api.add_namespace(users_ns, path='/users')
    api.add_namespace(customers_ns, path='/customers')

# Create demo app
app = create_demo_app()

# Legacy endpoints
@app.route('/health', methods=['GET'])
def legacy_health_check():
    """Legacy health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Demo API is running (legacy endpoint)',
        'timestamp': datetime.utcnow().isoformat(),
        'environment': 'demo',
        'note': 'Use /api/v1/health or see /docs/ for full API documentation'
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    
    print("🚀 Customer Management API (Demo Mode) Starting...")
    print(f"📍 Server: http://localhost:{port}")
    print(f"📚 Swagger Docs: http://localhost:{port}/docs/")
    print(f"❤️  Health Check: http://localhost:{port}/health")
    print(f"🔧 Debug Mode: True")
    print(f"🌍 Environment: demo")
    print()
    print("📝 Note: This is a demo version with mock data.")
    print("   Configure Firebase credentials in .env to use real data.")
    
    app.run(host='0.0.0.0', port=port, debug=True)