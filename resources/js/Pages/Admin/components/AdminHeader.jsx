import React from 'react';
import './adminHeader.css';

export default function AdminHeader({ title, subtitle = "Aranoz - Shop system", children }) {
    return (
        <div className="admin-header">
            <div className="admin-header-content">
                <div className="admin-header-text">
                    <h1 className="admin-header-title">{title}</h1>
                    <p className="admin-header-subtitle">{subtitle}</p>
                </div>
                <div className="admin-header-image">
                    <img 
                        src="/storage/products/carousel/feature_1.png" 
                        alt="Admin header decoration" 
                        className="header-decoration-image"
                    />
                </div>
            </div>
            {children && (
                <div className="admin-header-actions">
                    {children}
                </div>
            )}
        </div>
    );
}