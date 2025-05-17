import pickle
import os
from dotenv import load_dotenv
from database import save_prediction, get_training_data

load_dotenv()

def test_prediction_storage():
    # Sample input data
    test_features = {
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
        # Load the model
        model_path = os.getenv('MODEL_PATH')
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Make prediction
        features_list = [
            test_features['age'], test_features['sex'], test_features['cp'],
            test_features['trtbps'], test_features['chol'], test_features['fbs'],
            test_features['restecg'], test_features['thalachh'], test_features['exng'],
            test_features['oldpeak'], test_features['slp'], test_features['caa'],
            test_features['thall']
        ]
        
        risk_score = model.predict([features_list])[0]
        risk_level = 'HIGH' if risk_score > 0.5 else 'LOW'
        
        # Store prediction
        saved_prediction = save_prediction(test_features, float(risk_score), risk_level)
        print(f"Successfully saved prediction with ID: {saved_prediction.id}")
        print(f"Predicted risk score: {risk_score:.2f}")
        print(f"Risk level: {risk_level}")
        
        # Verify storage by retrieving all predictions
        all_predictions = get_training_data()
        print(f"\nRetrieved {len(all_predictions)} predictions from database")
        
        # Print the most recent prediction
        latest = all_predictions[-1] if all_predictions else None
        if latest:
            print("\nLatest prediction details:")
            print(f"ID: {latest.id}")
            print(f"Timestamp: {latest.timestamp}")
            print(f"Age: {latest.age}")
            print(f"Risk Score: {latest.risk_score:.2f}")
            print(f"Risk Level: {latest.risk_level}")
        
        return True
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_prediction_storage() 