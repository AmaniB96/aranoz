import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import NavAdmin from '@/Pages/Admin/components/NavAdmin';
import AdminHeader from '@/Pages/Admin/components/AdminHeader';
import '@/Pages/Admin/products/productEdit.css';

export default function ProductEdit() {
    const { product, categories, colors, promos } = usePage().props;
    const isEditing = !!product;

    // CORRECTION : Formater les dates correctement
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        image_front: null,
        image_front_url: '',
        image_left: null,
        image_left_url: '',
        image_right: null,
        image_right_url: '',
        image_bonus: null,
        image_bonus_url: '',
        stock: product?.stock || 0,
        isPinned: product?.isPinned || false,
        available: product?.available !== undefined ? product.available : true,
        product_category_id: product?.product_category_id || '',
        color_id: product?.color_id || '',
        promo_id: product?.promo_id || '',
        // Product details - CORRECTION : Convertir tous en string
        width: product?.productDetail?.width?.toString() || '',
        height: product?.productDetail?.height?.toString() || '',
        depth: product?.productDetail?.depth?.toString() || '',
        weight: product?.productDetail?.weight?.toString() || '',
        quality_checking: product?.productDetail?.quality_checking || false,
        freshness_duration: product?.productDetail?.freshness_duration?.toString() || '', // CORRECTION: forcer en string
        packaging_date: formatDateForInput(product?.productDetail?.packaging_date),
        box_content: product?.productDetail?.box_content || '',
    });

    const [imagePreviews, setImagePreviews] = useState({
        front: null,
        left: null,
        right: null,
        bonus: null,
    });

    useEffect(() => {
        if (product) {
            setImagePreviews({
                front: product.image_front ? `/storage/products/card/${product.image_front}` : null,
                left: product.image_left ? `/storage/products/card/${product.image_left}` : null,
                right: product.image_right ? `/storage/products/card/${product.image_right}` : null,
                bonus: product.image_bonus ? `/storage/products/card/${product.image_bonus}` : null,
            });
        }
    }, [product]);

    const handleImageChange = (field, file) => {
        setData(field, file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => ({ ...prev, [field.replace('image_', '')]: e.target.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviews(prev => ({ ...prev, [field.replace('image_', '')]: null }));
        }
    };

    const handleUrlChange = (field, url) => {
        setData(field, url);
        setData(field.replace('_url', ''), null);
        setImagePreviews(prev => ({ ...prev, [field.replace('image_', '').replace('_url', '')]: url }));
    };

    const handleImageError = (imageType) => {
        setImagePreviews(prev => ({ ...prev, [imageType]: null }));
    };

    const submit = (e) => {
        e.preventDefault();
        
        console.log('Form data before submit:', data);

        // CORRECTION : Nettoyer et convertir les données
        const cleanData = { ...data };
        
        // Supprimer les champs image null ou vides
        if (!cleanData.image_front) delete cleanData.image_front;
        if (!cleanData.image_left) delete cleanData.image_left;
        if (!cleanData.image_right) delete cleanData.image_right;
        if (!cleanData.image_bonus) delete cleanData.image_bonus;
        
        if (!cleanData.image_front_url || cleanData.image_front_url === '') delete cleanData.image_front_url;
        if (!cleanData.image_left_url || cleanData.image_left_url === '') delete cleanData.image_left_url;
        if (!cleanData.image_right_url || cleanData.image_right_url === '') delete cleanData.image_right_url;
        if (!cleanData.image_bonus_url || cleanData.image_bonus_url === '') delete cleanData.image_bonus_url;

        // CORRECTION : Convertir promo_id vide en null et s'assurer que c'est un nombre
        if (cleanData.promo_id === '' || cleanData.promo_id === null) {
            cleanData.promo_id = null;
        } else {
            cleanData.promo_id = parseInt(cleanData.promo_id);
        }

        // CORRECTION : S'assurer que freshness_duration est une string ou null
        if (cleanData.freshness_duration !== '' && cleanData.freshness_duration !== null) {
            cleanData.freshness_duration = String(cleanData.freshness_duration);
        } else {
            cleanData.freshness_duration = null;
        }

        // Convertir les champs numériques en nombres ou null
        ['width', 'height', 'depth', 'weight'].forEach(field => {
            if (cleanData[field] === '' || cleanData[field] === null) {
                cleanData[field] = null;
            } else {
                cleanData[field] = parseFloat(cleanData[field]);
            }
        });

        // Convertir stock et price en nombres
        cleanData.stock = parseInt(cleanData.stock);
        cleanData.price = parseFloat(cleanData.price);
        cleanData.product_category_id = parseInt(cleanData.product_category_id);
        cleanData.color_id = parseInt(cleanData.color_id);

        console.log('Cleaned data:', cleanData);

        if (isEditing) {
            put(route('products.update', product.id), cleanData, {
                onSuccess: (response) => {
                    console.log('Update successful:', response);
                },
                onError: (errors) => {
                    console.log('Update errors:', errors);
                },
                onFinish: () => {
                    console.log('Request finished');
                }
            });
        } else {
            post(route('products.store'), cleanData, {
                onSuccess: (response) => {
                    console.log('Create successful:', response);
                },
                onError: (errors) => {
                    console.log('Create errors:', errors);
                }
            });
        }
    };

    return (
        <>
            <NavAdmin />
            <div className="admin-content">
                <AdminHeader 
                    title={isEditing ? 'Edit Product' : 'Create Product'} 
                    breadcrumb={isEditing ? 'Products / Edit' : 'Products / Create'}
                />

                <div className="product-edit-container">
                    {Object.keys(errors).length > 0 && (
                        <div style={{background: '#f8d7da', padding: '10px', marginBottom: '20px', borderRadius: '4px'}}>
                            <h4>Errors:</h4>
                            <ul>
                                {Object.keys(errors).map(key => (
                                    <li key={key}>{key}: {errors[key]}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={submit} className="product-form">
                        {/* Section Informations de base */}
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="name">Product Name *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={errors.name ? 'error' : ''}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">Price *</label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className={errors.price ? 'error' : ''}
                                    />
                                    {errors.price && <span className="error-message">{errors.price}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock">Stock *</label>
                                    <input
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        className={errors.stock ? 'error' : ''}
                                    />
                                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="product_category_id">Category *</label>
                                    <select
                                        id="product_category_id"
                                        value={data.product_category_id}
                                        onChange={e => setData('product_category_id', e.target.value)}
                                        className={errors.product_category_id ? 'error' : ''}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
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
                                        onChange={e => setData('color_id', e.target.value)}
                                        className={errors.color_id ? 'error' : ''}
                                    >
                                        <option value="">Select Color</option>
                                        {colors.map(color => (
                                            <option key={color.id} value={color.id}>
                                                {color.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.color_id && <span className="error-message">{errors.color_id}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="promo_id">Promotion (Optional)</label>
                                    <select
                                        id="promo_id"
                                        value={data.promo_id || ''}
                                        onChange={e => setData('promo_id', e.target.value)}
                                        className={errors.promo_id ? 'error' : ''}
                                    >
                                        <option value="">No Promotion</option>
                                        {promos.filter(promo => promo.active).map(promo => (
                                            <option key={promo.id} value={promo.id}>
                                                {promo.name} (-{promo.discount}%)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.promo_id && <span className="error-message">{errors.promo_id}</span>}
                                    {data.promo_id && (
                                        <small className="promo-info">
                                            Selected promo: {promos.find(p => p.id == data.promo_id)?.name} 
                                            (-{promos.find(p => p.id == data.promo_id)?.discount}%)
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className={errors.description ? 'error' : ''}
                                />
                                {errors.description && <span className="error-message">{errors.description}</span>}
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={data.available}
                                        onChange={e => setData('available', e.target.checked)}
                                    />
                                    Available for sale
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={data.isPinned}
                                        onChange={e => setData('isPinned', e.target.checked)}
                                    />
                                    Pin this product
                                </label>
                            </div>
                        </div>

                        {/* Images section - identique à la version précédente */}
                        <div className="form-section">
                            <h3>Product Images</h3>
                            <div className="images-grid">
                                <div className="image-upload-group">
                                    <label>Front Image</label>
                                    <div className="image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageChange('image_front', e.target.files[0])}
                                            className="file-input"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Or enter image URL"
                                            value={data.image_front_url}
                                            onChange={e => handleUrlChange('image_front_url', e.target.value)}
                                            className="url-input"
                                        />
                                        {imagePreviews.front && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreviews.front} 
                                                    alt="Front preview" 
                                                    onError={() => handleImageError('front')}
                                                />
                                                <div className="image-info">
                                                    {product?.image_front ? `Current: ${product.image_front}` : 'From URL'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="image-upload-group">
                                    <label>Left Image</label>
                                    <div className="image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageChange('image_left', e.target.files[0])}
                                            className="file-input"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Or enter image URL"
                                            value={data.image_left_url}
                                            onChange={e => handleUrlChange('image_left_url', e.target.value)}
                                            className="url-input"
                                        />
                                        {imagePreviews.left && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreviews.left} 
                                                    alt="Left preview" 
                                                    onError={() => handleImageError('left')}
                                                />
                                                <div className="image-info">
                                                    {product?.image_left ? `Current: ${product.image_left}` : 'From URL'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="image-upload-group">
                                    <label>Right Image</label>
                                    <div className="image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageChange('image_right', e.target.files[0])}
                                            className="file-input"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Or enter image URL"
                                            value={data.image_right_url}
                                            onChange={e => handleUrlChange('image_right_url', e.target.value)}
                                            className="url-input"
                                        />
                                        {imagePreviews.right && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreviews.right} 
                                                    alt="Right preview" 
                                                    onError={() => handleImageError('right')}
                                                />
                                                <div className="image-info">
                                                    {product?.image_right ? `Current: ${product.image_right}` : 'From URL'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="image-upload-group">
                                    <label>Bonus Image</label>
                                    <div className="image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageChange('image_bonus', e.target.files[0])}
                                            className="file-input"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Or enter image URL"
                                            value={data.image_bonus_url}
                                            onChange={e => handleUrlChange('image_bonus_url', e.target.value)}
                                            className="url-input"
                                        />
                                        {imagePreviews.bonus && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreviews.bonus} 
                                                    alt="Bonus preview" 
                                                    onError={() => handleImageError('bonus')}
                                                />
                                                <div className="image-info">
                                                    {product?.image_bonus ? `Current: ${product.image_bonus}` : 'From URL'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Détails produit */}
                        <div className="form-section">
                            <h3>Product Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="width">Width (cm)</label>
                                    <input
                                        id="width"
                                        type="number"
                                        step="0.1"
                                        value={data.width}
                                        onChange={e => setData('width', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="height">Height (cm)</label>
                                    <input
                                        id="height"
                                        type="number"
                                        step="0.1"
                                        value={data.height}
                                        onChange={e => setData('height', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="depth">Depth (cm)</label>
                                    <input
                                        id="depth"
                                        type="number"
                                        step="0.1"
                                        value={data.depth}
                                        onChange={e => setData('depth', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight">Weight (kg)</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        step="0.01"
                                        value={data.weight}
                                        onChange={e => setData('weight', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="freshness_duration">Freshness Duration (days)</label>
                                    <input
                                        id="freshness_duration"
                                        type="text"
                                        value={data.freshness_duration}
                                        onChange={e => setData('freshness_duration', e.target.value)}
                                        placeholder="e.g., 365 days"
                                    />
                                    {errors.freshness_duration && <span className="error-message">{errors.freshness_duration}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="packaging_date">Packaging Date</label>
                                    <input
                                        id="packaging_date"
                                        type="date"
                                        value={data.packaging_date}
                                        onChange={e => setData('packaging_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="box_content">Box Content</label>
                                <textarea
                                    id="box_content"
                                    value={data.box_content}
                                    onChange={e => setData('box_content', e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={data.quality_checking}
                                        onChange={e => setData('quality_checking', e.target.checked)}
                                    />
                                    Quality Checking Required
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}