import os
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

# ======================
# 1. SETUP
# ======================
os.makedirs("safety_models", exist_ok=True)

# ======================
# 2. DATA PREPROCESSING
# ======================
def preprocess_data(df):
    """Convert raw data into ML-ready features"""
    
    # Encode categorical features
    encoders = {}
    cat_cols = ["Time of Day", "Location Type", "Transport Mode", "Crime Rate", 
                "Streetlights", "CCTV Presence", "Police Presence", "Area Risk Level", "Escape Route Availability"]
    
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
    
    # Target encoding (Safety Plan)
    plan_encoder = LabelEncoder()
    df['Plan_Encoded'] = plan_encoder.fit_transform(df['Safety Plan'])
    
    return df, encoders, plan_encoder

# ======================
# 3. MODEL TRAINING
# ======================
def train_model(X_train, y_train, X_val, y_val):
    """Trains DecisionTree model with best hyperparameters"""
    
    model = DecisionTreeClassifier(max_depth=5, min_samples_split=5, random_state=42)
    model.fit(X_train, y_train)
    
    val_pred = model.predict(X_val)
    acc = accuracy_score(y_val, val_pred)
    print(f"Validation Accuracy: {acc:.4f}")
    
    return model

# ======================
# 4. MAIN EXECUTION
# ======================
if __name__ == "__main__":
    try:
        # Load data
        df = pd.read_csv("AI_Safety_Plan_Dataset.csv")  # Ensure the correct filename
        
        # Preprocess
        df, encoders, plan_encoder = preprocess_data(df)
        
        # Prepare features/target
        features = ["Time of Day", "Location Type", "Transport Mode", "Crime Rate", 
                    "Streetlights", "CCTV Presence", "Police Presence", "Area Risk Level", "Escape Route Availability"]
        X = df[features]
        y = df['Plan_Encoded']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
        
        # Train model
        print("🚀 Training model...")
        model = train_model(X_train, y_train, X_test, y_test)
        
        # Save model
        model_artifacts = {
            'model': model,
            'encoders': encoders,
            'plan_encoder': plan_encoder,
            'features': features
        }
        joblib.dump(model_artifacts, "safety_models/final_model.pkl")
        
        # Save feature importance
        pd.DataFrame({
            'Feature': features,
            'Importance': model.feature_importances_
        }).to_csv("safety_models/feature_importance.csv", index=False)
        
        # Evaluation
        print("\n📊 Final Evaluation:")
        y_pred = model.predict(X_test)
        print(classification_report(y_test, y_pred, target_names=plan_encoder.classes_))
        
        print("\n✅ Training complete! Model saved in safety_models/")
    
    except Exception as e:
        print(f"❌ Critical error: {str(e)}")
