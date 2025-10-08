import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import './orders.css';

export default function Success() {
    const { order, total, subtotal, discount, couponCode } = usePage().props;
    
    console.log('Order data:', order);
    console.log('Order items:', order.items);

    return (
        <>
            <Nav />
            <div className="success-page container">
                <div className="success-header">
                    <div className="success-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for your purchase. Your order has been confirmed.</p>
                </div>

                <div className="order-summary">
                    <div className="order-info">
                        <h2>Order Details</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Order Number:</span>
                                <span className="value">{order.order_number}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Order Date:</span>
                                <span className="value">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Status:</span>
                                <span className="value status-pending">{order.status}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Subtotal:</span>
                                <span className="value">${Number(subtotal).toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="info-item">
                                    <span className="label">Discount ({couponCode}):</span>
                                    <span className="value discount">-${Number(discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="label">Total Amount:</span>
                                <span className="value total">${Number(total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-items">
                        <h2>Order Items</h2>
                        <div className="items-list">
                            {order.items?.map((item) => {
                                // CORRECTION : Construire le bon chemin d'image
                                const imageUrl = item.image 
                                    ? `/storage/products/panier/${item.image}`
                                    : '/public/images/placeholder.png';
                                
                                return (
                                    <div key={item.id} className="item-card">
                                        <div className="item-image">
                                            <img 
                                                src={cartProduct.product?.image_front ? `/storage/products/card/${cartProduct.product.image_front}` : 'public/images/placeholder.png'}
                                                alt={cartProduct.product?.name}
                                                onError={e => e.target.src = 'public/images/placeholder.png'}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <div className="item-meta">
                                                <span className="quantity">Qty: {item.quantity}</span>
                                                <span className="price">${Number(item.unit_price).toFixed(2)}</span>
                                            </div>
                                            <div className="item-total">
                                                Total: ${Number(item.total).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <Link href="/orders/tracking" className="btn-primary">
                        <i className="fas fa-shipping-fast"></i>
                        Track Order
                    </Link>
                    <Link href="/shop" className="btn-secondary">
                        <i className="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </>
    );
}
