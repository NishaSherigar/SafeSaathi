import React, { useState, useEffect } from 'react';
import { FaTaxi, FaPhone, FaMapMarkerAlt, FaClock, FaUser, FaCar, FaCheckCircle } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { MdLocationOn } from 'react-icons/md';

const EmergencyCab = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState('');
    const [cabDetails, setCabDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cabOnWay, setCabOnWay] = useState(false);
    const [cabArrived, setCabArrived] = useState(false);
    const [cabLocation, setCabLocation] = useState(null);
    const [distance, setDistance] = useState(0);
    const [timeToArrival, setTimeToArrival] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [rideCompleted, setRideCompleted] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const mockCabDetails = {
        driverName: "Arjun Verma",
        contact: "+91 9876543210",
        driverPhoto: "/cabD.jpg", // assuming images are in public folder
        carPhoto: "/cab1.jpg",    // assuming images are in public folder
        carNumber: "MH12 AB 1234",
        carModel: "Toyota Etios",
        rating: "4.8 ★",
        tripsCompleted: 247,
        fare: "₹350 (estimated)"
    };

    // Simulate getting route coordinates
    const getRouteCoordinates = (start, end) => {
        const coords = [];
        const steps = 100;
        const latStep = (end.lat - start.lat) / steps;
        const lngStep = (end.lng - start.lng) / steps;
        
        for (let i = 0; i <= steps; i++) {
            coords.push({
                lat: start.lat + (latStep * i),
                lng: start.lng + (lngStep * i)
            });
        }
        return coords;
    };

    const getUserLocationAndCab = () => {
        if (!destination) {
            alert("Please enter your destination");
            return;
        }

        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    setUserLocation({ lat: userLat, lng: userLng });
                    
                    // Simulate cab starting 2km away (approx 0.018 degrees)
                    const cabStartLocation = {
                        lat: userLat - 0.018,
                        lng: userLng - 0.018
                    };
                    
                    const route = getRouteCoordinates(cabStartLocation, { lat: userLat, lng: userLng });
                    setRouteCoordinates(route);
                    
                    setCabDetails(mockCabDetails);
                    setCabLocation(cabStartLocation);
                    setCabOnWay(true);
                    setIsLoading(false);
                    setShowConfirmation(true);
                    startCabSimulation(route);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your location. Please enable location services.");
                    setIsLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setIsLoading(false);
        }
    };

    const startCabSimulation = (route) => {
        let currentStep = 0;
        const totalDistance = 2.0; // 2km initial distance
        const totalTime = 8; // 8 minutes initial estimate
        
        const interval = setInterval(() => {
            if (currentStep >= route.length - 1) {
                clearInterval(interval);
                setCabOnWay(false);
                setCabArrived(true);
                setDistance(0);
                setTimeToArrival(0);
                return;
            }
            
            currentStep++;
            setCabLocation(route[currentStep]);
            
            // Update distance and time
            const remainingDistance = totalDistance * (1 - (currentStep / route.length));
            const remainingTime = totalTime * (1 - (currentStep / route.length));
            
            setDistance(remainingDistance.toFixed(1));
            setTimeToArrival(remainingTime.toFixed(0));
        }, 300); // Update every 300ms for smoother animation
    };

    const handleCancelRide = () => {
        setCabOnWay(false);
        setCabDetails(null);
        setUserLocation(null);
        setShowConfirmation(false);
        setDestination('');
    };

    const completeRide = () => {
        setRideCompleted(true);
        setCabArrived(false);
        setCabDetails(null);
        setUserLocation(null);
        setDestination('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-4 md:p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-purple-500 opacity-5"
                        style={{
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `pulse ${Math.random() * 10 + 5}s infinite alternate`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md">
                {rideCompleted ? (
                    <div className="text-center bg-black/40 backdrop-blur-sm border border-green-500 rounded-xl p-8 shadow-lg shadow-green-500/20">
                        <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-400 mb-2">Ride Completed!</h2>
                        <p className="text-lg mb-4">Thank you for choosing our service</p>
                        <p className="text-gray-300 mb-6">Please stay safe and don't hesitate to call us again if you need assistance</p>
                        <button
                            onClick={() => setRideCompleted(false)}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors duration-300"
                        >
                            Book Another Ride
                        </button>
                    </div>
                ) : !cabDetails ? (
                    <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg shadow-purple-500/20">
                        <div className="flex flex-col items-center">
                            <FaTaxi className="text-5xl text-cyan-400 mb-4 animate-bounce" />
                            <h3 className="text-xl font-semibold text-center mb-4">Emergency Cab Service</h3>
                            
                            <div className="w-full mb-4">
                                <label className="block text-gray-400 mb-2">Your Destination</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter destination address"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-cyan-400 focus:outline-none text-white"
                                    />
                                    <MdLocationOn className="absolute right-3 top-3 text-gray-400 text-xl" />
                                </div>
                            </div>
                            
                            <button 
                                className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 shadow-lg hover:shadow-cyan-400/50 transition-all duration-500 flex items-center justify-center gap-2"
                                onClick={getUserLocationAndCab}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Locating Nearby Cabs...
                                    </>
                                ) : (
                                    "Request Emergency Cab"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Confirmation Modal */}
                        {showConfirmation && (
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                                <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 max-w-sm w-full">
                                    <h3 className="text-xl font-bold text-cyan-400 mb-3">Cab Confirmed!</h3>
                                    <p className="text-gray-300 mb-2">Your cab to <strong>{destination}</strong> is arriving soon.</p>
                                    <p className="text-gray-400 text-sm mb-4">Driver will pick you up at your current location</p>
                                    <div className="flex gap-3">
                                        <button 
                                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                                            onClick={() => setShowConfirmation(false)}
                                        >
                                            OK
                                        </button>
                                        <button 
                                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                                            onClick={handleCancelRide}
                                        >
                                            Cancel Ride
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cab Tracking Section */}
                        <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg shadow-blue-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                                    <FaTaxi /> Ride to {destination}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    cabOnWay ? 'bg-yellow-900 text-yellow-300' : 
                                    cabArrived ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                                }`}>
                                    {cabOnWay ? 'ON THE WAY' : cabArrived ? 'ARRIVED' : 'COMPLETED'}
                                </span>
                            </div>

                            {cabOnWay && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-cyan-300">
                                            <GiPathDistance className="text-xl" />
                                            <span>Distance</span>
                                        </div>
                                        <span className="font-bold">{distance} km away</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-purple-300">
                                            <FaClock className="text-lg" />
                                            <span>Estimated Time</span>
                                        </div>
                                        <span className="font-bold">{timeToArrival} min</span>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                                                style={{ width: `${100 - (distance / 2 * 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Driver en route</span>
                                            <span>Approaching</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {cabArrived && (
                                <div className="text-center py-4">
                                    <div className="text-green-400 text-lg font-bold mb-2 flex items-center justify-center gap-2">
                                        <FaCheckCircle className="text-xl" /> Your cab has arrived!
                                    </div>
                                    <p className="text-gray-400 mb-4">Please meet your driver at your pickup location</p>
                                    <button
                                        onClick={completeRide}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors duration-300"
                                    >
                                        I'm in the Cab - Start Ride
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Map Section */}
                        {userLocation && (
                            <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20">
                                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-red-400" />
                                        <span className="font-medium">Live Tracking</span>
                                    </div>
                                    <div className="text-sm text-gray-400">To: {destination}</div>
                                </div>
                                <img 
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${userLocation.lat},${userLocation.lng}&zoom=14&size=400x300&markers=color:red%7C${userLocation.lat},${userLocation.lng}&markers=color:blue%7C${cabLocation?.lat},${cabLocation?.lng}&path=color:0x00a1ff|weight:4|${routeCoordinates.map(coord => `${coord.lat},${coord.lng}`).join('|')}&key=AIzaSyCVNyLcK1zpOaRyuq3llW6s2zPVLsLmhQg`} 
                                    alt="Live Cab Tracking"
                                    className="w-full" 
                                />
                                <div className="p-4 text-sm text-gray-400 flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span>Your location</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span>Cab location</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Driver Details */}
                        {cabDetails && (cabOnWay || cabArrived) && (
                            <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg shadow-cyan-500/20">
                                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                    <FaUser /> Driver Details
                                </h3>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={cabDetails.driverPhoto} 
                                        alt="Driver" 
                                        className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-md" 
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                                        }}
                                    />
                                    <div>
                                        <h4 className="text-lg font-bold">{cabDetails.driverName}</h4>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FaPhone className="text-sm" />
                                            <span>{cabDetails.contact}</span>
                                        </div>
                                        <div className="text-yellow-400 text-sm mt-1">{cabDetails.rating} ({cabDetails.tripsCompleted} trips)</div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <h4 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2">
                                        <FaCar /> Vehicle Details
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={cabDetails.carPhoto} 
                                            alt="Car" 
                                            className="w-24 h-16 object-contain border border-gray-600 rounded-lg"
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = "https://cdn-icons-png.flaticon.com/512/3073/3073626.png";
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium">{cabDetails.carModel}</p>
                                            <p className="text-gray-400">Plate: {cabDetails.carNumber}</p>
                                            <p className="text-gray-400 mt-1">{cabDetails.fare}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {cabOnWay && (
                                    <button
                                        onClick={handleCancelRide}
                                        className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors duration-300"
                                    >
                                        Cancel Ride
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyCab;