import React from 'react';
import './product-details.css';
import Nav from '../nav/Nav';

export default function ProductHeader() {
    return (
        <>
            
            <header className="product-header">
                <Nav />
                <div className="container">
                    <div className="product-header-content">
                        <div className="product-header-text">
                            <h1 className="product-header-title">Product Details</h1>
                            <p className="product-header-subtitle">Home - Product Details</p>
                        </div>
                        <div className="product-header-image">
                            <img
                                src="/storage/products/carousel/feature_2.png"
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