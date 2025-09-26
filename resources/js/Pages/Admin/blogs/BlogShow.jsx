import React from 'react';
import { Link } from '@inertiajs/react';
import './blogShow.css';

export default function BlogShow({ blog, flash }) {
    return (
        <div className="blog-show-container">
            <div className="blog-show-header">
                <h1 className="blog-show-title">{blog.title}</h1>
                <div className="blog-show-actions">
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="edit-blog-btn">
                        Edit Blog
                    </Link>
                    <Link href="/admin/blogs" className="back-btn">
                        Back to Blogs
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <div className="blog-content">
                <div className="blog-meta">
                    <p><strong>Category:</strong> {blog.blog_category?.name || 'N/A'}</p>
                    <p><strong>Author:</strong> {blog.user ? `${blog.user.first_name} ${blog.user.name}` : 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}</p>
                    <p><strong>Tags:</strong> {blog.tags?.map(tag => tag.name).join(', ') || 'None'}</p>
                </div>

                {blog.image && (
                    <div className="blog-image">
                        <img src={`/storage/blogs/${blog.image}`} alt={blog.title} />
                    </div>
                )}

                <div className="blog-article">
                    <h2>Article Content</h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.article }} />
                </div>

                <div className="blog-comments">
                    <h2>Comments ({blog.blog_comments?.length || 0})</h2>
                    {blog.blog_comments && blog.blog_comments.length > 0 ? (
                        <div className="comments-list">
                            {blog.blog_comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-header">
                                        <strong>{comment.user ? `${comment.user.first_name} ${comment.user.name}` : 'Anonymous'}</strong>
                                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p>{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}