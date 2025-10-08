import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductCard({ product, onUnliked }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;
    const [isLiked, setIsLiked] = useState(product.is_liked_by_user || false);
    const [likesCount, setLikesCount] = useState(product.liked_by_users_count || 0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        setIsLiked(product.is_liked_by_user || false);
        setLikesCount(product.liked_by_users_count || 0);
    }, [product.is_liked_by_user, product.liked_by_users_count]);

    const addToCart = async (e) => {
        e.preventDefault();

        if (!user) {
            if (confirm('You must be logged in to add products to cart. Go to login?')) {
                router.visit('/login');
            }
            return;
        }

        const payload = { product_id: product.id, qty: 1 };
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
                        qty: 1,
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
                const newLikedState = !isLiked;
                setIsLiked(newLikedState);
                setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
                
                if (!newLikedState && onUnliked) {
                    onUnliked(product.id);
                }
                
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

    const handleUnlike = async () => {
        if (onUnliked) {
            try {
                await router.delete(`/liked-products/${product.id}`);
                onUnliked(product.id);
            } catch (error) {
                console.error('Failed to unlike product:', error);
            }
        }
    };

    const hasPromo = product.promo && product.promo.active;
    const originalPrice = parseFloat(product.price);
    const discountedPrice = hasPromo 
        ? originalPrice * (1 - product.promo.discount / 100)
        : null;

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
            
            <article className="product-card">
                <Link href={`/products/${product.id}`} className="product-link">
                    <div className="product-thumb">
                        <img 
                            src={product.image_url} 
                            alt={product.name}
                            loading="lazy"
                        />
                        
                        {hasPromo && (
                            <div className="badge-promo">
                                -{product.promo.discount}%
                            </div>
                        )}

                        {onUnliked && (
                            <button onClick={handleUnlike} className="unlike-button">
                                ❤️
                            </button>
                        )}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                </Link>

                <div className="product-meta">
                    <div className="product-price">
                        {hasPromo ? (
                            <>
                                <span className="price-original">${originalPrice.toFixed(2)}</span>
                                <span className="price-discounted">${discountedPrice.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="price-current">${originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="product-actions">
                        <button onClick={addToCart} className="btn-add">+ Add to cart</button>
                        <button 
                            onClick={handleLike}
                            className={`btn-like ${isLiked ? 'liked' : ''} ${isLiking ? 'loading' : ''}`}
                            disabled={isLiking}
                            title={isLiked ? 'Unlike this product' : 'Like this product'}
                        >
                            <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} 
                               style={isLiked ? {color: '#de5445'} : {}}></i>
                        </button>
                    </div>
                </div>
            </article>
        </>
    );
}