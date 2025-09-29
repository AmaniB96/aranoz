import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const addToCart = async (e) => {
        e.preventDefault();
        try {
            await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ product_id: product.id, qty: 1 })
            });
            // minimal feedback
            alert('Product added to cart');
        } catch (err) {
            console.error(err);
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
                </div>
            </div>
        </article>
    );
}