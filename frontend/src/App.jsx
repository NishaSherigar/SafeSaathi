import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AudioPage from "./pages/AudioPage"; 
import IncidentShare from "./components/IncidentShare";
import BatteryNotification from "./components/batterynotification";
import EmergencyCab from "./components/EmergencyCab";
import SOSAlert from "./components/SOSAlert";
import SafetyPlan from "./components/SafetyPlan";
import Login from "./components/Login";
import Register from "./components/Register";
import MapFeature from "./components/MapFeature/MapFeature";
import AudioComponent from "./components/AudioComponent";
import CommunityForum from "./components/CommunityForum";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SelfDefence from "./pages/selfDefence";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="bg-gradient-to-br from-black via-gray-900 to-purple-900 min-h-screen text-white">
        {/* Holographic Navigation Bar */}
        <nav className="flex justify-between items-center p-4 bg-opacity-40 backdrop-blur-lg border border-gray-600 shadow-lg shadow-purple-500/50 rounded-xl m-4 transition-all duration-500 hover:shadow-purple-700/80">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-300 animate-pulse drop-shadow-lg">
            SafeSaathi
          </h2>
          <ul className="flex space-x-6">
            {isAuthenticated ? (
              <>
                <li><Link to="/" className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg">Home</Link></li>
                <li>
                  <Link 
                    to="/about"
                    className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact"
                    className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/self-defence"
                    className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg"
                  >
                    Self Defence
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg">Login</Link></li>
                <li><Link to="/register" className="text-lg transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-lg">Register</Link></li>
              </>
            )}
          </ul>
        </nav>

        {/* Page Routes with Neon Glow */}
        <div className="p-6 text-center animate-fade-in shadow-lg shadow-blue-500/30 rounded-xl m-6 border border-gray-700 bg-opacity-20 backdrop-blur-md transition-all duration-500 hover:shadow-blue-700/50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/self-defence" element={<SelfDefence />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/audio" element={
              <ProtectedRoute>
                <AudioPage />
              </ProtectedRoute>
            } />
            <Route path="/incidents" element={
              <ProtectedRoute>
                <IncidentShare />
              </ProtectedRoute>
            } />
            <Route path="/batterynotification" element={
              <ProtectedRoute>
                <BatteryNotification />
              </ProtectedRoute>
            } />
            <Route path="/EmergencyCab" element={
              <ProtectedRoute>
                <EmergencyCab />
              </ProtectedRoute>
            } />
            <Route path="/SOSAlert" element={
              <ProtectedRoute>
                <SOSAlert />
              </ProtectedRoute>
            } />
            <Route path="/SafetyPlan" element={
              <ProtectedRoute>
                <SafetyPlan />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <MapFeature />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityForum />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
