import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import './awesomeSection.css';

export default function AwesomeSection({ products }) {
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 8;
    const totalPages = Math.ceil(products.length / productsPerPage);

    const getCurrentProducts = () => {
        const startIndex = currentPage * productsPerPage;
        return products.slice(startIndex, startIndex + productsPerPage);
    };

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="awesome-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Awesome</h2>
                    <div className="navigation">
                        <button onClick={prevPage} className="nav-btn">
                            Prev
                        </button>
                        <span className="separator">|</span>
                        <button onClick={nextPage} className="nav-btn">
                            Next
                        </button>
                    </div>
                </div>

                <div className="products-grid">
                    {getCurrentProducts().map((product) => (
                        <Link 
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="product-card"
                        >
                            <div className="product-image">
                                <img 
                                    src={`/storage/products/card/${product.image_front}`} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/storage/products/default.png'; 
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">
                                    {product.promo_id ? (
                                        <>
                                            <span className="original-price">${product.price}</span>
                                            <span className="discounted-price">${product.promo_id}</span>
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