import React from 'react';
import { Link } from '@inertiajs/react';
import './featuredCategory.css';

export default function FeaturedCategory({ categories }) {
    // Images hardcodées pour les 4 catégories
    const categoryImages = [
        '/storage/products/card/feature_1.png',
        '/storage/products/card/feature_2.png', 
        '/storage/products/card/feature_3.png',
        '/storage/products/card/feature_4.png'
    ];

    return (
        <section className="featured-category">
            <div className="container">
                <h2 className="section-title">Featured Category</h2>
                <div className="categories-grid">
                    {categories.slice(0, 4).map((category, index) => (
                        <Link 
                            key={category.id} 
                            href={`/shop?category=${category.id}`}
                            className={`category-card card-${index + 1}`} // AJOUT: classe spécifique
                        >
                            <div className="category-info">
                                <span className="category-label">Featured Products</span>
                                <h3 className="category-name">{category.name}</h3>
                            </div>
                            <div className="category-image">
                                <img 
                                    src={categoryImages[index] || '/storage/products/card/feature_1.png'} 
                                    alt={category.name}
                                    onError={(e) => {
                                        e.target.src = '/storage/products/card/feature_1.png';
                                    }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}