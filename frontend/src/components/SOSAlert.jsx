import React, { useState, useEffect } from "react";
import { 
  FaExclamationTriangle, 
  FaPhone, 
  FaWhatsapp,
  FaSms,
  FaMapMarkerAlt,
  FaUserPlus,
  FaCheck,
  FaTimes,
  FaMap
} from "react-icons/fa";
import { MdLocationOn, MdSms, MdWhatsapp } from "react-icons/md";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const SOSAlert = () => {
    const [sosActivated, setSosActivated] = useState(false);
    const [location, setLocation] = useState(null);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [newContact, setNewContact] = useState("");
    const [messagesSent, setMessagesSent] = useState([]);
    const [countdown, setCountdown] = useState(5);
    const [showSimulation, setShowSimulation] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedMethods, setSelectedMethods] = useState({
        whatsapp: true,
        sms: false
    });

    // Replace with your actual Google Maps API key
    const GOOGLE_MAPS_API_KEY = "AIzaSyCVNyLcK1zpOaRyuq3llW6s2zPVLsLmhQg";

    const mapContainerStyle = {
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        border: '2px solid #ef4444'
    };

    useEffect(() => {
        if (sosActivated) {
            getLocation();
            const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [sosActivated, countdown]);

    useEffect(() => {
        if (countdown === 0 && sosActivated) {
            sendSOSMessage();
            triggerEmergencyCall();
            setShowSimulation(true);
        }
    }, [countdown, sosActivated]);

    // Get User Location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        mapLink: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
                    };
                    setLocation(userLocation);
                },
                (error) => {
                    const simulatedLocation = {
                        lat: 28.6139,
                        lng: 77.2090,
                        mapLink: "https://www.google.com/maps?q=28.6139,77.2090"
                    };
                    setLocation(simulatedLocation);
                }
            );
        } else {
            const simulatedLocation = {
                lat: 28.6139,
                lng: 77.2090,
                mapLink: "https://www.google.com/maps?q=28.6139,77.2090"
            };
            setLocation(simulatedLocation);
        }
    };

    // Generate emergency message
    const generateEmergencyMessage = () => {
        if (!location) return "🚨 EMERGENCY! I need immediate help!";
        return `🚨 EMERGENCY! I need immediate help! My live location: ${location.mapLink}`;
    };

    // Open WhatsApp with pre-filled message
    const openWhatsApp = (contact) => {
        const message = generateEmergencyMessage();
        const whatsappUrl = `https://wa.me/${contact}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Simulate SMS/WhatsApp sending
    const sendSOSMessage = async () => {
        if (emergencyContacts.length === 0) {
            alert("No emergency contacts added!");
            return;
        }

        if (!location) {
            alert("Location not available!");
            return;
        }

        const sentMessages = [];
        const message = generateEmergencyMessage();
        
        // Simulate sending to each emergency contact
        for (const contact of emergencyContacts) {
            if (selectedMethods.sms) {
                // Simulate SMS (static)
                sentMessages.push({
                    contact,
                    method: 'sms',
                    success: true,
                    simulated: true,
                    message
                });
            }

            if (selectedMethods.whatsapp) {
                // For WhatsApp we'll just prepare the data but not actually send
                sentMessages.push({
                    contact,
                    method: 'whatsapp',
                    success: true,
                    simulated: false, // This will be handled by opening WhatsApp
                    message
                });
            }
        }

        setMessagesSent(sentMessages);
        console.log("Emergency messages prepared:", sentMessages);
    };

    // Trigger Calls to Emergency Contacts
    const triggerEmergencyCall = () => {
        if (emergencyContacts.length > 0) {
            console.log(`Simulating call to: ${emergencyContacts[0]}`);
        }
    };

    // Add New Emergency Contact
    const addEmergencyContact = () => {
        const phoneRegex = /^[0-9]{10,12}$/;
        if (newContact && phoneRegex.test(newContact)) {
            if (emergencyContacts.length < 3) {
                setEmergencyContacts([...emergencyContacts, newContact]);
                setNewContact("");
            } else {
                alert("Maximum of 3 emergency contacts allowed");
            }
        } else if (!phoneRegex.test(newContact)) {
            alert("Please enter a valid phone number (10-12 digits)");
        }
    };

    // Remove Emergency Contact
    const removeEmergencyContact = (contactToRemove) => {
        setEmergencyContacts(emergencyContacts.filter(contact => contact !== contactToRemove));
    };

    // Toggle sending method
    const toggleMethod = (method) => {
        setSelectedMethods(prev => ({
            ...prev,
            [method]: !prev[method]
        }));
    };

    // Render message status (simulated)
    const renderMessageStatus = (contact, method) => {
        const message = messagesSent.find(msg => msg.contact === contact && msg.method === method);
        if (!message) return null;
        
        return (
            <span className={`text-xs px-2 py-1 rounded ${
                message.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
                {message.simulated ? 'Simulated' : 'Ready to send'}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-black to-red-900 text-white p-4 md:p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-red-500 opacity-10"
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
                <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
                    Emergency SOS
                </h1>
                <p className="text-center text-gray-300 mb-8">Your safety is our priority</p>

                {/* Emergency Contact Section */}
                <div className="mb-6 p-5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                        <FaUserPlus /> Emergency Contacts
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">Add up to 3 emergency contacts</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={newContact}
                            onChange={(e) => setNewContact(e.target.value)}
                            className="px-4 py-2 rounded-lg w-full text-black focus:ring-2 focus:ring-red-500"
                            maxLength="12"
                        />
                        <button
                            onClick={addEmergencyContact}
                            disabled={emergencyContacts.length >= 3}
                            className={`px-4 py-2 rounded-lg flex items-center justify-center ${emergencyContacts.length >= 3 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            title={emergencyContacts.length >= 3 ? "Maximum 3 contacts allowed" : "Add contact"}
                        >
                            <FaUserPlus />
                        </button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => toggleMethod('whatsapp')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${selectedMethods.whatsapp ? 'bg-green-600' : 'bg-gray-600'}`}
                        >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                        </button>
                        <button
                            onClick={() => toggleMethod('sms')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${selectedMethods.sms ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            <FaSms />
                            <span>SMS</span>
                        </button>
                    </div>
                    
                    <ul className="space-y-2 mt-3">
                        {emergencyContacts.map((contact, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FaPhone className="text-green-400" />
                                    <span>{contact}</span>
                                </div>
                                <button 
                                    onClick={() => removeEmergencyContact(contact)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                >
                                    <FaTimes />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {!sosActivated ? (
                    <button
                        onClick={() => {
                            setSosActivated(true);
                            setCountdown(5);
                        }}
                        className="w-full py-5 text-xl font-semibold rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                        <FaExclamationTriangle className="text-2xl animate-pulse" />
                        <span>Activate Emergency SOS</span>
                    </button>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="p-5 bg-black/60 backdrop-blur-sm border border-red-700 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-red-600 p-2 rounded-full animate-pulse">
                                    <FaExclamationTriangle className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-red-400">EMERGENCY SOS ACTIVATED</h3>
                            </div>
                            
                            {countdown > 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-lg mb-3">Sending alerts in {countdown} seconds...</p>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div 
                                            className="bg-red-600 h-2.5 rounded-full" 
                                            style={{ width: `${100 - (countdown * 20)}%` }}
                                        ></div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSosActivated(false);
                                            setCountdown(5);
                                            setShowSimulation(false);
                                        }}
                                        className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-300"
                                    >
                                        Cancel SOS
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {location && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                                <FaMap className="text-xl" />
                                                <span className="font-medium">Your Current Location:</span>
                                            </div>
                                            <div className="relative">
                                                <LoadScript
                                                    googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                                                    onLoad={() => setMapLoaded(true)}
                                                >
                                                    {mapLoaded && (
                                                        <GoogleMap
                                                            mapContainerStyle={mapContainerStyle}
                                                            center={{ lat: location.lat, lng: location.lng }}
                                                            zoom={15}
                                                            options={{
                                                                streetViewControl: false,
                                                                mapTypeControl: false,
                                                                fullscreenControl: false,
                                                                styles: [
                                                                    {
                                                                        featureType: "poi",
                                                                        elementType: "labels",
                                                                        stylers: [{ visibility: "off" }]
                                                                    }
                                                                ]
                                                            }}
                                                        >
                                                            <Marker 
                                                                position={{ lat: location.lat, lng: location.lng }} 
                                                                icon={{
                                                                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                                                }}
                                                            />
                                                        </GoogleMap>
                                                    )}
                                                </LoadScript>
                                                <a 
                                                    href={location.mapLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1 text-blue-300 hover:underline text-sm"
                                                >
                                                    <FaMapMarkerAlt /> Open in Google Maps
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <FaCheck className="text-lg" />
                                            <span>Alerts prepared for emergency contacts</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <FaPhone className="text-lg" />
                                            <span>Emergency call initiated</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setSosActivated(false)}
                                        className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaCheck />
                                        I'm Safe - Deactivate SOS
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Message Status Display - Now stays visible until SOS is deactivated */}
                        {(showSimulation || countdown === 0) && emergencyContacts.length > 0 && (
                            <div className="p-5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg animate-fade-in">
                                <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <FaSms /> Alert Messages Prepared
                                </h4>
                                <div className="space-y-4">
                                    {emergencyContacts.map((contact, index) => (
                                        <div key={index} className="space-y-3">
                                            {/* SMS Section */}
                                            {selectedMethods.sms && (
                                                <div className="bg-gray-700/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <MdSms className="text-blue-400 text-xl" />
                                                            <span className="font-medium">SMS to: {contact}</span>
                                                        </div>
                                                        {renderMessageStatus(contact, 'sms')}
                                                    </div>
                                                    <div className="bg-black/30 p-3 rounded text-sm">
                                                        <p>{generateEmergencyMessage()}</p>
                                                        <p className="mt-2 text-xs text-gray-400">(SMS would be sent automatically in a real implementation)</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* WhatsApp Section */}
                                            {selectedMethods.whatsapp && (
                                                <div className="bg-gray-700/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <MdWhatsapp className="text-green-400 text-xl" />
                                                            <span className="font-medium">WhatsApp to: {contact}</span>
                                                        </div>
                                                        {renderMessageStatus(contact, 'whatsapp')}
                                                    </div>
                                                    <div className="bg-black/30 p-3 rounded text-sm">
                                                        <p>{generateEmergencyMessage()}</p>
                                                        <button
                                                            onClick={() => openWhatsApp(contact)}
                                                            className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                                        >
                                                            <FaWhatsapp />
                                                            Open WhatsApp to Send
                                                        </button>
                                                        <p className="mt-2 text-xs text-gray-400">Click above to open WhatsApp with this message pre-filled</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Safety Tips */}
                {!sosActivated && (
                    <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-sm">
                        <h4 className="font-bold text-yellow-400 mb-2">Safety Tips:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Press the SOS button in case of emergency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Your location will be shared with your emergency contacts</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>You can choose to send via WhatsApp or SMS</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SOSAlert;