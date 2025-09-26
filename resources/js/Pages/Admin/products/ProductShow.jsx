import React from 'react';
import { Link } from '@inertiajs/react';
import './productShow.css';

export default function ProductShow({ product, flash }) {
    return (
        <div className="product-show-container">
            <div className="product-show-header">
                <h1 className="product-show-title">{product.name}</h1>
                <div className="product-show-actions">
                    <Link href={`/admin/products/${product.id}/edit`} className="edit-product-btn">
                        Edit Product
                    </Link>
                    <Link href="/admin/products" className="back-btn">
                        Back to Products
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <div className="product-content">
                <div className="product-main-info">
                    <div className="product-details">
                        <h2>Product Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <strong>Description:</strong>
                                <p>{product.description}</p>
                            </div>
                            <div className="info-item">
                                <strong>Price:</strong>
                                <span>${product.price}</span>
                            </div>
                            <div className="info-item">
                                <strong>Stock:</strong>
                                <span>{product.stock}</span>
                            </div>
                            <div className="info-item">
                                <strong>Available:</strong>
                                <span className={`status-badge ${product.available ? 'available' : 'unavailable'}`}>
                                    {product.available ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>Pinned:</strong>
                                <span className={`status-badge ${product.isPinned ? 'pinned' : 'not-pinned'}`}>
                                    {product.isPinned ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>Category:</strong>
                                <span>{product.product_category?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <strong>Color:</strong>
                                <span>{product.color?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <strong>Promo:</strong>
                                <span>{product.promo?.name || 'None'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="product-images">
                        <h2>Product Images</h2>
                        <div className="images-grid">
                            {product.image_front && (
                                <div className="image-item">
                                    <h3>Front</h3>
                                    <img src={`/storage/${product.image_front}`} alt="Front view" />
                                </div>
                            )}
                            {product.image_left && (
                                <div className="image-item">
                                    <h3>Left</h3>
                                    <img src={`/storage/${product.image_left}`} alt="Left view" />
                                </div>
                            )}
                            {product.image_right && (
                                <div className="image-item">
                                    <h3>Right</h3>
                                    <img src={`/storage/${product.image_right}`} alt="Right view" />
                                </div>
                            )}
                            {product.image_bonus && (
                                <div className="image-item">
                                    <h3>Bonus</h3>
                                    <img src={`/storage/${product.image_bonus}`} alt="Bonus view" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {product.product_detail && (
                    <div className="product-details-section">
                        <h2>Product Details</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <strong>Dimensions (W×H×D):</strong>
                                <span>{product.product_detail.width} × {product.product_detail.height} × {product.product_detail.depth} cm</span>
                            </div>
                            <div className="detail-item">
                                <strong>Weight:</strong>
                                <span>{product.product_detail.weight} kg</span>
                            </div>
                            <div className="detail-item">
                                <strong>Quality Checking:</strong>
                                <span className={`status-badge ${product.product_detail.quality_checking ? 'available' : 'unavailable'}`}>
                                    {product.product_detail.quality_checking ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <strong>Freshness Duration:</strong>
                                <span>{product.product_detail.freshness_duration || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Packaging Date:</strong>
                                <span>{product.product_detail.packaging_date ? new Date(product.product_detail.packaging_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <strong>Box Content:</strong>
                                <p>{product.product_detail.box_content || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="product-stats">
                    <h2>Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <strong>Cart Products:</strong>
                            <span>{product.cart_products?.length || 0}</span>
                        </div>
                        <div className="stat-item">
                            <strong>Liked by Users:</strong>
                            <span>{product.liked_by_users?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}