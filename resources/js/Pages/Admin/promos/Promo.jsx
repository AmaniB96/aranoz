import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import NavAdmin from '@/Pages/Admin/components/NavAdmin';
import AdminHeader from '@/Pages/Admin/components/AdminHeader';
import './promo.css'

export default function Promo() {
    const { promos } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(route('promos.destroy', id));
        }
    };

    return (
        <>
            <NavAdmin />
            <div className="admin-content">
                <AdminHeader
                    title="Promotions"
                    breadcrumb="Admin / Promotions"
                />

                <div className="admin-section">
                    <div className="section-header">
                        <h2>All Promotions</h2>
                        <Link href={route('promos.create')} className="btn-primary">
                            + Create Promotion
                        </Link>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Discount</th>
                                    <th>Status</th>
                                    <th>Products</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promos.map(promo => (
                                    <tr key={promo.id}>
                                        <td>{promo.name}</td>
                                        <td>{promo.discount}%</td>
                                        <td>
                                            <span className={`status ${promo.active ? 'active' : 'inactive'}`}>
                                                {promo.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{promo.products_count}</td>
                                        <td className="actions">
                                            <Link href={route('promos.show', promo.id)} className="btn-sm">
                                                View
                                            </Link>
                                            <Link href={route('promos.edit', promo.id)} className="btn-sm secondary">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="btn-sm danger"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}