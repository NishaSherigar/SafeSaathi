import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      title: 'Alternate Route',
      image: '/images/alterante.jpeg',
      description: 'Find safer routes to your destination with real-time safety data.',
      buttonText: 'Explore',
      link: '/map'
    },
    {
      title: 'SOS Alert',
      image: '/images/sos.avif',
      description: 'Quickly send alerts to your emergency contacts.',
      buttonText: 'Activate',
      link: '/SOSAlert'
    },
    {
      title: 'Voice Detection',
      image: '/images/voice.jpeg',
      description: 'AI-powered voice detection to identify potential threats.',
      buttonText: 'Monitor',
      link: '/audio'
    },
    {
      title: 'Emergency Cab',
      image: '/images/cab.jpg',
      description: 'Book a verified and safe cab service for emergency situations.',
      buttonText: 'Book Now',
      link: '/EmergencyCab'
    },
    {
      title: "AI Safety Plan",
      image: "/images/safetyplan.jpg",
      description: "Personalized safety recommendations tailored to your journey.",
      buttonText: "Get Plan",
      link: "/SafetyPlan"
    },
    
    {
      title: 'Community Portal',
      image: '/images/online3.png',
      description: 'Join our community to share experiences and support each other.',
      buttonText: 'Join',
      link: '/community'
    }
  ];

    return (
    <div className="home-container">
      <div className="jumbotron text-center">
        <h2>Welcome to SafeSaathi</h2>
        <p>Your Safety, Our Priority</p>
            </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-frame">
            <img src={feature.image} alt={feature.title} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to={feature.link} className="feature-btn">
              {feature.buttonText}
            </Link>
          </div>
        ))}
      </div>
        </div>
    );
};

export default Home;
