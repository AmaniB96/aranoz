import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import NavAdmin from '@/Pages/Admin/components/NavAdmin';
import AdminHeader from '@/Pages/Admin/components/AdminHeader';
import './promo.css'

export default function PromoEdit() {
    const { promo } = usePage().props;
    const isEditing = !!promo;

    const { data, setData, post, put, processing, errors } = useForm({
        name: promo?.name || '',
        discount: promo?.discount || '',
        active: promo?.active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('promos.update', promo.id));
        } else {
            post(route('promos.store'));
        }
    };

    return (
        <>
            <NavAdmin />
            <div className="admin-content">
                <AdminHeader
                    title={isEditing ? 'Edit Promotion' : 'Create Promotion'}
                    breadcrumb={`Admin / Promotions / ${isEditing ? 'Edit' : 'Create'}`}
                />

                <div className="admin-section">
                    <form onSubmit={submit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="name">Promotion Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={errors.name ? 'error' : ''}
                                required
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="discount">Discount Percentage *</label>
                            <input
                                type="number"
                                id="discount"
                                value={data.discount}
                                onChange={e => setData('discount', e.target.value)}
                                className={errors.discount ? 'error' : ''}
                                min="0"
                                max="100"
                                step="0.01"
                                required
                            />
                            {errors.discount && <span className="error-text">{errors.discount}</span>}
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={data.active}
                                    onChange={e => setData('active', e.target.checked)}
                                />
                                Active
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Saving...' : (isEditing ? 'Update Promotion' : 'Create Promotion')}
                            </button>
                            <a href={route('promos.index')} className="btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}