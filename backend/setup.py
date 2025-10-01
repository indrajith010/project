#!/usr/bin/env python3
"""
Setup script for the backend application.
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def setup_env_file():
    """Set up environment file"""
    env_file = ".env"
    env_example = ".env.example"
    
    if os.path.exists(env_file):
        print("✅ .env file already exists")
        return True
    
    if os.path.exists(env_example):
        try:
            with open(env_example, 'r') as src, open(env_file, 'w') as dst:
                dst.write(src.read())
            print("✅ Created .env file from .env.example")
            print("⚠️  Please edit .env file with your Firebase credentials")
            return True
        except Exception as e:
            print(f"❌ Failed to create .env file: {e}")
            return False
    else:
        print("❌ .env.example file not found")
        return False

def check_firebase_config():
    """Check if Firebase configuration is set"""
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = [
            'FIREBASE_DATABASE_URL',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_PRIVATE_KEY',
            'FIREBASE_CLIENT_EMAIL'
        ]
        
        missing = [var for var in required_vars if not os.getenv(var)]
        
        if missing:
            print("⚠️  Missing Firebase configuration:")
            for var in missing:
                print(f"   - {var}")
            print("   Please update your .env file with Firebase credentials")
            return False
        else:
            print("✅ Firebase configuration appears complete")
            return True
            
    except ImportError:
        print("⚠️  python-dotenv not installed, skipping config check")
        return True

def main():
    """Main setup function"""
    print("🚀 Setting up Customer Management Backend\n")
    
    steps = [
        ("Checking Python version", check_python_version),
        ("Installing dependencies", install_dependencies),
        ("Setting up environment file", setup_env_file),
        ("Checking Firebase configuration", check_firebase_config),
    ]
    
    for step_name, step_func in steps:
        print(f"\n📋 {step_name}...")
        if not step_func():
            print(f"\n❌ Setup failed at: {step_name}")
            sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Update .env file with your Firebase credentials")
    print("2. Run: python app.py")
    print("3. Visit: http://localhost:5000/health")

if __name__ == "__main__":
    main()