import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ContactHeader from './ContactHeader';
import './contact.css';

export default function Contact() {
    const { contact } = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const getMapSrc = () => {
        if (!contact?.street && !contact?.city) {
            return `https://maps.google.com/maps?q=Brussels,Belgium&hl=en&z=14&output=embed`;
        }
        
        const addressParts = [
            `${contact.street_number} ${contact.street}`,
            contact.city,
            contact.state,
            contact.zip_code,
            contact.country_code
        ];
        const address = addressParts.filter(part => part && part.trim()).join(', ');
        const encodedAddress = encodeURIComponent(address);
        
        return `https://maps.google.com/maps?q=${encodedAddress}&hl=en&z=17&output=embed`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <ContactHeader />
            
            <div className="contact-page-public">
                <div className="map-section">
                    <iframe
                        title="company-location"
                        width="100%"
                        height="400"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={getMapSrc()}
                        loading="lazy"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                <div className="contact-content">
                    <div className="container">
                        <div className="contact-grid">
                            <div className="contact-form-section">
                                <h2 className="section-title">Get in Touch</h2>
                                <p className="section-subtitle">Say something to start a live chat!</p>

                                <form className="public-contact-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Your email address"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <textarea
                                            name="message"
                                            placeholder="Tell us more about your needs..."
                                            rows="6"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="send-message-btn">
                                        SEND MESSAGE
                                    </button>
                                </form>
                            </div>

                            <div className="contact-info-section">
                                <div className="contact-info-card">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div className="info-content">
                                            <h4>
                                                {contact?.street_number && contact?.street 
                                                    ? `${contact.street_number} ${contact.street}` 
                                                    : 'Place de la minoterie, Molenbeek.'
                                                }
                                            </h4>
                                            <p>
                                                {contact?.city || 'Bruxelles'}, {contact?.country_code || 'BE'} {contact?.zip_code || '1080'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <i className="fas fa-phone"></i>
                                        </div>
                                        <div className="info-content">
                                            <h4>{contact?.phone_number || '0477 88 99 00'}</h4>
                                            <p>Mon to Fri 9am to 6pm</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <div className="info-content">
                                            <h4>{contact?.email || 'mouss@mouss.be'}</h4>
                                            <p>Send us your query anytime!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}