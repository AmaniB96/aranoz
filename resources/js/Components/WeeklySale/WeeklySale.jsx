import React, { useState, useEffect } from 'react';
import './weeklySale.css';

export default function WeeklySale({ product }) {
    const [timeLeft, setTimeLeft] = useState(5 * 24 * 60 * 60); // 5 jours en secondes
    const [email, setEmail] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    return 5 * 24 * 60 * 60; // Reset to 5 days
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const secs = seconds % 60;

        return { days, hours, minutes, seconds: secs };
    };

    const time = formatTime(timeLeft);
    const discountPercent = product?.discount_percent || 60;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/send-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ email })
            });
            alert('Coupon sent to your email!');
            setEmail('');
        } catch (error) {
            console.error('Error sending coupon:', error);
        }
    };

    return (
        <section className="weekly-sale">
            <div className="container">
                <h2 className="sale-title">
                    Weekly Sale on {discountPercent}%<br />
                    Off All Products
                </h2>
                
                <div className="countdown">
                    <div className="time-unit">
                        <span className="time-number">{time.days}</span>
                        <span className="time-label">Days</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{time.hours.toString().padStart(2, '0')}</span>
                        <span className="time-label">Hours</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{time.minutes.toString().padStart(2, '0')}</span>
                        <span className="time-label">Minutes</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{time.seconds.toString().padStart(2, '0')}</span>
                        <span className="time-label">Seconds</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="coupon-form">
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="email-input"
                    />
                    <button type="submit" className="subscribe-btn">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
}