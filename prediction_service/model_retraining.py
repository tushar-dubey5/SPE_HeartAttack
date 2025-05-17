import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from database import get_training_data
import subprocess
from datetime import datetime

def preprocess_data(data):
    """Convert database records to training format"""
    features = ['age', 'sex', 'cp', 'trtbps', 'chol', 'fbs', 
               'restecg', 'thalachh', 'exng', 'oldpeak', 'slp', 'caa', 'thall']
    
    X = pd.DataFrame([[getattr(record, feature) for feature in features] 
                     for record in data], columns=features)
    
    y = np.array([1 if record.risk_level == 'HIGH' else 0 for record in data])
    
    return X, y

def retrain_model():
    """Retrain the model with new data and version it with DVC"""
    try:
        # Fetch all training data from database
        training_data = get_training_data()
        if len(training_data) < 10:  # Minimum threshold for training
            raise ValueError("Insufficient training data. Need at least 10 samples.")
        
        # Preprocess data
        X, y = preprocess_data(training_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train new model
        new_model = RandomForestClassifier(n_estimators=100, random_state=42)
        new_model.fit(X_train_scaled, y_train)
        
        # Evaluate new model
        new_train_score = new_model.score(X_train_scaled, y_train)
        new_test_score = new_model.score(X_test_scaled, y_test)
        
        print(f"New Model Training Score: {new_train_score:.4f}")
        print(f"New Model Testing Score: {new_test_score:.4f}")
        
        # Load and evaluate existing model
        try:
            current_model_path = os.getenv('MODEL_PATH')
            current_scaler_path = current_model_path.replace('heart_attack_model', 'scaler')
            
            with open(current_model_path, 'rb') as f:
                current_model = pickle.load(f)
            with open(current_scaler_path, 'rb') as f:
                current_scaler = pickle.load(f)
                
            # Transform test data with current scaler
            X_test_current_scaled = current_scaler.transform(X_test)
            current_test_score = current_model.score(X_test_current_scaled, y_test)
            print(f"Current Model Testing Score: {current_test_score:.4f}")
            
            # Only proceed if new model is better
            if new_test_score <= current_test_score:
                print("New model does not improve accuracy. Keeping current model.")
                return False, None
                
        except Exception as e:
            print(f"Could not evaluate current model: {str(e)}")
            print("Will proceed with new model as baseline")
        
        # Save model and scaler
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_dir = "models"
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, f"heart_attack_model_{timestamp}.pkl")
        scaler_path = os.path.join(model_dir, f"scaler_{timestamp}.pkl")
        
        with open(model_path, 'wb') as f:
            pickle.dump(new_model, f)
        with open(scaler_path, 'wb') as f:
            pickle.dump(scaler, f)
        
        # Version with DVC
        subprocess.run(['dvc', 'add', model_path])
        subprocess.run(['dvc', 'add', scaler_path])
        
        # Update .env file with new model path
        with open('.env', 'r') as f:
            env_lines = f.readlines()
        
        with open('.env', 'w') as f:
            for line in env_lines:
                if line.startswith('MODEL_PATH='):
                    f.write(f'MODEL_PATH={model_path}\n')
                else:
                    f.write(line)
        
        print(f"Model successfully retrained and saved to {model_path}")
        print(f"Scaler saved to {scaler_path}")
        print("Both files versioned with DVC")
        
        return True, model_path
        
    except Exception as e:
        print(f"Error in model retraining: {str(e)}")
        return False, None

if __name__ == "__main__":
    retrain_model() 