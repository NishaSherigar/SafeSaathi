import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
    return (
        <div className="about-container">
            <div className="page-header">
                <h1>About SafeSaathi</h1>
                <p>Empowering citizens with safety solutions through innovative technology and community collaboration</p>
            </div>
            
            <div className="about-safesaathi">
                <h2>Our Mission</h2>
                <p>SafeSaathi was born out of a pressing need to address the growing concerns about personal safety in our communities. We believe that everyone deserves to feel secure in their daily lives, whether they're walking home at night, traveling to new places, or simply going about their routine.</p>
                
                <p>Our platform combines cutting-edge technology with community-powered safety features to create a comprehensive safety network. From real-time threat alerts to emergency response coordination, SafeSaathi puts the power of protection in your hands.</p>
                
                <h2 style={{ marginTop: "30px" }}>What We Offer</h2>
                <p><strong>Real-time Safety Alerts:</strong> Get instant notifications about incidents in your vicinity.</p>
                <p><strong>Community Watch:</strong> Connect with trusted neighbors and local safety volunteers.</p>
                <p><strong>Emergency Response:</strong> One-tap access to authorities and emergency contacts.</p>
                <p><strong>Safety Resources:</strong> Educational content and self-defense techniques for all citizens.</p>
            </div>
            
            <div className="team-section">
                <h2>Meet Our Team</h2>
                <div className="team">
                    <div className="member">
                        <div className="member-img-container">
                            <img src="/images/gargi1.jpeg" alt="Gargi Pungle" />
                        </div>
                        <h3>Gargi Pungle</h3>
                        <p className="role">Web Developer</p>
                        <p className="description">Architect of SafeSaathi's robust web platform and security infrastructure</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    
                    <div className="member">
                        <div className="member-img-container">
                            <img src="/images/nisha1.jpeg" alt="Nisha Sherigar" />
                        </div>
                        <h3>Nisha Sherigar</h3>
                        <p className="role">Frontend Developer</p>
                        <p className="description">Crafted the intuitive user interfaces that make safety accessible to everyone</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    
                    <div className="member">
                        <div className="member-img-container">
                            <img src="/images/farheen1 (1).jpeg" alt="Farheen Sheikh" />
                        </div>
                        <h3>Farheen Sheikh</h3>
                        <p className="role">Backend Developer</p>
                        <p className="description">Built the powerful systems that keep SafeSaathi running 24/7</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    
                    <div className="member">
                        <div className="member-img-container">
                            <img src="/images/shreya1.jpeg" alt="Shreya Shirsat" />
                        </div>
                        <h3>Shreya Shirsat</h3>
                        <p className="role">UI/UX Designer</p>
                        <p className="description">Designed the seamless experiences that make safety simple and intuitive</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="contact-section">
                <h2>Contact Us</h2>
                <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 30px" }}>
                    We're here to help and answer any questions you might have about SafeSaathi. Reach out to us through any of these channels:
                </p>
                
                <div className="contact-info">
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h3>Email</h3>
                        <p>General Inquiries</p>
                        <a href="mailto:info@safesaathi.com">info@safesaathi.com</a>
                        <p>Support</p>
                        <a href="mailto:support@safesaathi.com">support@safesaathi.com</a>
                    </div>
                    
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <h3>Phone</h3>
                        <p>Customer Support</p>
                        <a href="tel:+911234567890">+91 12345 67890</a>
                        <p>Emergency (24/7)</p>
                        <a href="tel:+9118001234567">1800 123 4567</a>
                    </div>
                    
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h3>Office</h3>
                        <p>SafeSaathi Headquarters</p>
                        <p>123 Safety Plaza</p>
                        <p>Mumbai, Maharashtra 400001</p>
                    </div>
                </div>
            </div>
            
            <div className="home-button-container">
                <Link to="/" className="home-button">
                    <i className="fas fa-home"></i> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default About;

