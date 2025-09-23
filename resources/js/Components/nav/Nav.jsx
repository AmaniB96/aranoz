import React from 'react'
import './nav.css'

function Nav() {
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
                    <i className="fas fa-search"></i>
                    <i className="fas fa-user"></i>
                </div>
            </nav>
        </>
    )
}

export default Nav
