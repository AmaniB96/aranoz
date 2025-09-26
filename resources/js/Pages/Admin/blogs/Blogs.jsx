import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './blogs.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Blogs({ blogs, flash }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [deletingBlogId, setDeletingBlogId] = useState(null);

    const handleDelete = (blogId) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            setDeletingBlogId(blogId);
            
            router.delete(`/admin/blogs/${blogId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Blog deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setDeletingBlogId(null);
                },
                onError: (errors) => {
                    console.error('Error deleting blog:', errors);
                    setDeletingBlogId(null);
                }
            });
        }
    };

    return (
        <>
            <NavAdmin/>
            <AdminHeader title="Blogs"/>
        
        <div className="blogs-container">
            <div className="blogs-header">
                <h1 className="blogs-title">Blog Management</h1>
                <Link href="/admin/blogs/create" className="create-blog-btn">
                    Create New Blog
                </Link>
            </div>
            
            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="blogs-table">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td>{blog.title}</td>
                                <td>{blog.blog_category?.name || 'N/A'}</td>
                                <td>{blog.user ? `${blog.user.first_name} ${blog.user.name}` : 'N/A'}</td>
                                <td>{new Date(blog.date).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <Link href={`/admin/blogs/${blog.id}`} className="action-btn view-btn">
                                        View
                                    </Link>
                                    <Link href={`/admin/blogs/${blog.id}/edit`} className="action-btn edit-btn">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="action-btn delete-btn"
                                        disabled={deletingBlogId === blog.id}
                                    >
                                        {deletingBlogId === blog.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}
