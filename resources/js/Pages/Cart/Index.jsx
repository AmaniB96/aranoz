import React, { useState, useMemo, useRef } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import '@/Components/Cart/cart.css';

export default function Index() {
    const { items: initialItems = [], subtotal: initialSubtotal = 0 } = usePage().props;
    const [items, setItems] = useState(initialItems);
    const prevItemsRef = useRef(initialItems);

    const subtotal = useMemo(() => {
        return items.reduce((s, it) => s + Number(it.total || (it.unit_price * it.quantity) || 0), 0);
    }, [items]);

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

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        console.log('Attempting checkout...');
        
        router.post('/checkout', {}, {
            onStart: () => {
                console.log('Checkout request started');
            },
            onSuccess: (page) => {
                console.log('Checkout successful:', page);
            },
            onError: (errors) => {
                console.error('Checkout errors:', errors);
                alert('Failed to process checkout: ' + JSON.stringify(errors));
            },
            onFinish: () => {
                console.log('Checkout request finished');
            }
        });
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
                                    <img src={it.image} alt={it.name} onError={e => e.target.src = '/storage/products/default.png'} />
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

                    <div className="cart-footer">
                        <div className="continue">
                            <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
                        </div>

                        <div className="summary">
                            <div className="subtotal">
                                <span>Subtotal</span>
                                <strong>${subtotal.toFixed(2)}</strong>
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