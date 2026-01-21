import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 19.0760,  // Default location (Mumbai)
    lng: 72.8777,
};

// Array of colors for different routes
const routeColors = [
    "#4285F4", // Google Blue
    "#EA4335", // Google Red
    "#FBBC05", // Google Yellow
    "#34A853", // Google Green
    "#9334E6", // Purple
    "#FF6B6B", // Coral
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
];

const MapComponent = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [directions, setDirections] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [routeRenderers, setRouteRenderers] = useState([]);
    
    const sourceRef = useRef(null);
    const destinationRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(userCoords);
                    setMapCenter(userCoords);
                },
                (error) => console.error("Error getting user location:", error)
            );
        }
    }, []);

    const handlePlaceSelect = (type) => {
        const place = type === "source" ? sourceRef.current.getPlace() : destinationRef.current.getPlace();
        if (place.geometry) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };

            if (type === "source") {
                setSource(place.name);
            } else {
                setDestination(place.name);
            }

            setMapCenter(location);
        }
    };

    const findRoutes = async () => {
        if (!source || !destination) {
            alert("Please select both source and destination!");
            return;
        }

        const service = new window.google.maps.DirectionsService();
        setDirectionsService(service);

        const request = {
            origin: source,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        };

        try {
            const result = await service.route(request);
            setDirections(result);
            setSelectedRouteIndex(0);

            // Clear existing route renderers
            routeRenderers.forEach(renderer => renderer.setMap(null));
            
            // Create new renderers for each route
            const newRenderers = result.routes.map((route, index) => {
                const renderer = new window.google.maps.DirectionsRenderer({
                    directions: { routes: [route] },
                    map: mapRef.current,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: routeColors[index % routeColors.length],
                        strokeWeight: 5,
                        strokeOpacity: 0.8
                    }
                });
                return renderer;
            });

            setRouteRenderers(newRenderers);
        } catch (error) {
            console.error("Error finding routes:", error);
            alert("Could not find routes. Please try again.");
        }
    };

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    return (
        <div className="text-center p-5">
            <h1 className="text-2xl font-bold mb-4">Safe Route Finder</h1>

            <LoadScript googleMapsApiKey="AIzaSyCVNyLcK1zpOaRyuq3llW6s2zPVLsLmhQg" libraries={["places"]}>
                <div className="mb-4 flex justify-center space-x-4">
                    <Autocomplete onLoad={(auto) => (sourceRef.current = auto)} onPlaceChanged={() => handlePlaceSelect("source")}>
                        <input
                            type="text"
                            placeholder="Enter Source..."
                            className="p-2 border rounded w-60"
                        />
                    </Autocomplete>

                    <Autocomplete onLoad={(auto) => (destinationRef.current = auto)} onPlaceChanged={() => handlePlaceSelect("destination")}>
                        <input
                            type="text"
                            placeholder="Enter Destination..."
                            className="p-2 border rounded w-60"
                        />
                    </Autocomplete>

                    <button onClick={findRoutes} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Find Routes
                    </button>
                </div>

                <GoogleMap 
                    mapContainerStyle={containerStyle} 
                    center={mapCenter} 
                    zoom={13}
                    onLoad={onMapLoad}
                >
                    {userLocation && (
                        <Marker 
                            position={userLocation} 
                            label="You"
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            }}
                        />
                    )}
                </GoogleMap>

                {directions && (
                    <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {directions.routes.map((route, index) => (
                                <div 
                                    key={index}
                                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                                        selectedRouteIndex === index 
                                            ? 'bg-blue-100 border-2 border-blue-500' 
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedRouteIndex(index)}
                                    style={{ borderLeft: `4px solid ${routeColors[index % routeColors.length]}` }}
                                >
                                    <h3 className="font-semibold">Route {index + 1}</h3>
                                    <p>Distance: {route.legs[0].distance.text}</p>
                                    <p>Duration: {route.legs[0].duration.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </LoadScript>
        </div>
    );
};

export default MapComponent;
