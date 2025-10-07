import React from 'react';
import { Link } from '@inertiajs/react';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';
import './CouponShow.css';

export default function CouponShow({ coupon }) {
    const formatDiscount = () => {
        if (coupon.discount_percentage) {
            return `${coupon.discount_percentage}% off`;
        }
        if (coupon.discount_amount) {
            return `$${coupon.discount_amount} off`;
        }
        return 'N/A';
    };

    const getStatusBadge = () => {
        const now = new Date();
        const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;

        if (!coupon.is_active) {
            return <span className="status-badge inactive">Inactive</span>;
        }
        if (expiresAt && expiresAt < now) {
            return <span className="status-badge expired">Expired</span>;
        }
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return <span className="status-badge used">Used Up</span>;
        }
        return <span className="status-badge active">Active</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <NavAdmin/>
            <AdminHeader title={`Coupon: ${coupon.code}`}/>

            <div className="coupon-show-container">
                <div className="coupon-show-header">
                    <div className="coupon-code-display">
                        <h1>{coupon.code}</h1>
                        {getStatusBadge()}
                    </div>
                    <div className="coupon-actions">
                        <Link href={`/admin/coupons/${coupon.id}/edit`} className="btn-edit">
                            Edit Coupon
                        </Link>
                        <Link href="/admin/coupons" className="btn-back">
                            Back to Coupons
                        </Link>
                    </div>
                </div>

                <div className="coupon-details">
                    <div className="detail-section">
                        <h3>Basic Information</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Coupon Code</label>
                                <span className="coupon-code">{coupon.code}</span>
                            </div>
                            <div className="detail-item">
                                <label>Name</label>
                                <span>{coupon.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Description</label>
                                <span>{coupon.description || 'No description'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status</label>
                                {getStatusBadge()}
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Discount Settings</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Discount Type</label>
                                <span>
                                    {coupon.discount_percentage ? 'Percentage' : coupon.discount_amount ? 'Fixed Amount' : 'N/A'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Discount Value</label>
                                <span className="discount-value">{formatDiscount()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Usage Restrictions</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Minimum Purchase</label>
                                <span>{coupon.min_purchase_amount ? `$${coupon.min_purchase_amount}` : 'No minimum'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Usage Limit</label>
                                <span>
                                    {coupon.usage_limit ? `${coupon.usage_count} / ${coupon.usage_limit}` : 'Unlimited'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Expiration Date</label>
                                <span>{formatDate(coupon.expires_at)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Times Used</label>
                                <span>{coupon.usage_count}</span>
                            </div>
                        </div>
                    </div>

                    {coupon.applicable_categories && coupon.applicable_categories.length > 0 && (
                        <div className="detail-section">
                            <h3>Applicable Categories</h3>
                            <div className="categories-list">
                                {coupon.applicable_categories.map((categoryId) => (
                                    <span key={categoryId} className="category-tag">
                                        Category {categoryId}
                                    </span>
                                ))}
                            </div>
                            <p className="note">
                                <small>* This coupon only applies to products in the selected categories.</small>
                            </p>
                        </div>
                    )}

                    <div className="detail-section">
                        <h3>Timestamps</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Created</label>
                                <span>{formatDate(coupon.created_at)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Last Updated</label>
                                <span>{formatDate(coupon.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}