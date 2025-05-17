import requests
import json
import time

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = 'http://localhost:5000'
    
    # Test health check endpoint
    print("\nTesting health check endpoint...")
    try:
        response = requests.get(f'{base_url}/health')
        print(f"Health check response: {response.json()}")
        assert response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        return False
    
    # Test prediction endpoint
    print("\nTesting prediction endpoint...")
    test_data = {
        'age': 52,
        'sex': 1,
        'cp': 0,
        'trtbps': 125,
        'chol': 212,
        'fbs': 0,
        'restecg': 1,
        'thalachh': 168,
        'exng': 0,
        'oldpeak': 1.0,
        'slp': 2,
        'caa': 2,
        'thall': 3
    }
    
    try:
        response = requests.post(
            f'{base_url}/predict',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Prediction response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200
        assert 'risk_score' in response.json()
        assert 'risk_level' in response.json()
    except Exception as e:
        print(f"Prediction test failed: {str(e)}")
        return False
    
    # Test model retraining endpoint
    print("\nTesting model retraining endpoint...")
    try:
        response = requests.post(f'{base_url}/retrain')
        print(f"Retraining response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200
        assert 'message' in response.json()
        assert 'model_path' in response.json()
    except Exception as e:
        print(f"Retraining test failed: {str(e)}")
        return False
    
    print("\nAll API tests passed successfully!")
    return True

if __name__ == "__main__":
    # Wait for the Flask server to start
    print("Waiting for Flask server to start...")
    time.sleep(2)
    test_api_endpoints() 