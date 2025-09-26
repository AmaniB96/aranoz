import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import './productEdit.css';

export default function ProductEdit({ product, categories, colors, promos, flash }) {
    const isEditing = !!product;

    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        image_front: product?.image_front || '',
        image_left: product?.image_left || '',
        image_right: product?.image_right || '',
        image_bonus: product?.image_bonus || '',
        stock: product?.stock || '',
        isPinned: product?.isPinned || false,
        available: product?.available !== undefined ? product.available : true,
        product_category_id: product?.product_category_id || '',
        color_id: product?.color_id || '',
        promo_id: product?.promo_id || '',
        // ProductDetail fields
        width: product?.product_detail?.width || '',
        height: product?.product_detail?.height || '',
        depth: product?.product_detail?.depth || '',
        weight: product?.product_detail?.weight || '',
        quality_checking: product?.product_detail?.quality_checking || false,
        freshness_duration: product?.product_detail?.freshness_duration || '',
        packaging_date: product?.product_detail?.packaging_date ? new Date(product.product_detail.packaging_date).toISOString().split('T')[0] : '',
        box_content: product?.product_detail?.box_content || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(`/admin/products/${product.id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by redirect
                }
            });
        } else {
            post('/admin/products', {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by redirect
                }
            });
        }
    };

    return (
        <div className="product-edit-container">
            <div className="product-edit-header">
                <h1 className="product-edit-title">
                    {isEditing ? 'Edit Product' : 'Create New Product'}
                </h1>
                <a href="/admin/products" className="back-btn">
                    Back to Products
                </a>
            </div>

            {flash?.success && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price *</label>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className={errors.price ? 'error' : ''}
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">Stock *</label>
                            <input
                                type="number"
                                id="stock"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className={errors.stock ? 'error' : ''}
                            />
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_category_id">Category *</label>
                            <select
                                id="product_category_id"
                                value={data.product_category_id}
                                onChange={(e) => setData('product_category_id', e.target.value)}
                                className={errors.product_category_id ? 'error' : ''}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_category_id && <span className="error-message">{errors.product_category_id}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="color_id">Color *</label>
                            <select
                                id="color_id"
                                value={data.color_id}
                                onChange={(e) => setData('color_id', e.target.value)}
                                className={errors.color_id ? 'error' : ''}
                            >
                                <option value="">Select Color</option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                            {errors.color_id && <span className="error-message">{errors.color_id}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="promo_id">Promo</label>
                            <select
                                id="promo_id"
                                value={data.promo_id}
                                onChange={(e) => setData('promo_id', e.target.value)}
                                className={errors.promo_id ? 'error' : ''}
                            >
                                <option value="">No Promo</option>
                                {promos.map((promo) => (
                                    <option key={promo.id} value={promo.id}>
                                        {promo.name}
                                    </option>
                                ))}
                            </select>
                            {errors.promo_id && <span className="error-message">{errors.promo_id}</span>}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="4"
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={data.available}
                                onChange={(e) => setData('available', e.target.checked)}
                            />
                            Available
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={data.isPinned}
                                onChange={(e) => setData('isPinned', e.target.checked)}
                            />
                            Pinned
                        </label>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Images</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="image_front">Front Image URL</label>
                            <input
                                type="text"
                                id="image_front"
                                value={data.image_front}
                                onChange={(e) => setData('image_front', e.target.value)}
                                placeholder="e.g., product/image.jpg"
                                className={errors.image_front ? 'error' : ''}
                            />
                            {errors.image_front && <span className="error-message">{errors.image_front}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="image_left">Left Image URL</label>
                            <input
                                type="text"
                                id="image_left"
                                value={data.image_left}
                                onChange={(e) => setData('image_left', e.target.value)}
                                placeholder="e.g., product/image.jpg"
                                className={errors.image_left ? 'error' : ''}
                            />
                            {errors.image_left && <span className="error-message">{errors.image_left}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="image_right">Right Image URL</label>
                            <input
                                type="text"
                                id="image_right"
                                value={data.image_right}
                                onChange={(e) => setData('image_right', e.target.value)}
                                placeholder="e.g., product/image.jpg"
                                className={errors.image_right ? 'error' : ''}
                            />
                            {errors.image_right && <span className="error-message">{errors.image_right}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="image_bonus">Bonus Image URL</label>
                            <input
                                type="text"
                                id="image_bonus"
                                value={data.image_bonus}
                                onChange={(e) => setData('image_bonus', e.target.value)}
                                placeholder="e.g., product/image.jpg"
                                className={errors.image_bonus ? 'error' : ''}
                            />
                            {errors.image_bonus && <span className="error-message">{errors.image_bonus}</span>}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Product Details (Optional)</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="width">Width (cm)</label>
                            <input
                                type="number"
                                id="width"
                                step="0.01"
                                value={data.width}
                                onChange={(e) => setData('width', e.target.value)}
                                className={errors.width ? 'error' : ''}
                            />
                            {errors.width && <span className="error-message">{errors.width}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="height">Height (cm)</label>
                            <input
                                type="number"
                                id="height"
                                step="0.01"
                                value={data.height}
                                onChange={(e) => setData('height', e.target.value)}
                                className={errors.height ? 'error' : ''}
                            />
                            {errors.height && <span className="error-message">{errors.height}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="depth">Depth (cm)</label>
                            <input
                                type="number"
                                id="depth"
                                step="0.01"
                                value={data.depth}
                                onChange={(e) => setData('depth', e.target.value)}
                                className={errors.depth ? 'error' : ''}
                            />
                            {errors.depth && <span className="error-message">{errors.depth}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight">Weight (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                step="0.01"
                                value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)}
                                className={errors.weight ? 'error' : ''}
                            />
                            {errors.weight && <span className="error-message">{errors.weight}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="freshness_duration">Freshness Duration</label>
                            <input
                                type="text"
                                id="freshness_duration"
                                value={data.freshness_duration}
                                onChange={(e) => setData('freshness_duration', e.target.value)}
                                className={errors.freshness_duration ? 'error' : ''}
                            />
                            {errors.freshness_duration && <span className="error-message">{errors.freshness_duration}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="packaging_date">Packaging Date</label>
                            <input
                                type="date"
                                id="packaging_date"
                                value={data.packaging_date}
                                onChange={(e) => setData('packaging_date', e.target.value)}
                                className={errors.packaging_date ? 'error' : ''}
                            />
                            {errors.packaging_date && <span className="error-message">{errors.packaging_date}</span>}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="box_content">Box Content</label>
                        <textarea
                            id="box_content"
                            value={data.box_content}
                            onChange={(e) => setData('box_content', e.target.value)}
                            rows="3"
                            className={errors.box_content ? 'error' : ''}
                        />
                        {errors.box_content && <span className="error-message">{errors.box_content}</span>}
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={data.quality_checking}
                                onChange={(e) => setData('quality_checking', e.target.checked)}
                            />
                            Quality Checking
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={processing} className="submit-btn">
                        {processing ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
}