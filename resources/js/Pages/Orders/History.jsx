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
                                    {order.cart?.cart_products?.map((cartProduct) => {
                                        const product = cartProduct.product;
                                        // CORRECTION : utiliser image_front au lieu de image_panier
                                        const imageUrl = product?.image_front 
                                            ? `/storage/products/card/${product.image_front}`
                                            : '/public/images/placeholder.png';
                                        
                                        // Calculer le prix avec promo
                                        let unitPrice = parseFloat(product?.price || 0);
                                        if (product?.promo && product.promo.active) {
                                            unitPrice = unitPrice * (1 - product.promo.discount / 100);
                                        }
                                        
                                        return (
                                            <div key={cartProduct.id} className="order-item">
                                                <img 
                                                    src={imageUrl}
                                                    alt={product?.name}
                                                    onError={e => e.target.src = '/public/images/placeholder.png'}
                                                />
                                                <div className="item-details">
                                                    <h4>{product?.name}</h4>
                                                    <p>Qty: {cartProduct.quantity}</p>
                                                    <p>${unitPrice.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {order.cart?.cart_products && order.cart.cart_products.length > 3 && (
                                        <p className="text-sm text-gray-500 italic">
                                            +{order.cart.cart_products.length - 3} more items
                                        </p>
                                    )}
                                </div>

                                <div className="order-total">
                                    ${order.total} 
                                    {parseFloat(order.discount_amount) > 0 && order.coupon_code && (
                                        <div className="order-discount">
                                            <small className="text-green-600">
                                                -${order.discount_amount} ({order.coupon_code})
                                            </small>
                                        </div>
                                    )}
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
