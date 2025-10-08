import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import './orders.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Orders({ orders, flash }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

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

    // Filtrer et trier les commandes
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;

        // Filtrer par statut
        if (filterStatus !== 'all') {
            filtered = filtered.filter(order => order.status === filterStatus);
        }

        // Filtrer par terme de recherche (numéro de commande, nom, email)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(order => 
                order.order_number?.toLowerCase().includes(term) ||
                `${order.cart?.user?.first_name} ${order.cart?.user?.name}`.toLowerCase().includes(term) ||
                order.cart?.user?.email?.toLowerCase().includes(term) ||
                order.id.toString().includes(term)
            );
        }

        // Trier
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'amount':
                    aValue = parseFloat(a.total_amount);
                    bValue = parseFloat(b.total_amount);
                    break;
                case 'customer':
                    aValue = `${a.cart?.user?.first_name} ${a.cart?.user?.name}`.toLowerCase();
                    bValue = `${b.cart?.user?.first_name} ${b.cart?.user?.name}`.toLowerCase();
                    break;
                case 'order_number':
                    aValue = a.order_number || a.id.toString();
                    bValue = b.order_number || b.id.toString();
                    break;
                default:
                    aValue = a.id;
                    bValue = b.id;
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [orders, filterStatus, searchTerm, sortBy, sortOrder]);

    // Statistiques
    const stats = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        revenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
    }), [orders]);

    const formatOrderNumber = (order) => {
        return order.order_number || `#${order.id}`;
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <>
            <NavAdmin/>
            <AdminHeader title="Orders Management"/>
       
            <div className="orders-container">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-details">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-details">
                            <span className="stat-value">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card confirmed">
                        <div className="stat-details">
                            <span className="stat-value">{stats.confirmed}</span>
                            <span className="stat-label">Confirmed</span>
                        </div>
                    </div>
                    <div className="stat-card revenue">
                        <div className="stat-details">
                            <span className="stat-value">${stats.revenue.toFixed(2)}</span>
                            <span className="stat-label">Total Revenue</span>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {(flash?.success || successMessage) && (
                    <div className="success-message">
                        ✓ {flash?.success || successMessage}
                    </div>
                )}

                {/* Filters and Search */}
                <div className="controls-section">
                    <div className="search-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by order number, customer name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    <div className="filters-section">
                        <div className="filter-group">
                            <label>Status:</label>
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                            </select>
                        </div>
                        
                        <div className="results-count">
                            Showing {filteredAndSortedOrders.length} of {orders.length} orders
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('order_number')} className="sortable">
                                    Order Number {getSortIcon('order_number')}
                                </th>
                                <th onClick={() => handleSort('customer')} className="sortable">
                                    Customer {getSortIcon('customer')}
                                </th>
                                <th>Email</th>
                                <th onClick={() => handleSort('date')} className="sortable">
                                    Date {getSortIcon('date')}
                                </th>
                                <th>Items</th>
                                <th onClick={() => handleSort('amount')} className="sortable">
                                    Amount {getSortIcon('amount')}
                                </th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedOrders.map((order) => (
                                <tr key={order.id} className={selectedOrder?.id === order.id ? 'selected' : ''}>
                                    <td>
                                        <span className="order-number">{formatOrderNumber(order)}</span>
                                    </td>
                                    <td>
                                        <div className="customer-info">
                                            <span className="customer-name">
                                                {order.cart?.user ? `${order.cart.user.first_name} ${order.cart.user.name}` : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="email">{order.cart?.user?.email || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            <span className="date">{new Date(order.date).toLocaleDateString()}</span>
                                            <span className="time">{new Date(order.date).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="quantity-badge">{order.total_quantity}</span>
                                    </td>
                                    <td>
                                        <span className="amount">${order.total_amount}</span>
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`status-select status-${order.status} ${updatingOrderId === order.id ? 'updating' : ''}`}
                                            disabled={updatingOrderId === order.id}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                        </select>
                                        {updatingOrderId === order.id && (
                                            <span className="updating-spinner">⏳</span>
                                        )}
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-view-details"
                                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                        >
                                            {selectedOrder?.id === order.id ? ' Hide' : ' View'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Details Panel */}
                {selectedOrder && (
                    <div className="order-details-panel">
                        <div className="panel-header">
                            <h3>Order Details - {formatOrderNumber(selectedOrder)}</h3>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
                        </div>
                        <div className="panel-content">
                            <div className="detail-grid">
                                <div className="detail-section">
                                    <h4>Customer Information</h4>
                                    <div className="detail-item">
                                        <strong>Name:</strong> {selectedOrder.cart?.user ? `${selectedOrder.cart.user.first_name} ${selectedOrder.cart.user.name}` : 'N/A'}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Email:</strong> {selectedOrder.cart?.user?.email || 'N/A'}
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4>Order Information</h4>
                                    <div className="detail-item">
                                        <strong>Order Number:</strong> {formatOrderNumber(selectedOrder)}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Total Items:</strong> {selectedOrder.total_quantity}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Total Amount:</strong> <span className="amount-highlight">${selectedOrder.total_amount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Status:</strong> <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredAndSortedOrders.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No orders found</h3>
                        <p>
                            {searchTerm ? 
                                `No orders match "${searchTerm}". Try a different search term.` : 
                                'There are no orders matching your filter criteria.'
                            }
                        </p>
                        {searchTerm && (
                            <button 
                                className="clear-search-btn"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}