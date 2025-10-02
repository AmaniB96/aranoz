import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import BlogHeader from '@/Pages/Blog/BlogHeader';
import '@/Pages/Blog/blog.css';

export default function Blog() {
    const { blogs = [], categories = [], tags = [], recentPosts = [] } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('en', { month: 'short' })
        };
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.article.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageError = (e) => {
        if (e.target.src !== 'https://via.placeholder.com/600x400/f8f9fa/666?text=Blog+Image') {
            e.target.src = 'https://via.placeholder.com/600x400/f8f9fa/666?text=Blog+Image';
        }
    };

    return (
        <>
            <BlogHeader />
            <div className="blog-page">
                <div className="container blog-container">
                    <div className="blog-main">
                        <div className="blog-posts">
                            {filteredBlogs.map(blog => {
                                const dateFormatted = formatDate(blog.date);
                                return (
                                    <article key={blog.id} className="blog-post">
                                        <div className="blog-post-image">
                                            <img 
                                                src={blog.image || 'https://via.placeholder.com/600x400/f8f9fa/666?text=Blog+Image'} 
                                                alt={blog.title}
                                                onError={handleImageError}
                                            />
                                            <div className="blog-date">
                                                <span className="date-day">{dateFormatted.day}</span>
                                                <span className="date-month">{dateFormatted.month}</span>
                                            </div>
                                        </div>
                                        <div className="blog-post-content">
                                            <h3 className="blog-post-title">
                                                <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                                            </h3>
                                            <p className="blog-post-excerpt">
                                                {blog.article.substring(0, 150)}...
                                            </p>
                                            <div className="blog-post-meta">
                                                <span className="meta-item">
                                                    <i className="fas fa-user"></i> {blog.user?.name || 'Anonymous'}
                                                </span>
                                                <span className="meta-item">
                                                    <i className="fas fa-comments"></i> {blog.comments_count} Comments
                                                </span>
                                            </div>
                                            <div className="blog-post-actions">
                                                <Link href={`/blog/${blog.id}`} className="read-more-btn">
                                                    Read More <i className="fas fa-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="blog-sidebar">
                        <div className="sidebar-widget search-widget">
                            <input
                                type="text"
                                placeholder="Search Keywords"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button className="search-btn">SEARCH</button>
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
                                                {dateFormatted.day} {dateFormatted.month}
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
                            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Your email" className="newsletter-input" />
                                <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}