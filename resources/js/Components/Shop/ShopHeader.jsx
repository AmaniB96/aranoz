import React from 'react';
import './shop.css';
import Nav from '../nav/Nav';

export default function ShopHeader() {
    return (
        <>
            
            <header className="shop-header">
                <Nav />
                <div className="container">
                    <div className="shop-header-content">
                        <div className="shop-header-text">
                            <h1 className="shop-header-title">Shop Category</h1>
                            <p className="shop-header-subtitle">Home - Shop Category</p>
                        </div>
                        <div className="shop-header-image">
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