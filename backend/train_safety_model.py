import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

# Load the CSV data
csv_path = os.path.join(os.path.dirname(__file__), 'borivali_dahisar_safety_routes_updated.csv')
df = pd.read_csv(csv_path)

print("Data shape:", df.shape)
print("Columns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

# Calculate Safety Score based on features
# Lower crime = higher safety, better road condition = higher safety, etc.
def calculate_safety_score(row):
    score = 0
    
    # Crime reports (inverse - lower crime is safer)
    crime_score = 1 - (min(row['Crime Reports Count'], 50) / 50)  # Normalize to 0-1
    
    # Streetlights
    streetlight_score = 1 if row['Streetlights'] == 'Yes' else 0
    
    # CCTV Presence
    cctv_score = 1 if row['CCTV Presence'] == 'Yes' else 0
    
    # Road Condition Score
    road_score = row['Road Condition Score'] / 5  # Normalize to 0-1
    
    # Police distance (inverse - closer is better)
    police_score = 1 - (min(row['Police Stations Nearby (km)'], 5) / 5)
    
    # Pedestrian Friendly
    pedestrian_score = 1 if row['Pedestrian Friendly'] == 'Yes' else 0
    
    # Slum Area (inverse - non-slum is safer)
    slum_score = 0 if row['Slum Area'] == 'Yes' else 1
    
    # Traffic Density (inverse - lower traffic is safer)
    traffic_map = {'Low': 1, 'Medium': 0.5, 'High': 0}
    traffic_score = traffic_map.get(row['Traffic Density'], 0.5)
    
    # Calculate weighted safety score
    safety_score = (
        crime_score * 0.25 +
        streetlight_score * 0.15 +
        cctv_score * 0.15 +
        road_score * 0.15 +
        police_score * 0.15 +
        pedestrian_score * 0.1 +
        slum_score * 0.05 +
        traffic_score * 0.0
    )
    
    return min(1.0, max(0.0, safety_score))

# Add safety score column
df['Safety_Score'] = df.apply(calculate_safety_score, axis=1)

print("\nSafety Score Statistics:")
print(df['Safety_Score'].describe())
print("\nSample areas with safety scores:")
print(df[['Area Name', 'Crime Reports Count', 'Safety_Score']].head(15))

# Prepare features for ML model
# Encode categorical variables
le_streetlights = LabelEncoder()
le_cctv = LabelEncoder()
le_slum = LabelEncoder()
le_pedestrian = LabelEncoder()
le_traffic = LabelEncoder()

df['Streetlights_encoded'] = le_streetlights.fit_transform(df['Streetlights'])
df['CCTV_encoded'] = le_cctv.fit_transform(df['CCTV Presence'])
df['Slum_encoded'] = le_slum.fit_transform(df['Slum Area'])
df['Pedestrian_encoded'] = le_pedestrian.fit_transform(df['Pedestrian Friendly'])
df['Traffic_encoded'] = le_traffic.fit_transform(df['Traffic Density'])

# Select features for model
feature_columns = [
    'Latitude',
    'Longitude',
    'Streetlights_encoded',
    'CCTV_encoded',
    'Police Stations Nearby (km)',
    'Slum_encoded',
    'Road Condition Score',
    'Crime Reports Count',
    'Pedestrian_encoded',
    'Traffic_encoded',
    'Emergency Services Nearby (km)',
    'Distance from Borivali (km)'
]

X = df[feature_columns].fillna(0)
y = df['Safety_Score']

# Train Random Forest model
print("\nTraining Safety Score Prediction Model...")
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X, y)

# Calculate feature importance
feature_importance = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

# Save model and scaler
model_path = os.path.join(os.path.dirname(__file__), 'safety_model.pkl')
scaler = StandardScaler()
scaler.fit(X)

model_data = {
    'model': model,
    'scaler': scaler,
    'feature_columns': feature_columns,
    'encoders': {
        'streetlights': le_streetlights,
        'cctv': le_cctv,
        'slum': le_slum,
        'pedestrian': le_pedestrian,
        'traffic': le_traffic
    }
}

with open(model_path, 'wb') as f:
    pickle.dump(model_data, f)

print(f"\nModel saved to {model_path}")

# Save feature importance
feature_importance.to_csv(os.path.join(os.path.dirname(__file__), 'safety_models', 'feature_importance.csv'), index=False)
print("Feature importance saved!")

# Save processed data for reference
df.to_csv(os.path.join(os.path.dirname(__file__), 'borivali_dahisar_with_scores.csv'), index=False)
print("Processed data saved!")

print("\nModel training complete!")
