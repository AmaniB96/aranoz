import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import './orders.css';

export default function Orders({ orders, flash }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const handleStatusChange = (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        
        router.put(`/admin/orders/${orderId}`, 
            { status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Status updated successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setUpdatingOrderId(null);
                },
                onError: (errors) => {
                    console.error('Error updating status:', errors);
                    setUpdatingOrderId(null);
                }
            }
        );
    };

    return (
        <div className="orders-container">
            <h1 className="orders-title">Order Management</h1>
            
            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Order Number</th>
                            <th>Date</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.cart?.user ? `${order.cart.user.first_name} ${order.cart.user.name}` : 'N/A'}</td>
                                <td>{order.cart?.user?.email || 'N/A'}</td>
                                <td>{order.id}</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td>{order.total_quantity}</td>
                                <td>${order.total_amount}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`status-dropdown ${updatingOrderId === order.id ? 'updating' : ''}`}
                                        disabled={updatingOrderId === order.id}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                    </select>
                                    {updatingOrderId === order.id && (
                                        <span className="updating-text">Updating...</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}