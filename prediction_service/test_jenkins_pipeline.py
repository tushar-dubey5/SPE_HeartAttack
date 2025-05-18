import os
import sys
import subprocess
import time
from database import get_training_data

def test_environment_setup():
    """Test Python environment setup"""
    print("\n🔍 Testing Python Environment Setup...")
    try:
        # Create venv
        subprocess.run(['python3', '-m', 'venv', 'venv'], check=True)
        
        # Activate venv and install requirements
        activate_cmd = f". venv/bin/activate && pip install -r requirements.txt"
        subprocess.run(activate_cmd, shell=True, executable='/bin/bash', check=True)
        
        print("✅ Environment setup successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Environment setup failed: {str(e)}")
        return False

def test_data_size():
    """Test if we have enough training data"""
    print("\n🔍 Checking Data Size...")
    try:
        data_size = len(get_training_data())
        min_size = 30
        print(f"Current data size: {data_size}")
        print(f"Minimum required: {min_size}")
        
        if data_size < min_size:
            print(f"❌ Insufficient data: {data_size} records (need at least {min_size})")
            return False
        
        print("✅ Data size check passed")
        return True
    except Exception as e:
        print(f"❌ Data size check failed: {str(e)}")
        return False

def test_model_training():
    """Test model training and evaluation"""
    print("\n🔍 Testing Model Training...")
    try:
        # Generate synthetic data
        subprocess.run(['python3', 'generate_synthetic_data.py'], check=True)
        
        # Run model retraining
        subprocess.run(['python3', 'model_retraining.py'], check=True)
        
        print("✅ Model training successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Model training failed: {str(e)}")
        return False

def test_dvc_operations():
    """Test DVC operations"""
    print("\n🔍 Testing DVC Operations...")
    try:
        # Initialize DVC if not already done
        if not os.path.exists('.dvc'):
            subprocess.run(['dvc', 'init'], check=True)
        
        # Test DVC operations with specific model files
        model_files = [
            'models/heart_attack_model_20250518_014810.pkl',
            'models/scaler_20250518_014810.pkl'
        ]
        
        for model_file in model_files:
            if os.path.exists(model_file):
                subprocess.run(['dvc', 'add', model_file], check=True)
        
        print("✅ DVC operations successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ DVC operations failed: {str(e)}")
        return False

def test_flask_deployment():
    """Test Flask app deployment"""
    print("\n🔍 Testing Flask Deployment...")
    try:
        # Kill any existing Flask process
        subprocess.run("pkill -f 'python3.*app.py'", shell=True)
        
        # Start Flask app
        subprocess.Popen(['python3', 'app.py'])
        
        # Wait for app to start
        time.sleep(5)
        
        # Test health endpoint
        health_check = subprocess.run(['curl', '-s', 'http://localhost:5000/health'])
        
        if health_check.returncode == 0:
            print("✅ Flask deployment successful")
            return True
        else:
            print("❌ Flask deployment failed: Health check failed")
            return False
    except Exception as e:
        print(f"❌ Flask deployment failed: {str(e)}")
        return False
    finally:
        # Cleanup: Stop Flask app
        subprocess.run("pkill -f 'python3.*app.py'", shell=True)

def main():
    """Run all pipeline tests"""
    print("🚀 Starting Jenkins Pipeline Tests")
    
    tests = [
        ("Environment Setup", test_environment_setup),
        ("Data Size Check", test_data_size),
        ("Model Training", test_model_training),
        ("DVC Operations", test_dvc_operations),
        ("Flask Deployment", test_flask_deployment)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Testing Stage: {test_name}")
        success = test_func()
        results.append((test_name, success))
        
        if not success:
            print(f"\n❌ Pipeline failed at stage: {test_name}")
            break
    
    print("\n{'='*50}")
    print("Pipeline Test Results:")
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    # Return 0 if all tests passed, 1 if any failed
    return 0 if all(success for _, success in results) else 1

if __name__ == "__main__":
    sys.exit(main()) 