import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ProductCard from '@/Components/Shop/ProductCard';
import './profile-tabs.css';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth, likedProducts = [], debug, flash } = usePage().props;
    const user = auth?.user ?? null;
    const [activeTab, setActiveTab] = useState('profile');
    const [localLikedProducts, setLocalLikedProducts] = useState(likedProducts);

    useEffect(() => {
        setLocalLikedProducts(likedProducts);
    }, [likedProducts]);

    useEffect(() => {
        if (flash?.success) {
       
        }
    }, [flash]);

    const handleProductUnliked = (productId) => {
        setLocalLikedProducts(prev => prev.filter(product => product.id !== productId));
    };

    return (
        <>
            <Head title="Profile" />
            <Nav />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="profile-header">
                            <div className="user-avatar">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <div className="users-info">
                                <h1>{user?.name}</h1>
                                <p>{user?.email}</p>
                                <span className="member-since">
                                    Member since {user ? new Date(user.created_at).getFullYear() : ''}
                                </span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="profile-tabs">
                            <button 
                                className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile Information
                            </button>
                            <button 
                                className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
                                onClick={() => setActiveTab('liked')}
                            >
                                Liked Products ({localLikedProducts.length})
                            </button>
                            <button 
                                className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tracking')}
                            >
                                Order Tracking
                            </button>
                            <button 
                                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                Order History
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 'profile' && (
                            <>
                                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>

                                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>

                                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            </>
                        )}

                        {activeTab === 'liked' && (
                            <div className="bg-white shadow sm:rounded-lg">
                                <div className="liked-products-tab">
                                    {localLikedProducts.length > 0 ? (
                                        <div className="products-grid">
                                            {localLikedProducts.map((product) => (
                                                <ProductCard 
                                                    key={product.id} 
                                                    product={product}
                                                    onUnliked={() => handleProductUnliked(product.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-icon">
                                                <i className="fas fa-heart-broken"></i>
                                            </div>
                                            <h3>No liked products yet</h3>
                                            <p>Start browsing and click the heart icon to like products!</p>
                                            <Link href="/shop" className="btn-primary">
                                                Browse Products
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tracking' && (
                            <div className="bg-white shadow sm:rounded-lg p-8">
                                <div className="text-center">
                                    <div className="mb-6">
                                        <svg className="w-20 h-20 mx-auto text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Your Orders</h3>
                                    <p className="text-gray-600 mb-6">
                                        View the status and details of all your pending orders
                                    </p>
                                    <Link
                                        href="/orders/tracking"
                                        className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                                    >
                                        Go to Order Tracking
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white shadow sm:rounded-lg p-8">
                                <div className="text-center">
                                    <div className="mb-6">
                                        <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Order History</h3>
                                    <p className="text-gray-600 mb-6">
                                        Review all your completed and delivered orders
                                    </p>
                                    <Link
                                        href="/orders/history"
                                        className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-lg"
                                    >
                                        View Order History
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}