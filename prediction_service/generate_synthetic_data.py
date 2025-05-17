import numpy as np
from database import save_prediction

def generate_synthetic_data(n_samples=20):
    """Generate synthetic heart attack prediction data"""
    
    # Define ranges for each feature
    feature_ranges = {
        'age': (25, 80),
        'sex': (0, 1),  # Binary
        'cp': (0, 3),  # Chest pain type
        'trtbps': (90, 200),  # Resting blood pressure
        'chol': (126, 564),  # Cholesterol
        'fbs': (0, 1),  # Fasting blood sugar
        'restecg': (0, 2),  # Resting ECG
        'thalachh': (71, 202),  # Maximum heart rate
        'exng': (0, 1),  # Exercise induced angina
        'oldpeak': (0.0, 6.2),  # ST depression
        'slp': (0, 2),  # Slope
        'caa': (0, 4),  # Number of major vessels
        'thall': (0, 3)  # Thalassemia
    }
    
    success_count = 0
    for _ in range(n_samples):
        features = {}
        for feature, (min_val, max_val) in feature_ranges.items():
            if feature in ['sex', 'fbs', 'exng']:
                # Binary features
                features[feature] = np.random.randint(0, 2)
            elif feature in ['cp', 'restecg', 'slp', 'caa', 'thall']:
                # Categorical features
                features[feature] = np.random.randint(min_val, max_val + 1)
            elif feature == 'oldpeak':
                # Floating point feature
                features[feature] = round(np.random.uniform(min_val, max_val), 1)
            else:
                # Integer features
                features[feature] = np.random.randint(min_val, max_val + 1)
        
        # Generate synthetic risk score
        risk_score = np.random.random()
        risk_level = 'HIGH' if risk_score > 0.5 else 'LOW'
        
        try:
            save_prediction(features, float(risk_score), risk_level)
            success_count += 1
        except Exception as e:
            print(f"Error saving synthetic data: {str(e)}")
    
    print(f"Successfully generated and saved {success_count} synthetic records")
    return success_count

if __name__ == "__main__":
    generate_synthetic_data() 