import React, { useState, useEffect } from 'react';
import { FaBell, FaVolumeUp, FaMapMarkerAlt, FaClock, FaWalking, FaSubway, FaCar, FaMotorcycle, FaSearch, FaExclamationTriangle, FaCheckCircle, FaUser, FaUserAlt } from 'react-icons/fa';

const SafetyPlanGenerator = () => {
  const [formData, setFormData] = useState({
    'Time of Day': 'Evening 🌆',
    'Location Type': 'Residential 🏡',
    'Transport Mode': 'Metro 🚇',
    'Gender': 'Female',
    'Name': '',
    'Departure Time': new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  });
  const [safetyPlan, setSafetyPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reminder, setReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('15 seconds');
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const [areaSearch, setAreaSearch] = useState('');
  const [matchedAreas, setMatchedAreas] = useState([]);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [activeReminder, setActiveReminder] = useState(null);

  // Dataset with all columns including gender and name considerations
  const dataset = [
    {
      'User': 'User1',
      'Time of Day': 'Evening 🌆',
      'Location Type': 'Residential 🏡',
      'Transport Mode': 'Metro 🚇',
      'Gender': 'Female',
      'Crime Rate': 'Critical ❌',
      'Streetlights': 'Well-lit 💡',
      'CCTV Presence': 'No ❌',
      'Police Presence': 'No Presence ❌',
      'Area Risk Level': 'High Risk 🚨',
      'Escape Route Availability': 'Available 🟢',
      'Safety Plan': '🚶 Stay on main roads, avoid shortcuts. Keep your phone charged. Share your location with someone you trust. Consider using women-only compartments in metro.'
    },
    {
      'User': 'User2',
      'Time of Day': 'Evening 🌆',
      'Location Type': 'Slum Area 🚧',
      'Transport Mode': 'Car 🚗',
      'Gender': 'Male',
      'Crime Rate': 'Critical ❌',
      'Streetlights': 'No lights 🚫',
      'CCTV Presence': 'No ❌',
      'Police Presence': 'Frequent Patrol 🚔',
      'Area Risk Level': 'High Risk 🚨',
      'Escape Route Availability': 'Limited 🔵',
      'Safety Plan': '🏡 If heading home late, inform someone about your ETA. Use safety apps to alert close contacts. Keep car doors locked.'
    },
    {
      'User': 'User3',
      'Time of Day': 'Morning 🌅',
      'Location Type': 'Residential 🏡',
      'Transport Mode': 'Public Transport 🚌',
      'Gender': 'Female',
      'Crime Rate': 'Low ✅',
      'Streetlights': 'Dimly-lit 🌑',
      'CCTV Presence': 'No ❌',
      'Police Presence': 'Occasional Patrol 👮',
      'Area Risk Level': 'Moderate Risk ⚠️',
      'Escape Route Availability': 'None ❌',
      'Safety Plan': '🏡 If heading home late, inform someone about your ETA. Use safety apps to alert close contacts. Sit near other women or families.'
    },
    {
      'User': 'User4',
      'Time of Day': 'Late Night 🌌',
      'Location Type': 'Crowded Market 🛍️',
      'Transport Mode': 'Bike 🏍️',
      'Gender': 'Male',
      'Crime Rate': 'Low ✅',
      'Streetlights': 'Dimly-lit 🌑',
      'CCTV Presence': 'No ❌',
      'Police Presence': 'Frequent Patrol 🚔',
      'Area Risk Level': 'Moderate Risk ⚠️',
      'Escape Route Availability': 'None ❌',
      'Safety Plan': '📞 Always have emergency numbers saved. Avoid engaging with strangers in isolated areas. Wear helmet and reflective gear.'
    }
  ];

  // Mumbai area database with risk levels
  const mumbaiAreas = [
    {
      name: 'Dharavi',
      type: 'Slum Area',
      risk: 'High',
      description: 'Asia largest slum with dense population and narrow lanes',
      tips: [
        'Avoid walking alone at night',
        'Keep valuables secured and out of sight',
        'Use trusted local guides if unfamiliar'
      ]
    },
    {
      name: 'Marine Drive',
      type: 'Tourist Spot',
      risk: 'Moderate',
      description: 'Popular seaside promenade with mixed crowds',
      tips: [
        'Beware of pickpockets in crowded areas',
        'Avoid isolated spots after midnight',
        'Stick to well-lit areas'
      ]
    },
    {
      name: 'Bandra Kurla Complex',
      type: 'Commercial',
      risk: 'Low',
      description: 'Business district with good security',
      tips: [
        'Normal precautions apply during day',
        'Be cautious in parking areas at night',
        'Use authorized taxis'
      ]
    }
  ];

  // Text-to-speech function with personalized message
  const speak = (text) => {
    if ('speechSynthesis' in window && speakEnabled) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (activeReminder) {
        clearInterval(activeReminder);
      }
      speechSynthesis.cancel();
    };
  }, [activeReminder]);

  useEffect(() => {
    if (areaSearch.trim() === '') {
      setMatchedAreas([]);
      return;
    }

    const results = mumbaiAreas.filter(area =>
      area.name.toLowerCase().includes(areaSearch.toLowerCase()) ||
      area.type.toLowerCase().includes(areaSearch.toLowerCase())
    ).slice(0, 3);

    setMatchedAreas(results);
  }, [areaSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    const [hours, minutes] = timeValue.split(':');
    const time12hr = new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setFormData({ ...formData, 'Departure Time': time12hr });
  };

  const getReminderInterval = () => {
    switch(reminderTime) {
      case '15 seconds': return 15000;
      case '5 minutes': return 300000;
      case '30 minutes': return 1800000;
      case '1 hour': return 3600000;
      case '2 hours': return 7200000;
      default: return 300000;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (activeReminder) {
      clearInterval(activeReminder);
      setActiveReminder(null);
    }

    const matchedEntry = dataset.find(row => 
      row['Time of Day'] === formData['Time of Day'] &&
      row['Location Type'] === formData['Location Type'] &&
      row['Transport Mode'] === formData['Transport Mode'] &&
      (row['Gender'] === formData['Gender'] || !row['Gender'])
    ) || dataset.find(row => 
      row['Time of Day'] === formData['Time of Day'] &&
      row['Location Type'] === formData['Location Type'] &&
      row['Transport Mode'] === formData['Transport Mode']
    );

    let personalizedPlan = '';
    let reminderMessage = '';
    const userName = formData['Name'] || 'there';

    if (matchedEntry) {
      personalizedPlan = `${matchedEntry['Safety Plan']}\n\nYou're departing at ${formData['Departure Time']} as a ${formData['Gender']} traveler.`;
      reminderMessage = `Hello ${userName}, safety reminder: ${matchedEntry['Safety Plan'].split('.')[0]}. Stay safe!`;
    } else {
      personalizedPlan = `⚠️ Stay alert to your surroundings. Avoid distractions like phone use while moving. Share your live location with someone you trust.\n\nYou're departing at ${formData['Departure Time']} as a ${formData['Gender']} traveler.`;
      reminderMessage = `Hello ${userName}, general safety reminder: Stay alert and be aware of your surroundings. Stay safe!`;
    }

    setSafetyPlan(personalizedPlan);
    setReminder(reminderMessage);
    
    const interval = setInterval(() => {
      speak(reminderMessage);
      alert(`🔔 Safety Reminder for ${userName}:\n\n${reminderMessage}`);
    }, getReminderInterval());
    
    setActiveReminder(interval);
    
    setTimeout(() => {
      speak(reminderMessage);
    }, 2000);

    setLoading(false);
  };

  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'Walking 🚶': return <FaWalking className="inline mr-1" />;
      case 'Metro 🚇': return <FaSubway className="inline mr-1" />;
      case 'Car 🚗': return <FaCar className="inline mr-1" />;
      case 'Bike 🏍️': return <FaMotorcycle className="inline mr-1" />;
      case 'Public Transport 🚌': return <FaSubway className="inline mr-1" />;
      default: return <FaWalking className="inline mr-1" />;
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'High': return 'bg-red-900 text-red-300';
      case 'Moderate': return 'bg-yellow-800 text-yellow-300';
      case 'Low': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'Female' ? <FaUser className="inline mr-1" /> : <FaUserAlt className="inline mr-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-yellow-400 mb-3 flex items-center justify-center">
            <FaMapMarkerAlt className="mr-3" />
            Mumbai Safety Companion
          </h1>
          <p className="text-lg text-blue-200">
            Personalized safety recommendations for navigating Mumbai
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
              <FaClock className="mr-2" />
              Plan Your Route
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-blue-200 mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  name="Name"
                  value={formData['Name']}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Time of Day</label>
                <select 
                  name="Time of Day" 
                  value={formData['Time of Day']} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                >
                  <option value="Morning 🌅">Morning 🌅</option>
                  <option value="Afternoon ☀️">Afternoon ☀️</option>
                  <option value="Evening 🌆">Evening 🌆</option>
                  <option value="Night 🌃">Night 🌃</option>
                  <option value="Late Night 🌌">Late Night 🌌</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Location Type</label>
                <select 
                  name="Location Type" 
                  value={formData['Location Type']} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                >
                  <option value="Residential 🏡">Residential 🏡</option>
                  <option value="Commercial 🏢">Commercial 🏢</option>
                  <option value="Slum Area 🚧">Slum Area 🚧</option>
                  <option value="Crowded Market 🛍️">Crowded Market 🛍️</option>
                  <option value="Isolated 🏜️">Isolated 🏜️</option>
                  <option value="Public Transport 🚉">Public Transport 🚉</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Transport Mode</label>
                <select 
                  name="Transport Mode" 
                  value={formData['Transport Mode']} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                >
                  <option value="Walking 🚶">Walking 🚶</option>
                  <option value="Metro 🚇">Metro 🚇</option>
                  <option value="Car 🚗">Car 🚗</option>
                  <option value="Bike 🏍️">Bike 🏍️</option>
                  <option value="Public Transport 🚌">Public Transport 🚌</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Gender</label>
                <select 
                  name="Gender" 
                  value={formData['Gender']} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Departure Time</label>
                <input
                  type="time"
                  onChange={handleTimeChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                />
                <p className="text-sm text-blue-300 mt-1">Selected: {formData['Departure Time']}</p>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={speakEnabled}
                    onChange={() => setSpeakEnabled(!speakEnabled)}
                    className="form-checkbox h-5 w-5 text-yellow-400"
                  />
                  <span className="text-blue-200">Enable voice alerts <FaVolumeUp className="inline ml-1" /></span>
                </label>
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-medium">Reminder Frequency</label>
                <select 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none text-white"
                >
                  <option value="15 seconds">15 seconds (demo)</option>
                  <option value="5 minutes">5 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Plan...
                  </>
                ) : 'Generate Safety Plan'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-600 text-white rounded-lg text-center">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-500">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
                <FaSearch className="mr-2" />
                Search Mumbai Areas
              </h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search areas (e.g. 'Dharavi', 'Marine Drive')"
                  value={areaSearch}
                  onChange={(e) => setAreaSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-400 focus:outline-none text-white"
                />
                <FaSearch className="absolute left-3 top-4 text-gray-400" />
              </div>

              {matchedAreas.length > 0 && (
                <div className="space-y-4">
                  {matchedAreas.map((area, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getRiskColor(area.risk).replace('bg', 'border')}`}>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">
                          {area.name} 
                          <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getRiskColor(area.risk)}`}>
                            {area.risk} Risk
                          </span>
                        </h3>
                        <span className="text-sm text-gray-400">{area.type}</span>
                      </div>
                      <p className="text-blue-200 mt-1">{area.description}</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {area.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-blue-100">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {areaSearch && matchedAreas.length === 0 && (
                <p className="text-gray-400 text-center py-4">No areas found matching your search</p>
              )}

              {!areaSearch && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-500">
                    <h3 className="font-bold text-red-300 flex items-center">
                      <FaExclamationTriangle className="mr-2" /> High Risk
                    </h3>
                    <p className="text-sm mt-2">Dharavi, Kamathipura, Some isolated beaches</p>
                  </div>
                  <div className="bg-yellow-800 bg-opacity-30 p-4 rounded-lg border border-yellow-500">
                    <h3 className="font-bold text-yellow-300">Moderate Risk</h3>
                    <p className="text-sm mt-2">Marine Drive, Local Trains, Colaba Causeway</p>
                  </div>
                  <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-500">
                    <h3 className="font-bold text-green-300 flex items-center">
                      <FaCheckCircle className="mr-2" /> Low Risk
                    </h3>
                    <p className="text-sm mt-2">BKC, Powai, Most residential areas</p>
                  </div>
                </div>
              )}
            </div>

            {safetyPlan && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-500">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">
                    Your Safety Plan
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => speak(safetyPlan)}
                      disabled={!speakEnabled}
                      className={`p-2 rounded-full ${speakEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600'}`}
                      title="Read aloud"
                    >
                      <FaVolumeUp />
                    </button>
                    <button 
                      onClick={() => setShowAllColumns(!showAllColumns)}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-700"
                      title={showAllColumns ? 'Hide details' : 'Show all details'}
                    >
                      {showAllColumns ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-700 bg-opacity-70 p-4 rounded-lg mb-6">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{safetyPlan}</p>
                </div>

                {showAllColumns && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Full Safety Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(dataset.find(row => 
                        row['Time of Day'] === formData['Time of Day'] &&
                        row['Location Type'] === formData['Location Type'] &&
                        row['Transport Mode'] === formData['Transport Mode'] &&
                        (row['Gender'] === formData['Gender'] || !row['Gender'])
                      ) || {}).map(([key, value]) => (
                        key !== 'User' && key !== 'Safety Plan' && (
                          <div key={key} className="bg-gray-700 p-3 rounded-lg">
                            <h4 className="text-blue-300 font-medium mb-1">{key}</h4>
                            <p>{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="text-yellow-400 font-medium mb-1">Time</h3>
                    <p>{formData['Time of Day']}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="text-yellow-400 font-medium mb-1">Location</h3>
                    <p>{formData['Location Type']}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="text-yellow-400 font-medium mb-1">Transport</h3>
                    <p>{getTransportIcon(formData['Transport Mode'])} {formData['Transport Mode']}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="text-yellow-400 font-medium mb-1">Gender</h3>
                    <p>{getGenderIcon(formData['Gender'])} {formData['Gender']}</p>
                  </div>
                </div>

                <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-blue-300 font-medium flex items-center">
                      <FaBell className="mr-2" /> Personalized Safety Reminder
                    </h3>
                    <button
                      onClick={() => speak(reminder)}
                      className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
                      title="Test reminder voice"
                    >
                      <FaVolumeUp />
                    </button>
                  </div>
                  <p className="mt-2 text-blue-200">{reminder}</p>
                  <p className="text-xs text-blue-400 mt-2">
                    {activeReminder ? 
                      `Active reminders every ${reminderTime.toLowerCase()} (next alert in ${reminderTime})` : 
                      'Reminders will start when you generate a plan'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPlanGenerator;