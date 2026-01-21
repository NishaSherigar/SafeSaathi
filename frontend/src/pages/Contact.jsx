import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
    const safetyOrganizations = [
        {
            title: "Men's Helpline",
            contact: "8882 498 498",
            email: "help@mensrightindia.net",
            image: "/images/men.jpeg"
        },
        {
            title: "National Commission for Women",
            contact: "+91-11-26944880",
            email: "complaintcell-ncw@nic.in",
            image: "/images/1.jpg"
        },
        {
            title: "Aasra (Mental Health Support)",
            contact: "+91-9820466726",
            email: "aasrahelpline@yahoo.com",
            image: "/images/10.jpg"
        },
        {
            title: "Men Welfare",
            contact: "+91-9999888877",
            email: "info@menwelfare.org",
            image: "/images/men3.jpeg"
        }
    ];

    return (
        <div className="contact-container">
            <div className="page-header">
                <h1>Contact Us</h1>
                <p>Need help or have safety concerns? Reach out to us anytime. We're here to ensure your safety 24/7.</p>
            </div>
            
            <div className="contact-safesaathi">
                <h2>Get in Touch</h2>
                <div className="contact-info">
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <h3>Phone</h3>
                        <p>Customer Support</p>
                        <a href="tel:+919876543210">+91 98765 43210</a>
                        <p>Emergency (24/7)</p>
                        <a href="tel:+9118001234567">1800 123 4567</a>
                    </div>
                    
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
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h3>Office</h3>
                        <p>SafeSaathi Headquarters</p>
                        <p>123 Safety Plaza</p>
                        <p>Mumbai, Maharashtra 400001</p>
                    </div>
                </div>
                
                <div className="social-links-container">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            
            <div className="safety-organizations">
                <h2>Safety Organizations</h2>
                <p>Organizations and NGOs offering support for men and women who are victims of harassment, abuse, or other safety concerns.</p>
                
                <div className="org-cards">
                    {safetyOrganizations.map((org, index) => (
                        <div key={index} className="org-card">
                            <div className="org-img-container">
                                <img src={org.image} alt={org.title} onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/alterante.jpeg";
                                }} />
                            </div>
                            <h3>{org.title}</h3>
                            <div className="org-contact">
                                <p><i className="fas fa-phone-alt"></i> {org.contact}</p>
                                <p><i className="fas fa-envelope"></i> {org.email}</p>
                            </div>
                        </div>
                    ))}
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

export default Contact;