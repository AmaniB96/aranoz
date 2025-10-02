import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import ProductGallery from '@/Components/Product/ProductGallery';
import ProductInfo from '@/Components/Product/ProductInfo';
import '@/Components/Product/product-detail.css';
import ShopHeader from '@/Components/Shop/ShopHeader';
import BestSellers from '@/Components/BestSellers/BestSellers';
import toast, { Toaster } from 'react-hot-toast';

export default function Show() {
    const { product, auth, bestSellers = [] } = usePage().props;
    const user = auth?.user ?? null;
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('spec');
    const [isLiked, setIsLiked] = useState(product.is_liked_by_user || false);
    const [likesCount, setLikesCount] = useState(product.liked_by_users_count || 0);
    const [isLiking, setIsLiking] = useState(false);

    console.log('Product data:', product);
    console.log('ProductDetail:', product.productDetail);
    console.log('Best sellers:', bestSellers);
    console.log('Is liked by user:', product.is_liked_by_user);

    const addToCart = async () => {
        if (!user) {
            if (confirm('You must be logged in to add products to cart. Go to login?')) {
                router.visit('/login');
            }
            return;
        }

        const payload = { product_id: product.id, qty };
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;

        if (!csrf) {
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'CSRF token missing — refresh page' } }));
            return;
        }

        try {
            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Please login to add products to cart' } }));
                return;
            }

            const json = await res.json();

            if (json.success) {
                window.dispatchEvent(new CustomEvent('cart:added', {
                    detail: {
                        cartCount: typeof json.cartCount === 'number' ? json.cartCount : null,
                        productId: product.id,
                        qty,
                        name: product.name,
                        image: product.image_url
                    }
                }));
            } else {
                window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: json.message || 'Could not add to cart' } }));
            }
        } catch (err) {
            console.error(err);
            window.dispatchEvent(new CustomEvent('cart:add-failed', { detail: { message: 'Network error' } }));
        }
    };

    const handleLike = (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to like products');
            return;
        }

        setIsLiking(true);

        router.post(`/products/${product.id}/like`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Toggle local state optimistically
                const newLikedState = !isLiked;
                setIsLiked(newLikedState);
                setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
                
                // Show success message from flash
                const flashSuccess = page.props.flash?.success;
                if (flashSuccess) {
                    toast.success(flashSuccess, {
                        duration: 2000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    });
                }
                setIsLiking(false);
            },
            onError: (errors) => {
                const flashError = page.props.flash?.error;
                if (flashError) {
                    toast.error(flashError);
                } else {
                    toast.error('Could not toggle like');
                }
                setIsLiking(false);
            },
            onFinish: () => {
                setIsLiking(false);
            }
        });
    };

    return (
        <>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            
            <ShopHeader/>
            <div className="product-page">
                <div className="product-container container">
                    <div className="product-left">
                        <ProductGallery gallery={product.gallery} main={product.image_url} />
                    </div>

                    <div className="product-right">
                        <ProductInfo
                            product={product}
                            qty={qty}
                            setQty={setQty}
                            onAddToCart={addToCart}
                            onLike={handleLike}
                            isLiked={isLiked}
                            likesCount={likesCount}
                            isLiking={isLiking}
                        />
                    </div>
                </div>

                <div className="product-tabs container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab ${activeTab === 'spec' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spec')}
                        >
                            Specification
                        </button>
                        <button
                            className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('comments')}
                        >
                            Comments
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="description-content">
                                <p style={{ color: '#555', lineHeight: 1.8 }}>
                                    {product.description || '—'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'spec' && (
                            <div className="spec-table">
                                <table>
                                    <tbody>
                                        <tr><td>Width</td><td>{product.productDetail?.width ?? '—'}</td></tr>
                                        <tr><td>Height</td><td>{product.productDetail?.height ?? '—'}</td></tr>
                                        <tr><td>Depth</td><td>{product.productDetail?.depth ?? '—'}</td></tr>
                                        <tr><td>Weight</td><td>{product.productDetail?.weight ?? '—'}</td></tr>
                                        <tr><td>Quality checking</td><td>{product.productDetail?.quality_checking ? 'yes' : 'no'}</td></tr>
                                        <tr><td>Freshness Duration</td><td>{product.productDetail?.freshness_duration ?? '—'}</td></tr>
                                        <tr><td>When packaging</td><td>{product.productDetail?.packaging_date ? product.productDetail.packaging_date : (product.productDetail?.box_content ?? '—')}</td></tr>
                                        <tr><td>Each Box contains</td><td>{product.productDetail?.box_content ?? '—'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div className="comments-content">
                                <form className="comment-form" onSubmit={(e) => e.preventDefault()}>
                                    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                        <input type="text" placeholder="Your name" style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid #eee' }} />
                                        <input type="email" placeholder="Your email" style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid #eee' }} />
                                    </div>
                                    <div style={{ marginBottom: 12 }}>
                                        <textarea placeholder="Your comment" rows="6" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #eee' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <button type="submit" className="btn-add-to-cart" style={{ padding: '10px 18px' }}>Post Comment</button>
                                        <span style={{ color: '#999' }}>Preview only — form not functional yet</span>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <BestSellers products={bestSellers} />
            </div>
        </>
    );
}