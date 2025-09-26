import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import './blogEdit.css';

export default function BlogEdit({ blog, categories, tags, flash }) {
    const isEditing = !!blog;
    
    const { data, setData, post, put, processing, errors } = useForm({
        title: blog?.title || '',
        article: blog?.article || '',
        image: blog?.image || '',
        blog_category_id: blog?.blog_category_id || '',
        user_id: blog?.user_id || '',
        date: blog?.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tags: blog?.tags?.map(tag => tag.id) || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(`/admin/blogs/${blog.id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by redirect
                }
            });
        } else {
            post('/admin/blogs', {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by redirect
                }
            });
        }
    };

    const handleTagChange = (tagId) => {
        const currentTags = data.tags;
        if (currentTags.includes(tagId)) {
            setData('tags', currentTags.filter(id => id !== tagId));
        } else {
            setData('tags', [...currentTags, tagId]);
        }
    };

    return (
        <div className="blog-edit-container">
            <div className="blog-edit-header">
                <h1 className="blog-edit-title">
                    {isEditing ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <a href="/admin/blogs" className="back-btn">
                    Back to Blogs
                </a>
            </div>

            {flash?.success && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="article">Article *</label>
                    <textarea
                        id="article"
                        value={data.article}
                        onChange={(e) => setData('article', e.target.value)}
                        rows="10"
                        className={errors.article ? 'error' : ''}
                    />
                    {errors.article && <span className="error-message">{errors.article}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                        type="text"
                        id="image"
                        value={data.image}
                        onChange={(e) => setData('image', e.target.value)}
                        placeholder="e.g., blog/image.jpg"
                        className={errors.image ? 'error' : ''}
                    />
                    {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="blog_category_id">Category *</label>
                        <select
                            id="blog_category_id"
                            value={data.blog_category_id}
                            onChange={(e) => setData('blog_category_id', e.target.value)}
                            className={errors.blog_category_id ? 'error' : ''}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.blog_category_id && <span className="error-message">{errors.blog_category_id}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="user_id">Author *</label>
                        <input
                            type="number"
                            id="user_id"
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            placeholder="User ID"
                            className={errors.user_id ? 'error' : ''}
                        />
                        {errors.user_id && <span className="error-message">{errors.user_id}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            type="date"
                            id="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className={errors.date ? 'error' : ''}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-container">
                        {tags.map((tag) => (
                            <label key={tag.id} className="tag-checkbox">
                                <input
                                    type="checkbox"
                                    checked={data.tags.includes(tag.id)}
                                    onChange={() => handleTagChange(tag.id)}
                                />
                                {tag.name}
                            </label>
                        ))}
                    </div>
                    {errors.tags && <span className="error-message">{errors.tags}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={processing} className="submit-btn">
                        {processing ? 'Saving...' : (isEditing ? 'Update Blog' : 'Create Blog')}
                    </button>
                </div>
            </form>
        </div>
    );
}