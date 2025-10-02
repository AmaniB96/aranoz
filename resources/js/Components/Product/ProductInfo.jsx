import React from 'react';
import QtySelector from './QtySelector';
import { Link } from '@inertiajs/react';

export default function ProductInfo({ product, qty, setQty, onAddToCart, onLike, isLiked, likesCount, isLiking }) {
    const inStock = product.stock > 0;

    return (
        <div className="product-info">
            <div className="nav-prev-next">
                <span>Previous</span> <span className="divider">|</span> <span>Next</span>
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-prices">
                {product.discounted_price ? (
                    <>
                        <span className="original">${product.price}</span>
                        <span className="discount">(-{product.discount_percent}%)</span>
                        <span className="final">${product.discounted_price}</span>
                    </>
                ) : (
                    <span className="final">${product.price}</span>
                )}
            </div>

            <ul className="meta-list">
                <li><strong>Category</strong> : <Link href="#">{product.productCategory?.name ?? '—'}</Link></li>
                <li><strong>Availability</strong> : {inStock ? 'In Stock' : 'Out of stock'}</li>
            </ul>

            <hr />

            <p className="product-desc">{product.description}</p>

            <div className="product-actions-row">
                <QtySelector qty={qty} setQty={setQty} />
                <button className="btn-add-to-cart" onClick={onAddToCart}>ADD TO CART</button>
                <button 
                    className="btn-like" 
                    title={isLiked ? 'Unlike this product' : 'Like this product'}
                    onClick={onLike}
                    disabled={isLiking}
                >
                    <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} 
                       style={isLiked ? {color: '#de5445'} : {}}></i>
                </button>
            </div>
        </div>
    );
}