import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './coupon.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Coupon({ coupons, flash }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [deletingCouponId, setDeletingCouponId] = useState(null);

    const handleDelete = (couponId) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            setDeletingCouponId(couponId);

            router.delete(`/admin/coupons/${couponId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Coupon deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setDeletingCouponId(null);
                },
                onError: (errors) => {
                    console.error('Error deleting coupon:', errors);
                    setDeletingCouponId(null);
                }
            });
        }
    };

    const formatDiscount = (coupon) => {
        if (coupon.discount_percentage) {
            return `${coupon.discount_percentage}% off`;
        }
        if (coupon.discount_amount) {
            return `$${coupon.discount_amount} off`;
        }
        return 'N/A';
    };

    const getStatusBadge = (coupon) => {
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

    return (
        <>
            <NavAdmin/>
            <AdminHeader title="Coupons"/>
        
        <div className="coupons-container">
            <div className="coupons-header">
                <h1 className="coupons-title">Coupon Management</h1>
                <Link href="/admin/coupons/create" className="create-coupon-btn">
                    Create New Coupon
                </Link>
            </div>

            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="coupons-table">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Discount</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td>
                                    <code className="coupon-code">{coupon.code}</code>
                                </td>
                                <td>{coupon.name}</td>
                                <td>{formatDiscount(coupon)}</td>
                                <td>
                                    {coupon.usage_count}
                                    {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                                </td>
                                <td>
                                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                                </td>
                                <td>
                                    {getStatusBadge(coupon)}
                                </td>
                                <td className="actions-cell">
                                    <Link href={`/admin/coupons/${coupon.id}`} className="action-btn view-btn">
                                        View
                                    </Link>
                                    <Link href={`/admin/coupons/${coupon.id}/edit`} className="action-btn edit-btn">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="action-btn delete-btn"
                                        disabled={deletingCouponId === coupon.id}
                                    >
                                        {deletingCouponId === coupon.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}