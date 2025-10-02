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
                            <div className="user-info">
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
                    </div>
                </div>
            </div>
        </>
    );
}