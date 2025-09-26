import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

import './categories.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Categories({ productCat, blogCat, tags, flash }) {
    const [successMessage, setSuccessMessage] = useState('');

    const productForm = useForm({
        name: '',
        type: 'product'
    });

    const blogForm = useForm({
        name: '',
        type: 'blog'
    });

    const tagForm = useForm({
        name: '',
        type: 'tag'
    });

    const handleSubmit = (form) => {
        form.post('/admin/categories', {
            onSuccess: () => {
                form.reset();
                setSuccessMessage('Catégorie créée avec succès !');
                setTimeout(() => setSuccessMessage(''), 3000); 
            }
        });
    };

    const handleDelete = (type, id) => {
            router.delete(`/admin/categories/${id}`, {
                data: { type },
                onSuccess: () => {
                    setSuccessMessage('Élément supprimé avec succès !');
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            });
        
    };

    return (
        <>
            <NavAdmin/>
            <AdminHeader title="Categories"/>
     
        <div className="categories-container">
            <h1 className="categories-title">Gestion des Catégories</h1>
            
            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="category-section">
                <h2 className="section-title">Catégories Produits</h2>
                <ul className="category-list">
                    {productCat.map((cat) => (
                        <li key={cat.id} className="category-item">
                            {cat.name}
                            <button onClick={() => handleDelete('product', cat.id)} className="delete-button">Supprimer</button>
                        </li>
                    ))}
                </ul>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(productForm); }} className="category-form">
                    <input
                        type="text"
                        value={productForm.data.name}
                        onChange={(e) => productForm.setData('name', e.target.value)}
                        placeholder="Nom de la catégorie produit"
                        className="form-input"
                    />
                    <button type="submit" className="form-button product-button" disabled={productForm.processing}>Créer Produit</button>
                </form>
                {productForm.errors.name && <p className="error-message">{productForm.errors.name}</p>}
            </div>

            <div className="category-section">
                <h2 className="section-title">Catégories Blogs</h2>
                <ul className="category-list">
                    {blogCat.map((cat) => (
                        <li key={cat.id} className="category-item">
                            {cat.name}
                            <button onClick={() => handleDelete('blog', cat.id)} className="delete-button">Supprimer</button>
                        </li>
                    ))}
                </ul>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(blogForm); }} className="category-form">
                    <input
                        type="text"
                        value={blogForm.data.name}
                        onChange={(e) => blogForm.setData('name', e.target.value)}
                        placeholder="Nom de la catégorie blog"
                        className="form-input"
                    />
                    <button type="submit" className="form-button blog-button" disabled={blogForm.processing}>Créer Blog</button>
                </form>
                {blogForm.errors.name && <p className="error-message">{blogForm.errors.name}</p>}
            </div>

            <div className="category-section">
                <h2 className="section-title">Tags</h2>
                <ul className="category-list">
                    {tags.map((cat) => (
                        <li key={cat.id} className="category-item">
                            {cat.name}
                            <button onClick={() => handleDelete('tag', cat.id)} className="delete-button">Supprimer</button>
                        </li>
                    ))}
                </ul>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(tagForm); }} className="category-form">
                    <input
                        type="text"
                        value={tagForm.data.name}
                        onChange={(e) => tagForm.setData('name', e.target.value)}
                        placeholder="Nom du tag"
                        className="form-input"
                    />
                    <button type="submit" className="form-button tag-button" disabled={tagForm.processing}>Créer Tag</button>
                </form>
                {tagForm.errors.name && <p className="error-message">{tagForm.errors.name}</p>}
            </div>
        </div>
           </>
    );
}
