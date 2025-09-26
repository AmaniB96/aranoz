import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import './navAdmin.css';

export default function NavAdmin() {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-logo">
                <span className="logo-text">Admin.</span>
                <span className="admin-badge">admin</span>
            </div>
            
            <div className="admin-nav-links">
                <div className="nav-item dropdown">
                    <button 
                        className="nav-link dropdown-toggle"
                        onClick={() => toggleDropdown('admin')}
                    >
                        Admin <i className="fas fa-chevron-down"></i>
                    </button>
                    {openDropdown === 'admin' && (
                        <div className="dropdown-menu">
                            <Link href="/admin/dashboard" className="dropdown-item">Dashboard</Link>
                            <Link href="/admin/settings" className="dropdown-item">Settings</Link>
                            <Link href="/admin/logs" className="dropdown-item">Logs</Link>
                        </div>
                    )}
                </div>

                <div className="nav-item dropdown">
                    <button 
                        className="nav-link dropdown-toggle"
                        onClick={() => toggleDropdown('users')}
                    >
                        Users <i className="fas fa-chevron-down"></i>
                    </button>
                    {openDropdown === 'users' && (
                        <div className="dropdown-menu">
                            <Link href="/admin/user" className="dropdown-item">All Users</Link>
                            <Link href="/admin/user/create" className="dropdown-item">Add User</Link>
                            <Link href="/admin/roles" className="dropdown-item">Roles</Link>
                        </div>
                    )}
                </div>

                <div className="nav-item">
                    <Link href="/admin/orders" className="nav-link">Orders</Link>
                </div>

                <div className="nav-item dropdown">
                    <button 
                        className="nav-link dropdown-toggle"
                        onClick={() => toggleDropdown('blog')}
                    >
                        Blog <i className="fas fa-chevron-down"></i>
                    </button>
                    {openDropdown === 'blog' && (
                        <div className="dropdown-menu">
                            <Link href="/admin/blogs" className="dropdown-item">All Blogs</Link>
                            <Link href="/admin/blogs/create" className="dropdown-item">Add Blog</Link>
                            <Link href="/admin/categories" className="dropdown-item">Categories</Link>
                        </div>
                    )}
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
                            <Link href="/admin/product-categories" className="dropdown-item">Categories</Link>
                            <Link href="/admin/colors" className="dropdown-item">Colors</Link>
                            <Link href="/admin/promos" className="dropdown-item">Promos</Link>
                        </div>
                    )}
                </div>

                <div className="nav-item dropdown">
                    <button 
                        className="nav-link dropdown-toggle"
                        onClick={() => toggleDropdown('mailbox')}
                    >
                        Mailbox <i className="fas fa-chevron-down"></i>
                    </button>
                    {openDropdown === 'mailbox' && (
                        <div className="dropdown-menu">
                            <Link href="/admin/mailbox" className="dropdown-item">Inbox</Link>
                            <Link href="/admin/mailbox/archived" className="dropdown-item">Archived</Link>
                            <Link href="/admin/contact" className="dropdown-item">Contact Settings</Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="admin-user-menu">
                <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                </div>
            </div>
        </nav>
    );
}

