import React, { useState } from 'react';
import './IncidentShare.css';

const IncidentShare = () => {
  const [incidents, setIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    files: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) return;

    const incident = {
      ...newIncident,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      likes: 0,
      comments: [],
      user: {
        name: 'Anonymous User',
        avatar: 'A'
      }
    };

    setIncidents([incident, ...incidents]);
    setNewIncident({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      files: []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewIncident(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setNewIncident(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleLike = (incidentId) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, likes: incident.likes + 1 }
        : incident
    ));
  };

  return (
    <div className="incident-share-container">
      <h1>Share Your Incident</h1>
      
      <div className="incident-form-container">
        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={newIncident.title}
              onChange={handleChange}
              placeholder="What happened?"
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              name="description"
              value={newIncident.description}
              onChange={handleChange}
              placeholder="Tell us more about the incident..."
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="date"
              name="date"
              value={newIncident.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="location"
              value={newIncident.location}
              onChange={handleChange}
              placeholder="Location (optional)"
            />
          </div>

          <div className="file-upload">
            <label className="file-label">
              Add Photos/Videos
              <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
              />
            </label>
            {newIncident.files.length > 0 && (
              <div className="file-previews">
                {newIncident.files.map((file, index) => (
                  <div key={index} className="file-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button type="submit" className="submit-btn">Share</button>
        </form>
      </div>

      <div className="incidents-list">
        {incidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="incident-header">
              <div className="user-avatar">{incident.user.avatar}</div>
              <div className="incident-title">{incident.user.name}</div>
            </div>

            {incident.files.length > 0 && (
              <img
                src={URL.createObjectURL(incident.files[0])}
                alt="Incident"
                className="incident-image"
              />
            )}

            <div className="incident-content">
              <div className="incident-description">{incident.description}</div>
              
              <div className="incident-actions">
                <button className="action-button" onClick={() => handleLike(incident.id)}>
                  <i className="fas fa-heart"></i>
                  <span>{incident.likes}</span>
                </button>
                <button className="action-button">
                  <i className="fas fa-comment"></i>
                  <span>Comment</span>
                </button>
                <button className="action-button">
                  <i className="fas fa-share"></i>
                  <span>Share</span>
                </button>
              </div>

              <div className="incident-meta">
                <span className="incident-date">{incident.date}</span>
                {incident.location && (
                  <span className="incident-location">📍 {incident.location}</span>
                )}
                <span className="incident-time">{incident.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
        {incidents.length === 0 && (
          <p className="no-incidents">No incidents shared yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
};

export default IncidentShare; 