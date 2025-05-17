import os
from model_retraining import retrain_model
from test_prediction_storage import test_prediction_storage

def test_retraining_pipeline():
    # First, ensure we have some data in the database
    print("Testing prediction storage to ensure training data exists...")
    storage_success = test_prediction_storage()
    if not storage_success:
        print("Failed to store test prediction data")
        return False
    
    print("\nStarting model retraining test...")
    success, model_path = retrain_model()
    
    if not success:
        print("Model retraining failed")
        return False
    
    # Verify model file exists
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}")
        return False
    
    print("Model retraining test completed successfully")
    return True

if __name__ == "__main__":
    test_retraining_pipeline() 