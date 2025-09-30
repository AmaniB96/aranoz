import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    const addToCart = async (e) => {
        e.preventDefault();

        if (!user) {
            if (confirm('You must be logged in to add products to cart. Go to login?')) {
                router.visit('/login');
            }
            return;
        }

        const payload = { product_id: product.id, qty: 1 };
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;

        if (!csrf) {
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'CSRF token missing — refresh page' } }));
            return;
        }

        try {
            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Please login to add products to cart' } }));
                return;
            }

            const json = await res.json();

            if (json.success) {
                // use server cartCount when provided (live, authoritative)
                window.dispatchEvent(new CustomEvent('cart:added', {
                    detail: {
                        cartCount: typeof json.cartCount === 'number' ? json.cartCount : null,
                        productId: product.id,
                        qty: 1,
                        name: product.name,
                        image: product.image_url
                    }
                }));
            } else {
                window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: json.message || 'Could not add to cart' } }));
            }
        } catch (err) {
            console.error(err);
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Network error' } }));
        }
    };

    return (
        <article className="product-card">
            <Link href={`/products/${product.id}`} className="product-link">
                <div className="product-thumb">
                    <img src={product.image_url} alt={product.name}
                        onError={(e) => { e.target.src = '/storage/products/default.png'; }} />
                </div>
                <h3 className="product-name">{product.name}</h3>
            </Link>

            <div className="product-meta">
                {product.discounted_price ? (
                    <div className="price">
                        <span className="original">${product.price}</span>
                        <span className="discounted">${product.discounted_price}</span>
                    </div>
                ) : (
                    <div className="price"><span>${product.price}</span></div>
                )}

                <div className="product-actions">
                    <button onClick={addToCart} className="btn-add">Add to cart</button>
                    <button type="button"><i className="fa-regular fa-heart"></i></button>
                </div>
            </div>
        </article>
    );
}