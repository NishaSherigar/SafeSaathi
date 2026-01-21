from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime
from flask_cors import CORS

# Create Flask application instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    model_artifacts = joblib.load("safety_models/final_model.pkl")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request
        input_data = request.json
        
        # Validate required fields
        required_fields = [
            'Time of Day', 'Location Type', 'Transport Mode', 
            'Crime Rate', 'Streetlights', 'CCTV Presence',
            'Police Presence', 'Area Risk Level', 'Escape Route Availability'
        ]
        
        for field in required_fields:
            if field not in input_data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Set default user if not provided
        if 'User' not in input_data:
            input_data['User'] = 'Anonymous'
        
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Preprocess time of day
        if ':' in input_data['Time of Day']:
            # Handle time format (e.g., "20:00")
            input_df['Hour'] = input_df['Time of Day'].apply(lambda x: int(x.split(':')[0]))
        else:
            # Handle time of day labels (e.g., "Evening")
            time_mapping = {
                'Morning': 8,
                'Afternoon': 14,
                'Evening': 18,
                'Night': 22
            }
            input_df['Hour'] = input_df['Time of Day'].map(time_mapping)
            
        input_df['Is_Night'] = input_df['Hour'].apply(lambda x: 1 if x >= 20 or x <= 5 else 0)
        
        # Encode categorical features
        for col in ['User', 'Location Type', 'Transport Mode', 'Crime Rate', 
                   'Streetlights', 'CCTV Presence', 'Police Presence', 
                   'Area Risk Level', 'Escape Route Availability']:
            if col in model_artifacts['encoders']:
                le = model_artifacts['encoders'][col]
                input_df[col] = le.transform(input_df[col])
        
        # Predict
        features = model_artifacts['features']
        prediction = model_artifacts['model'].predict(input_df[features])
        safety_plan = model_artifacts['plan_encoder'].inverse_transform(prediction)[0]
        
        return jsonify({
            'status': 'success',
            'safety_plan': safety_plan,
            'input_data': input_data
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/')
def home():
    return "AI Safety Plan API is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)