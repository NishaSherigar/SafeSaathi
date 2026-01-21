from fastapi import FastAPI, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import pickle
import numpy as np
import pandas as pd
import os
from typing import List, Dict
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and route data on startup
@app.on_event("startup")
def load_assets():
    try:
        # Load model
        model_path = os.path.join(os.path.dirname(__file__), 'safety_model.pkl')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
                app.state.model = model_data.get('model')
                app.state.scaler = model_data.get('scaler')
                app.state.feature_columns = model_data.get('feature_columns')
                app.state.encoders = model_data.get('encoders')
            print("Model loaded successfully")
        else:
            print("Model file not found - proceeding without model")
        
        # Load route data
        routes_path = os.path.join(os.path.dirname(__file__), 'borivali_dahisar_safety_routes_updated.csv')
        if os.path.exists(routes_path):
            app.state.routes_df = pd.read_csv(routes_path)
            print(f"Loaded {len(app.state.routes_df)} route locations")
        else:
            print("Routes file not found - proceeding without routes")
        
        print("Assets loaded successfully")
    except Exception as e:
        print(f"Error loading assets: {e}")

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}

def calculate_route_safety(source_name, destination_name, df, model, scaler, feature_columns, encoders):
    """Calculate routes between source and destination with safety scores"""
    
    # Find source and destination in data
    source_rows = df[df['Area Name'].str.lower() == source_name.lower()]
    dest_rows = df[df['Area Name'].str.lower() == destination_name.lower()]
    
    if source_rows.empty or dest_rows.empty:
        return None
    
    source = source_rows.iloc[0]
    destination = dest_rows.iloc[0]
    
    # Get all areas for possible routes
    all_areas = df.copy()
    
    # Encode categorical features
    all_areas['Streetlights_encoded'] = encoders['streetlights'].transform(all_areas['Streetlights'])
    all_areas['CCTV_encoded'] = encoders['cctv'].transform(all_areas['CCTV Presence'])
    all_areas['Slum_encoded'] = encoders['slum'].transform(all_areas['Slum Area'])
    all_areas['Pedestrian_encoded'] = encoders['pedestrian'].transform(all_areas['Pedestrian Friendly'])
    all_areas['Traffic_encoded'] = encoders['traffic'].transform(all_areas['Traffic Density'])
    
    # Calculate distances to all areas
    all_areas['dist_from_source'] = np.sqrt(
        (all_areas['Latitude'] - source['Latitude'])**2 + 
        (all_areas['Longitude'] - source['Longitude'])**2
    )
    
    all_areas['dist_to_dest'] = np.sqrt(
        (all_areas['Latitude'] - destination['Latitude'])**2 + 
        (all_areas['Longitude'] - destination['Longitude'])**2
    )
    
    # Generate possible routes
    routes = []
    
    # Route 1: Direct route
    route1_areas = [source, destination]
    
    # Route 2: Via closest intermediate safe point
    intermediate = all_areas[
        (all_areas['Area Name'] != source['Area Name']) & 
        (all_areas['Area Name'] != destination['Area Name'])
    ].nsmallest(1, 'dist_from_source')
    
    if not intermediate.empty:
        route2_areas = [source, intermediate.iloc[0], destination]
    else:
        route2_areas = [source, destination]
    
    # Route 3: Via safest point
    # Predict safety scores for all areas
    X_all = all_areas[feature_columns].fillna(0)
    X_scaled = scaler.transform(X_all)
    all_areas['predicted_safety'] = model.predict(X_scaled)
    
    safest = all_areas[
        (all_areas['Area Name'] != source['Area Name']) & 
        (all_areas['Area Name'] != destination['Area Name'])
    ].nlargest(1, 'predicted_safety')
    
    if not safest.empty:
        route3_areas = [source, safest.iloc[0], destination]
    else:
        route3_areas = [source, destination]
    
    # Convert areas to route info
    def area_to_coords(area):
        return {
            "location": area['Area Name'],
            "latitude": float(area['Latitude']),
            "longitude": float(area['Longitude'])
        }
    
    def calculate_route_stats(areas):
        total_distance = 0
        crime_count = 0
        cctv_count = 0
        police_dist = 0
        safety_scores = []
        
        for i in range(len(areas) - 1):
            area1 = areas[i]
            area2 = areas[i + 1]
            
            # Simple distance calculation
            dist = np.sqrt(
                (area2['Latitude'] - area1['Latitude'])**2 + 
                (area2['Longitude'] - area1['Longitude'])**2
            ) * 111  # Rough conversion to km
            total_distance += dist
            
            # Aggregate stats
            crime_count += int(area1['Crime Reports Count'])
            cctv_count += 1 if area1['CCTV Presence'] == 'Yes' else 0
            police_dist += area1['Police Stations Nearby (km)']
        
        # Final area stats
        crime_count += int(areas[-1]['Crime Reports Count'])
        cctv_count += 1 if areas[-1]['CCTV Presence'] == 'Yes' else 0
        police_dist += areas[-1]['Police Stations Nearby (km)']
        
        # Calculate average safety score
        X_route = all_areas[all_areas['Area Name'].isin([a['Area Name'] for a in areas])][feature_columns].fillna(0)
        if len(X_route) > 0:
            X_scaled = scaler.transform(X_route)
            avg_safety = float(model.predict(X_scaled).mean())
        else:
            avg_safety = 0.5
        
        return {
            'distance': total_distance,
            'crime_reports': crime_count,
            'cctv_count': cctv_count,
            'police_distance': police_dist / len(areas),
            'safety_score': avg_safety
        }
    
    # Build route objects
    for idx, areas in enumerate([route1_areas, route2_areas, route3_areas], 1):
        coords = [area_to_coords(a) for a in areas]
        path = " -> ".join([a['Area Name'] for a in areas])
        stats = calculate_route_stats(areas)
        
        # Determine safety level
        if stats['safety_score'] > 0.65:
            safety_level = "Safe (Green)"
        elif stats['safety_score'] > 0.45:
            safety_level = "Moderate (Yellow)"
        else:
            safety_level = "Risky (Red)"
        
        route = {
            "path": path,
            "distance": round(stats['distance'], 1),
            "safety_score": round(stats['safety_score'], 2),
            "safety_level": safety_level,
            "crime_reports": int(stats['crime_reports']),
            "police_distance": round(stats['police_distance'], 1),
            "cctv_count": int(stats['cctv_count']),
            "is_best_route": idx == 1,  # First route is best by default
            "safety_tip": generate_tip(stats['safety_score']),
            "coordinates": coords
        }
        routes.append(route)
    
    # Sort by safety score
    routes.sort(key=lambda x: x['safety_score'], reverse=True)
    
    # Mark the best route
    for i, route in enumerate(routes):
        route['is_best_route'] = (i == 0)
    
    return routes

def generate_tip(safety_score):
    if safety_score > 0.7:
        return "This is a safe route with good infrastructure and lighting."
    elif safety_score > 0.5:
        return "This route is relatively safe. Stay alert and avoid distractions."
    else:
        return "This route has some safety concerns. Consider using the recommended route or traveling with others."

@app.post("/get_routes/")
async def get_routes(source: str = Form(...), destination: str = Form(...)):
    try:
        if not hasattr(app.state, 'model') or not hasattr(app.state, 'routes_df'):
            raise HTTPException(status_code=500, detail="Model or data not loaded")
        
        routes = calculate_route_safety(
            source, 
            destination, 
            app.state.routes_df,
            app.state.model,
            app.state.scaler,
            app.state.feature_columns,
            app.state.encoders
        )
        
        if routes is None:
            return JSONResponse(content={
                "routes": [],
                "message": "No routes found for the given source and destination"
            })
        
        return JSONResponse(content={"routes": routes})
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

