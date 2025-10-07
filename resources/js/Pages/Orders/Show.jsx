import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import './orders.css';

export default function Show() {
    const { order, total, subtotal, discount, couponCode } = usePage().props; // AJOUT DES NOUVELLES PROPS

    console.log('Show order:', order);

    return (
        <>
            <Nav />
            <div className="success-page container">
                <div className="success-header">
                    <h1>Order #{order.order_number}</h1>
                    <p>Order details and status</p>
                </div>

                <div className="order-summary">
                    <div className="order-info">
                        <h2>Order Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Order Number:</span>
                                <span className="value">{order.order_number}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Order Date:</span>
                                <span className="value">
                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="label">Status:</span>
                                <span className={`value status-${order.status.toLowerCase()}`}>
                                    {order.status === 'pending' ? 'Pending' : 'Confirmed'}
                                </span>
                            </div>
                            {subtotal && (
                                <div className="info-item">
                                    <span className="label">Subtotal:</span>
                                    <span className="value">${subtotal}</span>
                                </div>
                            )}
                            {discount > 0 && couponCode && (
                                <div className="info-item">
                                    <span className="label">Discount ({couponCode}):</span>
                                    <span className="value discount">-${discount}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="label">Total Amount:</span>
                                <span className="value total text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                    ${total}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="order-items">
                        <h2>Order Items</h2>
                        <div className="items-list">
                            {order.cart?.cart_products?.map((cartProduct) => (
                                <div key={cartProduct.id} className="item-card">
                                    <div className="item-image">
                                        <img
                                            src={cartProduct.product?.image_front ? `/storage/products/card/${cartProduct.product.image_front}` : '/storage/products/default.png'}
                                            alt={cartProduct.product?.name}
                                            onError={e => e.target.src = '/storage/products/default.png'}
                                        />
                                    </div>
                                    <div className="item-details">
                                        <h3>{cartProduct.product?.name}</h3>
                                        <div className="item-meta">
                                            <span className="quantity">Qty: {cartProduct.quantity}</span>
                                            <span className="price">${cartProduct.product?.price}</span>
                                        </div>
                                        <div className="item-total">
                                            Total: ${(cartProduct.quantity * (cartProduct.product?.price || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <Link
                        href="/shop"
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                    >
                        Continue Shopping
                    </Link>
                    {order.status === 'confirmed' && (
                        <Link
                            href="/orders/history"
                            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                            View Order History
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
