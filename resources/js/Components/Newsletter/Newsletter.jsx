import React, { useState } from 'react';
import './newsletter.css';

export default function Newsletter({ discountedProducts }) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/newsletter-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ 
                    email,
                    discounted_products: discountedProducts 
                })
            });
            alert('Newsletter subscription successful! Check your email for discounted products.');
            setEmail('');
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
        }
    };

    return (
        <section className="newsletter">
            <div className="container">
                <div className="newsletter-content">
                    <h2 className="newsletter-title">
                        Subscribe to get Updated<br />
                        with new offers
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="newsletter-input"
                        />
                        <button type="submit" className="newsletter-btn">
                            Subscribe Now
                        </button>
                    </form>
                </div>
                
                <div className="decorative-elements">
                    <img 
                        className='deco' 
                        src="/storage/products/card/feature_5.png" 
                        alt="Decoration" 
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>

                <div className="decorative-elements2">
                    <img 
                        className='deco2' 
                        src="/storage/products/card/feature_5.png" 
                        alt="Decoration" 
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>

                <div className="decorative-elements3">
                    <img 
                        className='deco3' 
                        src="/storage/products/card/feature_5.png" 
                        alt="Decoration" 
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </section>
    );
}