import React, { useState, useMemo } from 'react';
import { usePage, Link } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import './orders.css';

export default function Tracking() {
    const { orders } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    console.log('Tracking orders:', orders);

    // FILTRER LES COMMANDES PAR NUMÉRO DE COMMANDE
    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) {
            return orders;
        }
        
        return orders.filter(order => 
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    return (
        <>
            <Nav />
            <div className="tracking-page container">
                <div className="page-header">
                    <div className="page-icon">
                        <i className="fas fa-shipping-fast"></i>
                    </div>
                    <h1>Track Your Orders</h1>
                    <p>Monitor the status of your pending orders</p>
                    
                    {/* CHAMP DE RECHERCHE */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search by order number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="clear-search"
                                title="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="fas fa-inbox"></i>
                        </div>
                        <h2>
                            {searchTerm ? 'No Orders Found' : 'No Pending Orders'}
                        </h2>
                        <p>
                            {searchTerm 
                                ? `No orders match "${searchTerm}"` 
                                : "You don't have any orders in progress"
                            }
                        </p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="btn-secondary"
                            >
                                Clear Search
                            </button>
                        )}
                        <Link href="/shop" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {searchTerm && (
                            <div className="search-results">
                                <p>Found {filteredOrders.length} order(s) matching "{searchTerm}"</p>
                            </div>
                        )}
                        
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <div className="order-number">{order.order_number}</div>
                                        <div className="order-date">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="order-status status-pending">
                                        {order.status}
                                    </div>
                                </div>

                                <div className="order-items-preview">
                                    {order.cart?.cart_products?.slice(0, 3).map((cartProduct) => {
                                        const product = cartProduct.product;
                                        // CORRECTION : utiliser image_front
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
                                                <div className="order-item-details">
                                                    <div className="order-item-name">{product?.name}</div>
                                                    <div className="order-item-meta">
                                                        Qty: {cartProduct.quantity} × ${unitPrice.toFixed(2)}
                                                    </div>
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
                                    ${Number(order.total).toFixed(2)} {/* MONTANT FINAL PAYÉ */}
                                    {Number(order.discount_amount) > 0 && order.coupon_code && (
                                        <div className="order-discount">
                                            <small className="text-green-600">
                                                -${Number(order.discount_amount).toFixed(2)} ({order.coupon_code})
                                            </small>
                                        </div>
                                    )}
                                </div>

                                <div className="order-actions">
                                    <Link href={`/orders/${order.id}`} className="btn-small btn-view">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
