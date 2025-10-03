import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import './orders.css';

export default function History() {
    const { orders } = usePage().props;

    console.log('History orders:', orders);

    return (
        <>
            <Nav />
            <div className="history-page container">
                <div className="page-header">
                    <div className="page-icon">
                        <i className="fas fa-history"></i>
                    </div>
                    <h1>Order History</h1>
                    <p>View your completed orders and download invoices</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="fas fa-receipt"></i>
                        </div>
                        <h2>No Order History</h2>
                        <p>You haven't completed any orders yet</p>
                        <Link href="/shop" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <div className="order-number">{order.order_number}</div>
                                        <div className="order-date">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="order-status status-confirmed">
                                        {order.status}
                                    </div>
                                </div>

                                <div className="order-items-preview">
                                    {order.cart?.cart_products?.slice(0, 3).map((cartProduct) => (
                                        <div key={cartProduct.id} className="order-item">
                                            <img 
                                                src={cartProduct.product?.image_front ? `/storage/products/card/${cartProduct.product.image_front}` : '/storage/products/default.png'}
                                                alt={cartProduct.product?.name}
                                                onError={e => e.target.src = '/storage/products/default.png'}
                                            />
                                            <div className="order-item-details">
                                                <div className="order-item-name">{cartProduct.product?.name}</div>
                                                <div className="order-item-meta">
                                                    Qty: {cartProduct.quantity} × ${cartProduct.product?.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {order.cart?.cart_products && order.cart.cart_products.length > 3 && (
                                        <p className="text-sm text-gray-500 italic">
                                            +{order.cart.cart_products.length - 3} more items
                                        </p>
                                    )}
                                </div>

                                <div className="order-total">
                                    ${order.total}
                                </div>

                                <div className="order-actions">
                                    <Link href={`/orders/${order.id}`} className="btn-small btn-view">
                                        View Details
                                    </Link>
                                    <button className="btn-small btn-track">
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
