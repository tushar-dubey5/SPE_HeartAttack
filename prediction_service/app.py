from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
from dotenv import load_dotenv
from database import save_prediction, get_training_data
from model_retraining import retrain_model

load_dotenv()

app = Flask(__name__)
CORS(app)

def load_model():
    model_path = os.getenv('MODEL_PATH')
    scaler_path = model_path.replace('heart_attack_model', 'scaler')
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
    return model, scaler

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features in the correct order
        features = [
            data['age'], data['sex'], data['cp'],
            data['trtbps'], data['chol'], data['fbs'],
            data['restecg'], data['thalachh'], data['exng'],
            data['oldpeak'], data['slp'], data['caa'],
            data['thall']
        ]
        
        # Load model and scaler
        model, scaler = load_model()
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Make prediction
        risk_score = float(model.predict_proba(features_scaled)[0][1])  # Get probability of class 1
        risk_level = 'HIGH' if risk_score > 0.5 else 'LOW'
        
        # Save prediction to database
        saved_prediction = save_prediction(data, risk_score, risk_level)
        
        return jsonify({
            'id': saved_prediction.id,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'timestamp': saved_prediction.timestamp.isoformat()
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 400

@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        success, model_path = retrain_model()
        if not success:
            return jsonify({'error': 'Model retraining failed'}), 500
            
        return jsonify({
            'message': 'Model retrained successfully',
            'model_path': model_path
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 