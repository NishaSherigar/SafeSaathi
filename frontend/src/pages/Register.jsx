import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...emergencyContacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    };
    setEmergencyContacts(newContacts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Show emergency contacts dialog before registration
    setShowEmergencyContacts(true);
  };

  const handleEmergencyContactsSubmit = async () => {
    try {
      // Validate emergency contacts
      const isValid = emergencyContacts.every(contact => 
        contact.name && contact.phone && contact.email
      );

      if (!isValid) {
        setError('Please fill in all emergency contact details');
        return;
      }

      // Proceed with registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Store emergency contacts in localStorage
      localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">
            Continue
          </button>
        </form>
      </div>

      {showEmergencyContacts && (
        <div className="emergency-contacts-modal">
          <div className="emergency-contacts-content">
            <h3>Add Emergency Contacts</h3>
            <p>Please add details of two emergency contacts for the SOS feature.</p>
            
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="emergency-contact-form">
                <h4>Emergency Contact {index + 1}</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                    required
                    placeholder="Enter contact's name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                    required
                    placeholder="Enter contact's phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleEmergencyContactChange(index, 'email', e.target.value)}
                    required
                    placeholder="Enter contact's email"
                  />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button 
                className="save-contacts-button"
                onClick={handleEmergencyContactsSubmit}
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 