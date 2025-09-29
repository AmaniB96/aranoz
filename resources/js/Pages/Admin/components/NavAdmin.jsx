import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import './navAdmin.css';

function NavAdmin() {
    const { auth } = usePage().props;
    const user = auth.user;
    const userRole = user?.role?.name;
    
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const canAccess = (roles) => {
        return roles.includes(userRole);
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-logo">
                <span className="logo-text">Admin.</span>
                <span className="admin-badge">{userRole}</span>
            </div>
            
            <div className="admin-nav-links">
                {canAccess(['admin']) && (
                    <div className="nav-item dropdown">
                        <button 
                            className="nav-link dropdown-toggle"
                            onClick={() => toggleDropdown('admin')}
                        >
                            Admin <i className="fas fa-chevron-down"></i>
                        </button>
                        {openDropdown === 'admin' && (
                            <div className="dropdown-menu">
                                <Link href="/admin/user" className="dropdown-item">Users</Link>
                                <Link href="/admin/categories" className="dropdown-item">Categories</Link>
                            </div>
                        )}
                    </div>
                )}

                {canAccess(['agent', 'admin']) && (
                    <>
                        <div className="nav-item">
                            <Link href="/admin/orders" className="nav-link">Orders</Link>
                        </div>
                        <div className="nav-item">
                            <Link href="/admin/mailbox" className="nav-link">Mailbox</Link>
                        </div>
                    </>
                )}

                {canAccess(['cm', 'admin']) && (
                    <div className="nav-item">
                        <Link href="/admin/blogs" className="nav-link">Blog</Link>
                    </div>
                )}

                {canAccess(['webmaster', 'admin']) && (
                    <>
                    <div>
                        <Link href="/admin/contact" className="nav-link">Contact</Link>
                    </div>
                    <div className="nav-item dropdown">
                        <button 
                            className="nav-link dropdown-toggle"
                            onClick={() => toggleDropdown('products')}
                        >
                            Products <i className="fas fa-chevron-down"></i>
                        </button>
                        {openDropdown === 'products' && (
                            <div className="dropdown-menu">
                                <Link href="/admin/products" className="dropdown-item">All Products</Link>
                                <Link href="/admin/products/create" className="dropdown-item">Add Product</Link>
                            </div>
                        )}
                    </div>
                    </>
                    
                )}
            </div>

            <div className="admin-user-menu">
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
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavAdmin;

