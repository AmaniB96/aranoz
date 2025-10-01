import React from 'react';
import './../../Components/Shop/shop.css';
import Nav from '../../Components/nav/Nav';

export default function ContactHeader() {
    return (
        <>
            
            <header className="shop-header">
                <Nav/>
                <div className="container">
                    <div className="shop-header-content">
                        <div className="shop-header-text">
                            <h1 className="shop-header-title">Contact</h1>
                            <p className="shop-header-subtitle">contact - Contact</p>
                        </div>
                        <div className="shop-header-image">
                            <img
                                src="/storage/products/carousel/feature_4.png"
                                alt="Hero"
                                className="header-decoration-image"
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}