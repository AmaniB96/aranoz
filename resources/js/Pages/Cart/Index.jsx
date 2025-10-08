import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import '@/Components/Cart/cart.css';

export default function Index() {
    const { items: initialItems = [], subtotal: initialSubtotal = 0, appliedCoupon: initialAppliedCoupon } = usePage().props;
    const [items, setItems] = useState(initialItems);
    const prevItemsRef = useRef(initialItems);

    // États pour les coupons - INITIALISER AVEC LA VALEUR DU BACKEND
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(initialAppliedCoupon || null);
    const [couponError, setCouponError] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const subtotal = useMemo(() => {
        return items.reduce((s, it) => s + Number(it.total || (it.unit_price * it.quantity) || 0), 0);
    }, [items]);

    // Calcul du total avec réduction
    const discount = useMemo(() => {
        if (!appliedCoupon || subtotal === 0) return 0;
        
        if (appliedCoupon.type === 'percentage') {
            return (subtotal * appliedCoupon.value) / 100;
        } else if (appliedCoupon.type === 'fixed') {
            return Math.min(appliedCoupon.value, subtotal); // Ne pas dépasser le subtotal
        }
        return 0;
    }, [appliedCoupon, subtotal]);

    const total = useMemo(() => {
        return Math.max(0, subtotal - discount);
    }, [subtotal, discount]);

    const updateQty = async (id, qty) => {
        const prev = items;
        prevItemsRef.current = prev;
        setItems(prevItems => prevItems.map(it => it.id === id ? { ...it, quantity: qty, total: Number((it.unit_price * qty).toFixed(2)) } : it));

        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;
        if (!csrf) {
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'CSRF token missing — refresh page' } }));
            setItems(prev);
            return;
        }

        try {
            const res = await fetch(`/cart/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({ quantity: qty })
            });

            if (!res.ok) {
                throw new Error('Update failed');
            }

            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Update failed');

            if (typeof json.cartCount === 'number') {
                window.dispatchEvent(new CustomEvent('cart:added', { detail: { cartCount: json.cartCount } }));
            }
        } catch (err) {
            console.error(err);
            setItems(prevItemsRef.current);
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Could not update quantity' } }));
        }
    };

    const remove = async (id, name) => {
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;
        if (!csrf) {
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'CSRF token missing — refresh page' } }));
            return;
        }

        const prev = items;
        prevItemsRef.current = prev;
        setItems(prevItems => prevItems.filter(it => it.id !== id));

        try {
            const res = await fetch(`/cart/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
            });

            if (!res.ok) {
                throw new Error('Remove failed');
            }

            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Remove failed');

            window.dispatchEvent(new CustomEvent('cart:removed', {
                detail: {
                    cartCount: typeof json.cartCount === 'number' ? json.cartCount : null,
                    name: json.removedName ?? name,
                }
            }));
        } catch (err) {
            console.error(err);
            setItems(prevItemsRef.current);
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Could not remove item' } }));
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setIsApplyingCoupon(true);
        setCouponError('');

        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;
        if (!csrf) {
            setCouponError('CSRF token missing — refresh page');
            setIsApplyingCoupon(false);
            return;
        }

        try {
            const res = await fetch('/cart/apply-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({ code: couponCode.trim() })
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Invalid coupon code');
            }

            setAppliedCoupon(json.coupon);
            setCouponCode('');
            setCouponError('');
        } catch (err) {
            console.error(err);
            setCouponError(err.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const removeCoupon = async () => {
        setIsApplyingCoupon(true);

        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;
        if (!csrf) {
            setCouponError('CSRF token missing — refresh page');
            setIsApplyingCoupon(false);
            return;
        }

        try {
            const res = await fetch('/cart/remove-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                }
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Could not remove coupon');
            }

            setAppliedCoupon(null);
            setCouponError('');
        } catch (err) {
            console.error(err);
            setCouponError(err.message || 'Could not remove coupon');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        console.log('Redirecting to checkout...');
        
        // SIMPLIFIER - Juste rediriger vers la page checkout
        // Les données seront récupérées côté serveur
        router.get('/checkout');
    };

    return (
        <>
            <Nav />
            <div className="cart-page container">
                <h2>Shopping Cart</h2>

                <div className="cart-table">
                    <div className="cart-header">
                        <div className="col product">Product</div>
                        <div className="col price">Price</div>
                        <div className="col quantity">Quantity</div>
                        <div className="col total">Total</div>
                    </div>

                    <div className="cart-body">
                        {items.length === 0 && <div className="empty">Your cart is empty.</div>}
                        {items.map(it => (
                            <div key={it.id} className="cart-row">
                                <div className="col product">
                                    <img src={it.image} alt={it.name} onError={e => e.target.src = 'public/images/placeholder.png'} />
                                    <div className="product-meta">
                                        <Link href={`/products/${it.product_id}`}>{it.name}</Link>
                                    </div>
                                </div>
                                <div className="col price">
                                    <div className="price-val">${it.unit_price}</div>
                                </div>
                                <div className="col quantity">
                                    <div className="qty-control">
                                        <button onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}>−</button>
                                        <input type="text" value={it.quantity} readOnly />
                                        <button onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
                                    </div>
                                    <button className="remove-link" onClick={() => remove(it.id, it.name)}>Remove</button>
                                </div>
                                <div className="col total">
                                    ${it.total}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section Coupon */}
                    {items.length > 0 && (
                        <div className="coupon-section">
                            <h3>Have a coupon?</h3>
                            <div className="coupon-form">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={isApplyingCoupon || appliedCoupon}
                                />
                                {!appliedCoupon ? (
                                    <button 
                                        onClick={applyCoupon}
                                        disabled={isApplyingCoupon || !couponCode.trim()}
                                        className="btn-apply-coupon"
                                    >
                                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={removeCoupon}
                                        disabled={isApplyingCoupon}
                                        className="btn-remove-coupon"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {couponError && <div className="coupon-error">{couponError}</div>}
                            {appliedCoupon && (
                                <div className="coupon-success">
                                    Coupon <strong>{appliedCoupon.code}</strong> applied! 
                                    {appliedCoupon.type === 'percentage' 
                                        ? `${appliedCoupon.value}% off`
                                        : `$${appliedCoupon.value} off`
                                    }
                                </div>
                            )}
                        </div>
                    )}

                    <div className="cart-footer">
                     

                        <div className="summary">
                            <div className="subtotal">
                                <span>Subtotal</span>
                                <strong>${subtotal.toFixed(2)}</strong>
                            </div>
                            
                            {appliedCoupon && discount > 0 && (
                                <div className="discount">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <strong>-${discount.toFixed(2)}</strong>
                                </div>
                            )}
                            
                            <div className="total">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                            
                            <div className="actions">
                                <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
                                <button 
                                    className="btn-primary" 
                                    onClick={handleCheckout}
                                    disabled={items.length === 0}
                                >
                                    Proceed to checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}