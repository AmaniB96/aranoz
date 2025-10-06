import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import './nav.css';

export default function Nav() {
    const { auth, cartCount: initialCartCount } = usePage().props;
    const user = auth?.user ?? null;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartCount, setCartCount] = useState(initialCartCount ?? 0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const hasAdminAccess = user && ['admin', 'webmaster', 'cm', 'agent'].includes(user.role?.name);

    const cartCountRef = useRef(cartCount);
    useEffect(() => { cartCountRef.current = cartCount; }, [cartCount]);

    const [toast, setToast] = useState({ visible: false, name: '', image: '', message: '' });
    const toastTimer = useRef(null);

    useEffect(() => {
        const onCartAdded = (e) => {
            const detail = e?.detail ?? {};
            if (typeof detail.cartCount === 'number') {
                setCartCount(detail.cartCount);
            } else {
                const qty = detail.qty ?? 1;
                setCartCount(c => c + qty);
            }

            const name = detail.name ?? 'Product';
            const image = detail.image ?? '';
            setToast({ visible: true, name, image, message: 'Added to cart' });

            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast({ visible: false, name: '', image: '', message: '' }), 3000);
        };

        const onCartRemoved = (e) => {
            const detail = e?.detail ?? {};
            const newCount = (typeof detail.cartCount === 'number')
                ? detail.cartCount
                : Math.max(0, cartCountRef.current - 1);

            setCartCount(newCount);

            const name = detail.name ?? '';
            const message = newCount === 0
                ? (name ? `${name} removed — your cart is now empty` : 'Item removed — your cart is now empty')
                : (name ? `${name} removed` : 'Item removed');

            setToast({ visible: true, name: name && newCount === 0 ? name : name, image: '', message });

            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast({ visible: false, name: '', image: '', message: '' }), 3000);
        };

        const onCartCleared = (e) => {
            const detail = e?.detail ?? {};
            setCartCount(detail.cartCount || 0);
            setToast({ visible: true, name: '', image: '', message: 'Order placed successfully!' });
            
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast({ visible: false, name: '', image: '', message: '' }), 3000);
        };

        const onCartAddFailed = (e) => {
            const msg = e?.detail?.message ?? 'Could not update cart';
            setToast({ visible: true, name: '', image: '', message: msg });
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast({ visible: false, name: '', image: '', message: '' }), 3000);
        };

        window.addEventListener('cart:added', onCartAdded);
        window.addEventListener('cart:removed', onCartRemoved);
        window.addEventListener('cart:cleared', onCartCleared);
        window.addEventListener('cart:add-failed', onCartAddFailed);

        return () => {
            window.removeEventListener('cart:added', onCartAdded);
            window.removeEventListener('cart:removed', onCartRemoved);
            window.removeEventListener('cart:cleared', onCartCleared);
            window.removeEventListener('cart:add-failed', onCartAddFailed);
            if (toastTimer.current) clearTimeout(toastTimer.current);
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo"><Link href='/'>Aranoz.</Link></div>
                
                {/* Navigation desktop */}
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/shop">Shop</a>
                    <a href="/blog">Blog</a>
                    <a href="/contact">Contact</a>
                </div>

                <div className="nav-icons">
                    {/* Desktop User Menu & Cart */}
                    <div className="desktop-icons">
                        {user && (
                            <Link href="/cart" className="cart-link" aria-label="Cart">
                                <i className="fas fa-shopping-cart"></i>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        )}

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
                                            
                                            {hasAdminAccess && (
                                                <Link href="/admin" className="user-menu-item admin-link">
                                                    <i className="fas fa-tachometer-alt"></i> Admin Dashboard
                                                </Link>
                                            )}
                                            
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

                    {/* Mobile Icons - Burger à gauche, Panier à droite */}
                    <div className="mobile-icons">
                        {/* Burger Menu */}
                        <div 
                            className={`burger-menu ${mobileMenuOpen ? 'active' : ''}`}
                            onClick={toggleMobileMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        {user && (
                            <Link href="/cart" className="cart-link mobile-cart" aria-label="Cart">
                                <i className="fas fa-shopping-cart"></i>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
            <div 
                className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            ></div>

            {/* Menu Mobile - Slide de la gauche maintenant */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-links">
                    <Link href="/" onClick={closeMobileMenu}>Home</Link>
                    <Link href="/shop" onClick={closeMobileMenu}>Shop</Link>
                    <Link href="/blog" onClick={closeMobileMenu}>Blog</Link>
                    <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>
                </div>

                {user ? (
                    <div className="mobile-user-section">
                        <div className="mobile-user-info">
                            <div className="mobile-user-name">{user?.name}</div>
                            <div className="mobile-user-email">{user?.email}</div>
                        </div>
                        
                        <Link href="/profile" className="mobile-menu-item" onClick={closeMobileMenu}>
                            <i className="fas fa-user"></i> Profile
                        </Link>
                        
                        {hasAdminAccess && (
                            <Link href="/admin" className="mobile-menu-item admin-link" onClick={closeMobileMenu}>
                                <i className="fas fa-tachometer-alt"></i> Admin Dashboard
                            </Link>
                        )}
                        
                        <Link href="/logout" method="post" as="button" className="mobile-menu-item logout" onClick={closeMobileMenu}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </Link>
                    </div>
                ) : (
                    <Link href="/login" className="mobile-login-btn" onClick={closeMobileMenu}>
                        Login
                    </Link>
                )}
            </div>

            <div className={`cart-toast ${toast.visible ? 'visible' : ''}`}>
                {toast.image && <img src={toast.image} alt={toast.name} onError={(e)=> e.target.style.display='none'} />}
                <div className="toast-text">
                    {toast.name ? <strong>{toast.name}</strong> : null}
                    <div>{toast.message}</div>
                </div>
            </div>
        </>
    );
}