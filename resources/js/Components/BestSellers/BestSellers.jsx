import React from 'react';
import { Link } from '@inertiajs/react';
import './bestSellers.css';

export default function BestSellers({ products = [] }) {
    // Si pas de produits, ne rien afficher
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="best-sellers">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Best Sellers</h2>
                    <div className="navigation">
                        <span className="nav-text">View</span>
                        <span className="separator">|</span>
                        <span className="nav-text">Previous</span>
                    </div>
                </div>

                <div className="products-grid">
                    {products.slice(0, 4).map((product) => (
                        <Link 
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="product-card"
                        >
                            <div className="product-image">
                                <img 
                                    src={product.image_front ? `/storage/products/card/${product.image_front}` : '/storage/products/default.png'} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/storage/products/default.png'; 
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">
                                    {product.discounted_price ? (
                                        <>
                                            <span className="original-price">${product.price}</span>
                                            <span className="discounted-price">${product.discounted_price}</span>
                                        </>
                                    ) : (
                                        <span className="price">${product.price}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}