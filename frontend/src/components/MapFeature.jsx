import React, { useEffect, useState } from 'react';
import './MapFeature.css';

const MapFeature = () => {
    const [map, setMap] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderers, setDirectionsRenderers] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    useEffect(() => {
        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const initMap = () => {
        const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
            center: { lat: 19.2068, lng: 72.8521 },
            zoom: 12,
            mapTypeControl: true,
            streetViewControl: false
        });

        setMap(mapInstance);
        setDirectionsService(new window.google.maps.DirectionsService());

        // Initialize autocomplete
        const sourceInput = document.getElementById('source');
        const destinationInput = document.getElementById('destination');

        new window.google.maps.places.Autocomplete(sourceInput, {
            fields: ["geometry", "name"]
        });

        new window.google.maps.places.Autocomplete(destinationInput, {
            fields: ["geometry", "name"]
        });
    };

    const findRoutes = async () => {
        try {
            clearMap();

            if (!source || !destination) {
                alert("Please enter both starting point and destination");
                return;
            }

            const sourceCoords = await getCoordinates(source);
            const destCoords = await getCoordinates(destination);

            addMarker(sourceCoords, "Start", "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
            addMarker(destCoords, "End", "http://maps.google.com/mapfiles/ms/icons/red-dot.png");

            const request = {
                origin: sourceCoords,
                destination: destCoords,
                travelMode: window.google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true
            };

            directionsService.route(request, (response, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    const newRenderers = response.routes.map((route, index) => {
                        return new window.google.maps.DirectionsRenderer({
                            map: map,
                            directions: response,
                            routeIndex: index,
                            polylineOptions: { strokeColor: index === 0 ? "blue" : "gray" }
                        });
                    });
                    setDirectionsRenderers(newRenderers);
                } else {
                    alert("Could not find a route: " + status);
                }
            });
        } catch (error) {
            console.error("Error finding routes:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const addMarker = (position, title, icon) => {
        const marker = new window.google.maps.Marker({
            position,
            map,
            title,
            icon
        });
        setMarkers(prev => [...prev, marker]);
    };

    const clearMap = () => {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
        directionsRenderers.forEach(renderer => renderer.setMap(null));
        setDirectionsRenderers([]);
    };

    const getCoordinates = (place) => {
        return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: place }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(results[0].geometry.location);
                } else {
                    reject("Geocode was not successful: " + status);
                }
            });
        });
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
                        required
                    />
                </div>
                <button onClick={findRoutes}>Find Safe Routes</button>
            </div>
            <div id="map"></div>
            <div id="routes-container"></div>
        </div>
    );
};

export default MapFeature; 