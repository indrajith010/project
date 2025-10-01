from datetime import datetime
from typing import Optional, List, Dict, Any
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for SQLAlchemy"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='user', nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __init__(self, email: str, password: str, username: str, role: str = 'user'):
        self.email = email
        self.set_password(password)
        self.username = username
        self.role = role
        
    def set_password(self, password: str):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password: str) -> bool:
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
    def __repr__(self):
        return f'<User {self.email}>'


class Customer(db.Model):
    """Customer model for SQLAlchemy"""
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __init__(self, name: str, email: str, phone: str = None, company: str = None, notes: str = None):
        self.name = name
        self.email = email
        self.phone = phone
        self.company = company
        self.notes = notes
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert customer to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'notes': self.notes,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
    def __repr__(self):
        return f'<Customer {self.name} ({self.email})>'


class UserRepository:
    """Repository class for User operations"""
    
    @staticmethod
    def create(email: str, password: str, username: str, role: str = 'user') -> User:
        """Create a new user"""
        user = User(email=email, password=password, username=username, role=role)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        """Get user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        """Get user by email"""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_all() -> List[User]:
        """Get all users"""
        return User.query.all()
    
    @staticmethod
    def update(user_id: int, **kwargs) -> Optional[User]:
        """Update user"""
        user = User.query.get(user_id)
        if user:
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            user.updated_at = datetime.utcnow()
            db.session.commit()
        return user
    
    @staticmethod
    def delete(user_id: int) -> bool:
        """Delete user"""
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
    
    @staticmethod
    def authenticate(email: str, password: str) -> Optional[User]:
        """Authenticate user"""
        user = UserRepository.get_by_email(email)
        if user and user.check_password(password):
            return user
        return None


class CustomerRepository:
    """Repository class for Customer operations"""
    
    @staticmethod
    def create(name: str, email: str, phone: str = None, company: str = None, notes: str = None) -> Customer:
        """Create a new customer"""
        customer = Customer(name=name, email=email, phone=phone, company=company, notes=notes)
        db.session.add(customer)
        db.session.commit()
        return customer
    
    @staticmethod
    def get_by_id(customer_id: int) -> Optional[Customer]:
        """Get customer by ID"""
        return Customer.query.get(customer_id)
    
    @staticmethod
    def get_by_email(email: str) -> Optional[Customer]:
        """Get customer by email"""
        return Customer.query.filter_by(email=email).first()
    
    @staticmethod
    def get_all() -> List[Customer]:
        """Get all customers"""
        return Customer.query.all()
    
    @staticmethod
    def update(customer_id: int, **kwargs) -> Optional[Customer]:
        """Update customer"""
        customer = Customer.query.get(customer_id)
        if customer:
            for key, value in kwargs.items():
                if hasattr(customer, key):
                    setattr(customer, key, value)
            customer.updated_at = datetime.utcnow()
            db.session.commit()
        return customer
    
    @staticmethod
    def delete(customer_id: int) -> bool:
        """Delete customer"""
        customer = Customer.query.get(customer_id)
        if customer:
            db.session.delete(customer)
            db.session.commit()
            return True
        return False
    
    @staticmethod
    def search(query: str) -> List[Customer]:
        """Search customers by name, email, or company"""
        search_term = f"%{query}%"
        return Customer.query.filter(
            db.or_(
                Customer.name.ilike(search_term),
                Customer.email.ilike(search_term),
                Customer.company.ilike(search_term)
            )
        ).all()