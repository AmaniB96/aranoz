import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';
import './couponEdit.css';


export default function CouponEdit({ coupon = null, categories = [] }) {
    const isEditing = !!coupon;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: coupon?.code || '',
        name: coupon?.name || '',
        description: coupon?.description || '',
        discount_percentage: coupon?.discount_percentage || '',
        discount_amount: coupon?.discount_amount || '',
        min_purchase_amount: coupon?.min_purchase_amount || '',
        usage_limit: coupon?.usage_limit || '',
        expires_at: coupon?.expires_at ? coupon.expires_at.split('T')[0] : '',
        is_active: coupon?.is_active ?? true,
        applicable_categories: coupon?.applicable_categories || [],
    });

    const [discountType, setDiscountType] = useState(
        coupon?.discount_percentage ? 'percentage' : coupon?.discount_amount ? 'amount' : 'percentage'
    );

    useEffect(() => {
        if (data.discount_percentage && discountType === 'percentage') {
            setData('discount_amount', '');
        } else if (data.discount_amount && discountType === 'amount') {
            setData('discount_percentage', '');
        }
    }, [discountType, data.discount_percentage, data.discount_amount]);

    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);
        if (type === 'percentage') {
            setData('discount_amount', '');
        } else {
            setData('discount_percentage', '');
        }
    };

    const handleCategoryToggle = (categoryId) => {
        const currentCategories = data.applicable_categories || [];
        const isSelected = currentCategories.includes(categoryId);

        if (isSelected) {
            setData('applicable_categories', currentCategories.filter(id => id !== categoryId));
        } else {
            setData('applicable_categories', [...currentCategories, categoryId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(`/admin/coupons/${coupon.id}`, {
                onSuccess: () => {
                    router.visit('/admin/coupons');
                }
            });
        } else {
            post('/admin/coupons', {
                onSuccess: () => {
                    router.visit('/admin/coupons');
                }
            });
        }
    };

    return (
        <>
            <NavAdmin/>
            <AdminHeader title={isEditing ? 'Edit Coupon' : 'Create Coupon'}/>

            <div className="coupon-edit-container">
                <div className="coupon-edit-form">
                    <form onSubmit={submit}>
                        <div className="form-section">
                            <h3>Basic Information</h3>

                            <div className="form-group">
                                <label htmlFor="code">Coupon Code *</label>
                                <input
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    className={errors.code ? 'error' : ''}
                                    placeholder="SUMMER2024"
                                    required
                                />
                                {errors.code && <span className="error-message">{errors.code}</span>}
                                <small className="form-hint">Use uppercase letters and numbers only</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Coupon Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'error' : ''}
                                    placeholder="Summer Sale 2024"
                                    required
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={errors.description ? 'error' : ''}
                                    placeholder="Optional description for this coupon"
                                    rows="3"
                                />
                                {errors.description && <span className="error-message">{errors.description}</span>}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Discount Settings</h3>

                            <div className="form-group">
                                <label>Discount Type *</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="discount_type"
                                            checked={discountType === 'percentage'}
                                            onChange={() => handleDiscountTypeChange('percentage')}
                                        />
                                        <span>Percentage (%)</span>
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="discount_type"
                                            checked={discountType === 'amount'}
                                            onChange={() => handleDiscountTypeChange('amount')}
                                        />
                                        <span>Fixed Amount ($)</span>
                                    </label>
                                </div>
                            </div>

                            {discountType === 'percentage' ? (
                                <div className="form-group">
                                    <label htmlFor="discount_percentage">Discount Percentage *</label>
                                    <input
                                        id="discount_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.discount_percentage}
                                        onChange={(e) => setData('discount_percentage', e.target.value)}
                                        className={errors.discount_percentage ? 'error' : ''}
                                        placeholder="20"
                                        required
                                    />
                                    {errors.discount_percentage && <span className="error-message">{errors.discount_percentage}</span>}
                                    <small className="form-hint">Enter percentage (0-100)</small>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="discount_amount">Discount Amount *</label>
                                    <input
                                        id="discount_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.discount_amount}
                                        onChange={(e) => setData('discount_amount', e.target.value)}
                                        className={errors.discount_amount ? 'error' : ''}
                                        placeholder="50.00"
                                        required
                                    />
                                    {errors.discount_amount && <span className="error-message">{errors.discount_amount}</span>}
                                    <small className="form-hint">Enter fixed amount in dollars</small>
                                </div>
                            )}
                        </div>

                        <div className="form-section">
                            <h3>Usage Restrictions</h3>

                            <div className="form-group">
                                <label htmlFor="min_purchase_amount">Minimum Purchase Amount</label>
                                <input
                                    id="min_purchase_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.min_purchase_amount}
                                    onChange={(e) => setData('min_purchase_amount', e.target.value)}
                                    className={errors.min_purchase_amount ? 'error' : ''}
                                    placeholder="100.00"
                                />
                                {errors.min_purchase_amount && <span className="error-message">{errors.min_purchase_amount}</span>}
                                <small className="form-hint">Leave empty for no minimum</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="usage_limit">Usage Limit</label>
                                <input
                                    id="usage_limit"
                                    type="number"
                                    min="1"
                                    value={data.usage_limit}
                                    onChange={(e) => setData('usage_limit', e.target.value)}
                                    className={errors.usage_limit ? 'error' : ''}
                                    placeholder="100"
                                />
                                {errors.usage_limit && <span className="error-message">{errors.usage_limit}</span>}
                                <small className="form-hint">Leave empty for unlimited usage</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="expires_at">Expiration Date</label>
                                <input
                                    id="expires_at"
                                    type="date"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                    className={errors.expires_at ? 'error' : ''}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.expires_at && <span className="error-message">{errors.expires_at}</span>}
                                <small className="form-hint">Leave empty for no expiration</small>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Categories (Optional)</h3>
                            <p className="form-hint">Select categories this coupon applies to. Leave empty to apply to all products.</p>

                            <div className="categories-grid">
                                {categories.map((category) => (
                                    <label key={category.id} className="category-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={data.applicable_categories?.includes(category.id) || false}
                                            onChange={() => handleCategoryToggle(category.id)}
                                        />
                                        <span className="checkmark"></span>
                                        {category.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Status</h3>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => router.visit('/admin/coupons')}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-submit"
                            >
                                {processing ? 'Saving...' : (isEditing ? 'Update Coupon' : 'Create Coupon')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}