import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import './nav.css';

export default function Nav() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="logo">Aranoz.</div>
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/shop">Shop</a>
                    <a href="/blog">Blog</a>
                    <a href="/contact">Contact</a>
                </div>
                <div className="nav-icons">
                    
                    {user ? (
                        <div 
                            className="user-avatar-container"
                            onMouseEnter={() => setShowUserMenu(true)}
                            onMouseLeave={() => setShowUserMenu(false)}
                        >
                            {user?.profile_photo_path ? (
                                <img 
                                    src={`/storage/${user.profile_photo_path}`} 
                                    alt="Profile" 
                                    className="user-avatar-img"
                                />
                            ) : (
                                <div className="user-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                            )}
                            
                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <div className="user-name">{user?.name}</div>
                                        <div className="user-email">{user?.email}</div>
                                    </div>
                                    <div className="user-menu-items">
                                        <Link href="/profile" className="user-menu-item">
                                            <i className="fas fa-user"></i> Profile
                                        </Link>
                                        <Link href="/logout" method="post" as="button" className="user-menu-item logout">
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="login-btn">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}