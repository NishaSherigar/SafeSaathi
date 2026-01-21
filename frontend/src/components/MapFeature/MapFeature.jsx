import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapFeature.css';

const MapFeature = () => {
    const [map, setMap] = useState(null);
    const [routeLayer, setRouteLayer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const routeLayerRef = useRef(null);

    useEffect(() => {
        // Initialize map
        if (!mapRef.current) {
            const mapInstance = L.map('map').setView([19.2359, 72.8521], 15); // Center on Eksar
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);
            
            mapRef.current = mapInstance;
            setMap(mapInstance);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const getRouteFromOSRM = async (coordinates, waypoints) => {
        try {
            if (waypoints && waypoints.length > 1) {
                let fullRoute = [];
                
                const waypointCoords = waypoints.map(point => {
                    const coord = coordinates.find(c => c.location === point);
                    return coord ? [coord.longitude, coord.latitude] : null;
                }).filter(coord => coord !== null);

                for (let i = 0; i < waypointCoords.length - 1; i++) {
                    const start = waypointCoords[i];
                    const end = waypointCoords[i + 1];
                    const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
                    
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                        const segmentCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        fullRoute = fullRoute.concat(segmentCoords);
                    }
                }
                return fullRoute;
            }
            return null;
        } catch (error) {
            console.error('Error fetching route:', error);
            return null;
        }
    };

    const findRoutes = async () => {
        if (!source || !destination) {
            setError('Please enter both source and destination');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('source', source);
            formData.append('destination', destination);

            // Update the URL to point to your FastAPI backend
            const response = await fetch('http://localhost:8000/get_routes/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            
            if (data.routes && data.routes.length > 0) {
                setRoutes(data.routes);
                await displayRoutes(data.routes);
            } else {
                setError('No routes found for the given source and destination');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error finding routes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const displayRoutes = async (routes) => {
        if (!mapRef.current) return;
        
        // Clear existing routes
        if (routeLayerRef.current) {
            mapRef.current.removeLayer(routeLayerRef.current);
        }
        
        const newRouteLayer = L.layerGroup().addTo(mapRef.current);
        routeLayerRef.current = newRouteLayer;
        setRouteLayer(newRouteLayer);

        // Sort routes by safety score
        const sortedRoutes = [...routes].sort((a, b) => b.safety_score - a.safety_score);
        const bestRoute = sortedRoutes[0];

        // Create route options display
        const routesContainer = document.getElementById('routes-container');
        routesContainer.innerHTML = '';

        for (const route of sortedRoutes) {
            const isBestRoute = route === bestRoute;
            const routeDiv = document.createElement('div');
            routeDiv.className = 'route-option';
            
            // Add route header with icon
            const icon = isBestRoute ? '🌟' : '🔸';
            routeDiv.innerHTML = `
                <h3>${icon} Route Option #${sortedRoutes.indexOf(route) + 1}: ${route.path}</h3>
                <ul>
                    <li>Total Distance: ${route.distance.toFixed(1)} km</li>
                    <li>Safety Score: ${(route.safety_score * 100).toFixed(0)}% (${route.safety_level})</li>
                    <li>Total Crime Reports: ${route.crime_reports}</li>
                    <li>Avg Police Distance: ${route.police_distance.toFixed(1)} km</li>
                    <li>CCTV Cameras: ${route.cctv_count}</li>
                </ul>
                <p class="safety-warning">⚠️ ${route.safety_tip}</p>
            `;
            routesContainer.appendChild(routeDiv);

            // Get waypoints from the route path
            const waypoints = route.path.split(' -> ').map(p => p.trim());
            
            // Get actual street route using OSRM
            const streetRoute = await getRouteFromOSRM(route.coordinates, waypoints);

            if (streetRoute && streetRoute.length > 0) {
                // Draw route line with color based on safety score
                const color = isBestRoute ? '#28a745' : '#dc3545'; // Green for best route, red for others
                
                // Add offset to prevent overlap
                const offset = isBestRoute ? 0.0001 : -0.0001; // Offset less safe routes slightly to the left
                const offsetRoute = streetRoute.map(coord => [coord[0] + offset, coord[1] + offset]);
                
                const routeLine = L.polyline(offsetRoute, {
                    color: color,
                    weight: isBestRoute ? 5 : 4, // Make best route slightly thicker
                    opacity: isBestRoute ? 1 : 0.8,
                    zIndex: isBestRoute ? 1000 : 1 // Make best route appear on top
                }).addTo(newRouteLayer);

                // Add route popup
                const popupContent = `
                    <div class="route-popup">
                        <h3>${isBestRoute ? '✅ Safest Route' : '⚠️ Less Safe Route'}</h3>
                        <p><strong>Path:</strong> ${route.path}</p>
                        <p><strong>Safety Score:</strong> ${(route.safety_score * 100).toFixed(0)}%</p>
                        <p><strong>Distance:</strong> ${route.distance.toFixed(1)} km</p>
                        <p><strong>Crime Reports:</strong> ${route.crime_reports}</p>
                        <p><strong>CCTV Cameras:</strong> ${route.cctv_count}</p>
                        <p class="safety-tip">${route.safety_tip}</p>
                    </div>
                `;
                routeLine.bindPopup(popupContent);

                // Show popup on hover
                routeLine.on('mouseover', function(e) {
                    this.openPopup(e.latlng);
                });

                // Add markers for waypoints
                waypoints.forEach((waypoint, idx) => {
                    const waypointData = route.coordinates.find(coord => coord.location === waypoint);
                    if (waypointData) {
                        const markerColor = isBestRoute ? '#28a745' : '#dc3545';
                        const icon = L.divIcon({
                            className: 'custom-marker',
                            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                            iconSize: [12, 12]
                        });

                        const marker = L.marker([waypointData.latitude, waypointData.longitude], { icon }).addTo(newRouteLayer);
                        
                        // Add waypoint popup
                        const waypointType = idx === 0 ? 'Start' : (idx === waypoints.length - 1 ? 'End' : 'Via');
                        marker.bindPopup(`
                            <div class="route-popup">
                                <h3>${isBestRoute ? '✅' : '⚠️'} ${waypointType} Point: ${waypoint}</h3>
                                <p><strong>Route Type:</strong> ${isBestRoute ? 'Safest Route' : 'Less Safe Route'}</p>
                                <p><strong>Safety Score:</strong> ${(route.safety_score * 100).toFixed(0)}%</p>
                            </div>
                        `);
                    }
                });
            }
        }

        // Add general safety tip
        const generalTip = document.createElement('div');
        generalTip.className = 'general-tip';
        generalTip.innerHTML = `
            <p>🚸 General Safety Tip: Always stay alert and avoid distractions like phone use while walking</p>
            <div class="best-route">
                <p>🌟 BEST ROUTE RECOMMENDATION: Option #1 (Safety Score: ${(bestRoute.safety_score * 100).toFixed(0)}%)</p>
                <p>Path: ${bestRoute.path}</p>
                <p>✅ Safe travels! Remember to stay aware of your surroundings.</p>
            </div>
        `;
        routesContainer.appendChild(generalTip);

        // Fit map to show all routes
        if (sortedRoutes.length > 0) {
            const allCoords = sortedRoutes.flatMap(route => 
                route.coordinates.map(coord => [coord.latitude, coord.longitude])
            );
            mapRef.current.fitBounds(allCoords);
        }
    };

    return (
        <div className="container">
            <h1>Safety Route Planner</h1>
            <div className="route-form">
                <div className="form-group">
                    <label htmlFor="source">Source Location:</label>
                    <input
                        type="text"
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="Enter source location (e.g., Eksar)"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="destination">Destination:</label>
                    <input
                        type="text"
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter destination (e.g., Mandapeshwar)"
                        required
                    />
                </div>
                <button onClick={findRoutes} disabled={loading}>
                    {loading ? 'Finding Routes...' : 'Find Safe Routes'}
                </button>
                {error && <div className="error-message">{error}</div>}
            </div>
            <div id="map"></div>
            <div id="routes-container"></div>
        </div>
    );
};

export default MapFeature; 