import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import BlogHeader from '@/Pages/Blog/BlogHeader';
import toast, { Toaster } from 'react-hot-toast';
import '@/Pages/Blog/blog.css';

export default function Show() {
    const { blog, categories = [], tags = [], recentPosts = [], auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const user = auth?.user ?? null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('en', { month: 'short' }),
            year: date.getFullYear()
        };
    };

    const formatCommentDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleImageError = (e) => {
        if (e.target.src !== 'https://via.placeholder.com/800x400/f8f9fa/666?text=Blog+Image') {
            e.target.src = 'https://via.placeholder.com/800x400/f8f9fa/666?text=Blog+Image';
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to post a comment');
            return;
        }
        
        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setIsSubmitting(true);

        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrf = tokenMeta?.content ?? null;

        if (!csrf) {
            toast.error('CSRF token missing — refresh page');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`/blog/${blog.id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({ comment: commentText })
            });

            const json = await res.json();

            if (json.success) {
                setCommentText('');
                toast.success('Comment posted successfully!');
                
                // Recharger après un délai pour permettre au toast de s'afficher
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast.error(json.message || 'Could not post comment');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            toast.success(`Searching for: ${searchTerm}`);
            // Ici tu peux implémenter la recherche réelle
        }
    };

    return (
        <>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            
            <BlogHeader />
            <div className="blog-single-page">
                <div className="container blog-container">
                    <div className="blog-single-main">
                        <article className="blog-single-post">
                            <div className="blog-single-image">
                                <img 
                                    src={blog.image || 'https://via.placeholder.com/800x400/f8f9fa/666?text=Blog+Image'} 
                                    alt={blog.title}
                                    onError={handleImageError}
                                />
                            </div>

                            <div className="blog-single-content">
                                <h1 className="blog-single-title">{blog.title}</h1>
                                
                                <div className="blog-single-meta">
                                    <span className="meta-item">
                                        <i className="fas fa-user"></i> {blog.user?.name || 'Anonymous'}
                                    </span>
                                    <span className="meta-item">
                                        <i className="fas fa-comments"></i> {blog.comments?.length || 0} Comments
                                    </span>
                                    {blog.category && (
                                        <span className="meta-item">
                                            <i className="fas fa-folder"></i> {blog.category.name}
                                        </span>
                                    )}
                                </div>

                                <div className="blog-single-article">
                                    <p>{blog.article}</p>
                                </div>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="blog-single-tags">
                                        <span className="tags-label">Tags:</span>
                                        <div className="tags-list">
                                            {blog.tags.map(tag => (
                                                <Link key={tag.id} href={`/blog/tag/${tag.id}`} className="tag">
                                                    {tag.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>

                        <div className="comments-section">
                            <h3 className="comments-title">{blog.comments?.length || 0} Comments</h3>
                            
                            <div className="comments-list">
                                {blog.comments && blog.comments.length > 0 ? (
                                    blog.comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-avatar">
                                                <i className="fas fa-user-circle"></i>
                                            </div>
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-author">
                                                        {comment.user?.name || 'Anonymous'}
                                                    </span>
                                                    <span className="comment-date">
                                                        {formatCommentDate(comment.created_at)}
                                                    </span>
                                                </div>
                                                <div className="comment-text">
                                                    {comment.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                )}
                            </div>

                            <div className="comment-form-section">
                                <h4 className="form-title">Leave a Comment</h4>
                                {user ? (
                                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                                        <div className="form-group">
                                            <textarea 
                                                placeholder="Your Comment" 
                                                rows="6" 
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="submit-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="login-prompt">
                                        <p>You must be <Link href="/login" className="login-link">logged in</Link> to post a comment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="blog-sidebar">
                        <div className="sidebar-widget search-widget">
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Search Keywords"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <button type="submit" className="search-btn">SEARCH</button>
                            </form>
                        </div>

                        <div className="sidebar-widget category-widget">
                            <h4 className="widget-title">Category</h4>
                            <ul className="category-list">
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <Link href={`/blog/category/${category.id}`}>
                                            {category.name} ({category.blogs_count || 0})
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sidebar-widget recent-posts-widget">
                            <h4 className="widget-title">Recent Post</h4>
                            <div className="recent-posts">
                                {recentPosts.map(post => {
                                    const dateFormatted = formatDate(post.date);
                                    return (
                                        <div key={post.id} className="recent-post">
                                            <span className="recent-date">
                                                {dateFormatted.month} {dateFormatted.day}, {dateFormatted.year.toString().slice(-2)}
                                            </span>
                                            <Link href={`/blog/${post.id}`} className="recent-title">
                                                {post.title}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="sidebar-widget tags-widget">
                            <h4 className="widget-title">Tag Clouds</h4>
                            <div className="tag-cloud">
                                {tags.map(tag => (
                                    <Link key={tag.id} href={`/blog/tag/${tag.id}`} className="tag">
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-widget newsletter-widget">
                            <h4 className="widget-title">Newsletter</h4>
                            <form className="newsletter-form" onSubmit={(e) => {
                                e.preventDefault();
                                const email = e.target.email.value;
                                if (email) {
                                    toast.success('Newsletter subscription successful!');
                                    e.target.reset();
                                }
                            }}>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Your email" 
                                    className="newsletter-input" 
                                    required
                                />
                                <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}