import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import NavAdmin from '@/Pages/Admin/components/NavAdmin';
import AdminHeader from '@/Pages/Admin/components/AdminHeader';
import './promo.css'

export default function PromoShow() {
    const { promo } = usePage().props;

    return (
        <>
            <NavAdmin />
            <div className="admin-content">
                <AdminHeader
                    title={`Promotion: ${promo.name}`}
                    breadcrumb="Admin / Promotions / View"
                />

                <div className="admin-section">
                    <div className="promo-details">
                        <div className="detail-row">
                            <strong>Name:</strong> {promo.name}
                        </div>
                        <div className="detail-row">
                            <strong>Discount:</strong> {promo.discount}%
                        </div>
                        <div className="detail-row">
                            <strong>Status:</strong>
                            <span className={`status ${promo.active ? 'active' : 'inactive'}`}>
                                {promo.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="detail-row">
                            <strong>Products Count:</strong> {promo.products.length}
                        </div>
                    </div>

                    {promo.products.length > 0 && (
                        <div className="products-section">
                            <h3>Assigned Products</h3>
                            <div className="products-grid">
                                {promo.products.map(product => (
                                    <div key={product.id} className="product-item">
                                        <Link href={route('products.show', product.id)}>
                                            <img
                                                src={product.image_front ? `/storage/products/card/${product.image_front}` : '/storage/products/default.png'}
                                                alt={product.name}
                                            />
                                            <h4>{product.name}</h4>
                                            <p>${product.price}</p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <Link href={route('promos.edit', promo.id)} className="btn-primary">
                            Edit Promotion
                        </Link>
                        <a href={route('promos.index')} className="btn-secondary">Back to List</a>
                    </div>
                </div>
            </div>
        </>
    );
}