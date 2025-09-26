import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './product.css';

export default function Product({ products, flash }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [deletingProductId, setDeletingProductId] = useState(null);

    const handleDelete = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setDeletingProductId(productId);

            router.delete(`/admin/products/${productId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Product deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setDeletingProductId(null);
                },
                onError: (errors) => {
                    console.error('Error deleting product:', errors);
                    setDeletingProductId(null);
                }
            });
        }
    };

    return (
        <div className="products-container">
            <div className="products-header">
                <h1 className="products-title">Product Management</h1>
                <Link href="/admin/products/create" className="create-product-btn">
                    Create New Product
                </Link>
            </div>

            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Available</th>
                            <th>Pinned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.product_category?.name || 'N/A'}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.available ? 'available' : 'unavailable'}`}>
                                        {product.available ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${product.isPinned ? 'pinned' : 'not-pinned'}`}>
                                        {product.isPinned ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Link href={`/admin/products/${product.id}`} className="action-btn view-btn">
                                        View
                                    </Link>
                                    <Link href={`/admin/products/${product.id}/edit`} className="action-btn edit-btn">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="action-btn delete-btn"
                                        disabled={deletingProductId === product.id}
                                    >
                                        {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}