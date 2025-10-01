"""
Utility functions for the application.
"""

import hashlib
from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """
    Hash password using Werkzeug's secure password hashing.
    This is more secure than SHA256 as it includes salt and uses PBKDF2.
    """
    return generate_password_hash(password)

def verify_password(password, password_hash):
    """Verify password against hash"""
    return check_password_hash(password_hash, password)

def generate_id(prefix="id"):
    """Generate a unique ID with prefix"""
    import uuid
    return f"{prefix}_{uuid.uuid4().hex[:8]}"